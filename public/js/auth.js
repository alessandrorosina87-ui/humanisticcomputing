/**
 * ============================================================
 * InformaticaUmanistica — Autenticazione
 * ============================================================
 * Gestione autenticazione Firebase:
 * - Email/Password (login + registrazione)
 * - Google Sign-In
 * - Gestione stato utente
 * - Profilo utente su Firestore
 * ============================================================
 */

import { auth, db, firebaseReady } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js';

// ============================================================
// STATE
// ============================================================

let currentUser = null;
let userProfile = null;
const googleProvider = new GoogleAuthProvider();

// ============================================================
// AUTH STATE OBSERVER
// ============================================================

if (firebaseReady) {
  onAuthStateChanged(auth, async (user) => {
    currentUser = user;

    if (user) {
      // User is signed in
      console.info(`%c👤 Utente autenticato: ${user.email}`, 'color: #06d6a0;');

      // Load or create user profile in Firestore
      await loadUserProfile(user);

      // Update UI
      showDashboard(user);
    } else {
      // User is signed out
      console.info('%c👤 Utente non autenticato', 'color: #94a3b8;');
      currentUser = null;
      userProfile = null;
      showLoginForm();
    }
  });
} else {
  // Firebase not configured — show graceful fallback
  const authMsg = document.getElementById('auth-message');
  if (authMsg) {
    authMsg.className = 'auth-message info';
    authMsg.style.display = 'block';
    authMsg.style.background = 'rgba(34, 211, 238, 0.1)';
    authMsg.style.border = '1px solid rgba(34, 211, 238, 0.2)';
    authMsg.style.color = '#22d3ee';
    authMsg.textContent = '⚠️ Firebase non ancora configurato. Consulta la documentazione per inserire le credenziali SDK.';
  }
}

// ============================================================
// USER PROFILE MANAGEMENT
// ============================================================

async function loadUserProfile(user) {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      userProfile = userDoc.data();

      // Update last access
      await updateDoc(userRef, {
        lastAccess: serverTimestamp()
      });
    } else {
      // First time login — create profile
      userProfile = {
        displayName: user.displayName || user.email.split('@')[0],
        email: user.email,
        role: 'studente', // Default role
        createdAt: serverTimestamp(),
        lastAccess: serverTimestamp(),
        analysesCount: 0,
        photoURL: user.photoURL || null,
      };

      await setDoc(userRef, userProfile);
      console.info('%c📝 Profilo utente creato su Firestore', 'color: #8b5cf6;');
    }
  } catch (error) {
    console.error('Errore caricamento profilo:', error);
    // Still show dashboard even if Firestore fails
    userProfile = {
      displayName: user.displayName || user.email.split('@')[0],
      email: user.email,
      role: 'studente',
    };
  }
}

// ============================================================
// LOGIN HANDLERS
// ============================================================

/**
 * Email/Password Login
 */
window.handleLogin = async function(e) {
  e.preventDefault();

  if (!firebaseReady) {
    showAuthMessage('auth-message', 'Firebase non configurato. Inserisci le credenziali SDK.', 'error');
    return;
  }

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const btn = document.getElementById('btn-login');

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Accesso...';

  try {
    await signInWithEmailAndPassword(auth, email, password);
    if (typeof showToast === 'function') showToast('Accesso effettuato con successo!', 'success');
  } catch (error) {
    const msg = getAuthErrorMessage(error.code);
    showAuthMessage('auth-message', msg, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Accedi';
  }
};

/**
 * Google Sign-In
 */
window.handleGoogleLogin = async function() {
  if (!firebaseReady) {
    showAuthMessage('auth-message', 'Firebase non configurato. Inserisci le credenziali SDK.', 'error');
    return;
  }

  try {
    await signInWithPopup(auth, googleProvider);
    if (typeof showToast === 'function') showToast('Accesso con Google effettuato!', 'success');
  } catch (error) {
    if (error.code !== 'auth/popup-closed-by-user') {
      const msg = getAuthErrorMessage(error.code);
      showAuthMessage('auth-message', msg, 'error');
    }
  }
};

/**
 * Registration
 */
window.handleRegister = async function(e) {
  e.preventDefault();

  if (!firebaseReady) {
    showAuthMessage('register-message', 'Firebase non configurato. Inserisci le credenziali SDK.', 'error');
    return;
  }

  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const role = document.getElementById('register-role').value;
  const btn = document.getElementById('btn-register');

  if (!role) {
    showAuthMessage('register-message', 'Seleziona un ruolo (Studente o Docente).', 'error');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Creazione account...';

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Update display name
    await updateProfile(userCredential.user, { displayName: name });

    // Create Firestore profile with chosen role
    const userRef = doc(db, 'users', userCredential.user.uid);
    await setDoc(userRef, {
      displayName: name,
      email: email,
      role: role,
      createdAt: serverTimestamp(),
      lastAccess: serverTimestamp(),
      analysesCount: 0,
      photoURL: null,
    });

    userProfile = { displayName: name, email, role };

    if (typeof showToast === 'function') showToast('Account creato con successo!', 'success');
  } catch (error) {
    const msg = getAuthErrorMessage(error.code);
    showAuthMessage('register-message', msg, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Crea Account';
  }
};

/**
 * Logout
 */
window.handleLogout = async function() {
  try {
    await signOut(auth);
    if (typeof showToast === 'function') showToast('Disconnessione effettuata.', 'info');
  } catch (error) {
    console.error('Errore logout:', error);
  }
};

// ============================================================
// UI UPDATES
// ============================================================

function showDashboard(user) {
  const loginContainer = document.getElementById('auth-login-container');
  const registerContainer = document.getElementById('auth-register-container');
  const dashboard = document.getElementById('user-dashboard');
  const navAuthBtn = document.getElementById('nav-auth-btn');

  if (loginContainer) loginContainer.style.display = 'none';
  if (registerContainer) registerContainer.style.display = 'none';
  if (dashboard) dashboard.classList.add('visible');

  // Update dashboard info
  const avatar = document.getElementById('user-avatar');
  const displayName = document.getElementById('user-display-name');
  const emailDisplay = document.getElementById('user-email-display');
  const roleBadge = document.getElementById('user-role-badge');

  if (avatar) {
    avatar.textContent = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
  }
  if (displayName) {
    displayName.textContent = userProfile?.displayName || user.displayName || 'Utente';
  }
  if (emailDisplay) {
    emailDisplay.textContent = user.email;
  }
  if (roleBadge && userProfile) {
    const role = userProfile.role || 'studente';
    roleBadge.textContent = role.charAt(0).toUpperCase() + role.slice(1);
    roleBadge.className = `role-badge ${role}`;
  }

  // Update nav button
  if (navAuthBtn) {
    navAuthBtn.textContent = '👤 Profilo';
    navAuthBtn.onclick = () => scrollToSection('auth');
  }

  // Update dashboard stats
  const analysesCount = document.getElementById('dashboard-analyses-count');
  const lastAccess = document.getElementById('dashboard-last-access');
  if (analysesCount) {
    analysesCount.textContent = userProfile?.analysesCount || 0;
  }
  if (lastAccess) {
    lastAccess.textContent = 'Ora';
  }
}

function showLoginForm() {
  const loginContainer = document.getElementById('auth-login-container');
  const registerContainer = document.getElementById('auth-register-container');
  const dashboard = document.getElementById('user-dashboard');
  const navAuthBtn = document.getElementById('nav-auth-btn');

  if (loginContainer) loginContainer.style.display = 'block';
  if (registerContainer) registerContainer.style.display = 'none';
  if (dashboard) dashboard.classList.remove('visible');

  // Reset nav button
  if (navAuthBtn) {
    navAuthBtn.textContent = 'Accedi';
    navAuthBtn.onclick = () => scrollToSection('auth');
  }
}

// ============================================================
// HELPERS
// ============================================================

function showAuthMessage(elementId, message, type) {
  const el = document.getElementById(elementId);
  if (el) {
    el.textContent = message;
    el.className = `auth-message ${type}`;
    el.style.display = 'block';

    // Auto hide after 5s
    setTimeout(() => {
      el.style.display = 'none';
    }, 5000);
  }
}

function getAuthErrorMessage(errorCode) {
  const messages = {
    'auth/user-not-found': 'Utente non trovato. Verifica l\'email o registrati.',
    'auth/wrong-password': 'Password non corretta.',
    'auth/invalid-email': 'Indirizzo email non valido.',
    'auth/email-already-in-use': 'Questa email è già registrata. Prova ad accedere.',
    'auth/weak-password': 'La password deve avere almeno 6 caratteri.',
    'auth/too-many-requests': 'Troppi tentativi. Riprova tra qualche minuto.',
    'auth/network-request-failed': 'Errore di rete. Controlla la connessione.',
    'auth/popup-blocked': 'Il popup è stato bloccato dal browser. Abilita i popup per questo sito.',
    'auth/invalid-credential': 'Credenziali non valide. Verifica email e password.',
  };

  return messages[errorCode] || `Errore di autenticazione: ${errorCode}`;
}

// ============================================================
// EXPORTS (for global access from non-module scripts)
// ============================================================

window.handleLogin = window.handleLogin;
window.handleGoogleLogin = window.handleGoogleLogin;
window.handleRegister = window.handleRegister;
window.handleLogout = window.handleLogout;
