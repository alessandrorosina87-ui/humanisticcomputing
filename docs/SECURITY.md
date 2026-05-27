# 🔒 Sicurezza e Privacy — InformaticaUmanistica

Essendo un progetto didattico per istituti scolastici, l'applicazione adotta best practices rigide in tema di sicurezza dei dati e protezione di studenti/docenti.

## 🔥 Sicurezza Firebase

### 1. Firestore Rules (`firestore.rules`)
Il database Firestore è protetto da regole autorizzative basate sui ruoli, definite a livello di server. Nessun utente non autenticato può leggere o scrivere dati.

- **Collezione `users`**: Lettura consentita agli utenti autenticati. Scrittura limitata al proprietario del documento. Modifica consentita al proprietario o a un ruolo `docente`. I ruoli possono essere modificati solo da un amministratore (o docente).
- **Collezioni `contenuti`, `annunci`, `compiti`**: Lettura consentita a tutti gli utenti autenticati. Scrittura riservata esclusivamente al ruolo `docente`.
- **Collezione `consegne`**: Creazione riservata agli studenti. Lettura limitata allo studente che ha creato la consegna e a tutti i docenti.
- **Blocco Default**: Qualsiasi altra query non esplicitamente autorizzata viene rifiutata (`match /{document=**} { allow read, write: if false; }`).

### 2. Storage Rules (`storage.rules`)
I file archiviati nel Cloud Storage seguono restrizioni simili.

- **`materiali/`**: Lettura pubblica (se autenticati), caricamento consentito solo ai docenti.
- **`consegne/{userId}/`**: File accessibili solo dallo studente proprietario e dai docenti.
- **`avatars/{userId}/`**: Caricamento limitato a 2MB e solo a file di tipo immagine (`image/*`). L'utente può modificare solo il proprio avatar.

## 🛡️ Sicurezza Hosting (HTTP Headers)

Il file `firebase.json` applica rigorosi header di sicurezza per proteggere l'applicazione SPA da attacchi web comuni:
- `X-Content-Type-Options: nosniff` (Previene attacchi MIME-sniffing)
- `X-Frame-Options: DENY` (Protegge contro attacchi di Clickjacking, impedendo che il sito venga caricato in iframe esterni)
- `X-XSS-Protection: 1; mode=block` (Attiva il filtro XSS del browser)
- `Referrer-Policy: strict-origin-when-cross-origin` (Protegge la privacy non inviando il referer completo su connessioni HTTP/cross-origin)

## 🔐 Autenticazione

L'applicazione supporta Email/Password e Google Sign-In.
Le sessioni sono gestite in modo sicuro dall'SDK Firebase, e le password non transitano o risiedono mai in chiaro all'interno dell'applicazione o del database Firestore.

## 🎓 Contesto Scolastico e Privacy (GDPR)

In ambiente scolastico, l'uso dell'applicazione dovrebbe seguire le direttive del responsabile IT dell'istituto:
1. **Dati minimi**: L'app richiede solo email e nome. Non vengono richiesti dati biometrici o informazioni sensibili.
2. **Eliminazione**: Si consiglia di pianificare l'eliminazione degli account studenti a fine ciclo scolastico tramite Firebase Admin Console.
3. **Analisi del testo**: Tutto il laboratorio di elaborazione del testo e l'analisi del sentiment (Indice Gulpease, Word cloud) **viene eseguito lato client in Javascript**. Nessun frammento di testo analizzato dallo studente nel laboratorio viene inviato a server esterni, garantendo la massima privacy sui contenuti testati.

## ✅ Checklist Sicurezza

- [x] Regole Firestore implementate e Default-Deny.
- [x] Regole Storage con limitazione MB e Content-Type implementate.
- [x] Headers di Sicurezza Hosting presenti nel `firebase.json`.
- [x] File `.env` aggiunto a `.gitignore` e non presente nel repository.
- [x] Script di Deploy controllano rigidamente il `Project ID`.
