/**
 * ============================================================
 * InformaticaUmanistica — Firebase Configuration
 * ============================================================
 * Configurazione Firebase SDK (modular v9+, CDN)
 * Progetto: humanisticcomputing
 *
 * ⚠️ IMPORTANTE: Inserisci la tua API Key e App ID
 * dopo aver registrato l'app web nel progetto Firebase.
 * ============================================================
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js';
import { getAuth, connectAuthEmulator } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js';
import { getFirestore, connectFirestoreEmulator } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js';
import { getStorage, connectStorageEmulator } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-storage.js';

// ============================================================
// CONFIGURAZIONE FIREBASE
// ============================================================
// ⚠️ Inserisci la tua apiKey e appId qui sotto.
// Puoi ottenere questi valori dalla Firebase Console:
// https://console.firebase.google.com/project/humanisticcomputing/settings/general
//
// Oppure eseguendo:
// firebase apps:sdkconfig web --project humanisticcomputing
// ============================================================

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",              // ← Da inserire
  authDomain: "humanisticcomputing.firebaseapp.com",
  projectId: "humanisticcomputing",
  storageBucket: "humanisticcomputing.firebasestorage.app",
  messagingSenderId: "523520850922",
  appId: "YOUR_APP_ID_HERE",               // ← Da inserire
};

// ============================================================
// INIZIALIZZAZIONE
// ============================================================

let app, auth, db, storage;
let firebaseReady = false;

try {
  // Verifica che le credenziali siano state inserite
  if (firebaseConfig.apiKey === "YOUR_API_KEY_HERE" || firebaseConfig.appId === "YOUR_APP_ID_HERE") {
    console.warn(
      '%c⚠️ Firebase non configurato',
      'color: #f59e0b; font-weight: bold;',
      '\nInserisci apiKey e appId in js/firebase-config.js'
    );
    console.info(
      '%c📋 Per ottenere le credenziali:\n' +
      '   1. Vai su https://console.firebase.google.com/project/humanisticcomputing/settings/general\n' +
      '   2. Scorri a "Le tue app" e registra un\'app Web\n' +
      '   3. Copia apiKey e appId nel file firebase-config.js',
      'color: #94a3b8;'
    );
  } else {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    firebaseReady = true;

    // Se siamo in locale, connetti agli emulatori (opzionale)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      const useEmulators = false; // ← Imposta a true per usare emulatori locali

      if (useEmulators) {
        connectAuthEmulator(auth, 'http://localhost:9099');
        connectFirestoreEmulator(db, 'localhost', 8080);
        connectStorageEmulator(storage, 'localhost', 9199);
        console.info('%c🔧 Connesso agli emulatori Firebase', 'color: #22d3ee;');
      }
    }

    console.info(
      '%c✅ Firebase inizializzato',
      'color: #06d6a0; font-weight: bold;',
      `\nProgetto: ${firebaseConfig.projectId}`
    );
  }
} catch (error) {
  console.error('❌ Errore inizializzazione Firebase:', error);
}

// ============================================================
// EXPORT
// ============================================================

export { app, auth, db, storage, firebaseReady, firebaseConfig };
