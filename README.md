# 🏫 InformaticaUmanistica

Piattaforma didattica che esplora l'intersezione tra informatica, letteratura e intelligenza artificiale. Un progetto progettato per le scuole per introdurre gli studenti alle **Digital Humanities**.

## 🌟 Funzionalità Principali

- **Laboratorio Interattivo**: 5 strumenti NLP eseguiti interamente lato client (Javascript) per l'analisi del testo, generatore di Word Cloud, calcolo dell'Indice Gulpease (leggibilità), confronto di testi (Jaccard similarity) e analisi del sentiment basica (lessicale).
- **Design System Premium**: UI moderna con tema scuro/chiaro nativo, glassmorphism e micro-interazioni, adatta ad attrarre gli studenti.
- **Timeline Interattiva**: Storia della letteratura digitale e delle tecnologie che l'hanno plasmata.
- **Infrastruttura Sicura**: Regole Firestore granulari basate sui ruoli (Studenti / Docenti), configurazione di sicurezza esplicita per l'Hosting e Storage.
- **Strumenti per lo Sviluppo**: Pipeline di deploy bloccata esclusivamente sul progetto ID `humanisticcomputing` per evitare alterazioni ad altri ambienti dell'istituto scolastico.

## 🛠️ Stack Tecnologico

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (Nessun framework, per fini didattici e per minimizzare la complessità)
- **Database**: Firebase Firestore
- **Storage**: Firebase Cloud Storage
- **Autenticazione**: Firebase Auth (Email/Password, Google Sign-In)
- **Hosting**: Firebase Hosting (CDN globale)

## 📋 Prerequisiti

Per lavorare al progetto in locale:
- Node.js >= 18.0.0
- Firebase CLI (`npm install -g firebase-tools`)

## 🚀 Quick Start

1. **Clona il repository**
   ```bash
   git clone https://github.com/alessandrorosina87-ui/humanisticcomputing.git
   cd humanisticcomputing
   ```

2. **Setup iniziale**
   Esegui lo script di setup che verificherà l'installazione della Firebase CLI e farà il login:
   ```bash
   npm run setup
   ```
   *(Assicurati che lo script sia eseguibile: `chmod +x scripts/setup.sh`)*

3. **Configurazione Firebase SDK**
   Prima di avviare il progetto, devi inserire `apiKey` e `appId` in `public/js/firebase-config.js`.

4. **Avvia il server locale**
   ```bash
   npm run serve
   ```
   L'applicazione sarà disponibile su http://localhost:5000 (o 5002 se la 5000 è occupata).

## 📁 Struttura del Progetto

```
InformaticaUmanistica/
├── .firebaserc           # Target del progetto Firebase (vincolato)
├── firebase.json         # Configurazione Hosting, Headers, ecc.
├── firestore.rules       # Regole di sicurezza del database
├── storage.rules         # Regole di sicurezza per i file
├── public/               # Directory dell'App Web
│   ├── index.html        # SPA principale
│   ├── css/style.css     # Design System completo
│   └── js/               # Logica Javascript (App, Auth, Lab, Config)
├── scripts/              # Script di utilità per DevOps sicuro
└── docs/                 # Documentazione estesa
```

## 📜 Script NPM Disponibili

- `npm run setup`: Setup iniziale del progetto.
- `npm run verify`: Esegue i controlli di sicurezza (verifica l'ID progetto Firebase attivo).
- `npm run deploy`: Esegue il deploy di tutti i servizi previa verifica di sicurezza.
- `npm run deploy:hosting`: Esegue il deploy solo dell'Hosting.
- `npm run deploy:rules`: Esegue il deploy solo delle regole Firestore e Storage.
- `npm run backup`: Genera un backup locale del database Firestore.
- `npm run serve`: Avvia il server di test locale Firebase.

## 🤝 Contributing

Trattandosi di un progetto scolastico, i contributi per estendere le funzionalità (ad es. nuove analisi nel Laboratorio) sono benvenuti. Si consiglia di creare una feature branch:
`git checkout -b feature/nome-funzionalita`.

## 📄 Licenza

Distribuito sotto licenza MIT.
