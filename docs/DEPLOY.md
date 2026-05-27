# 🚀 Guida al Deploy — InformaticaUmanistica

Questo documento illustra la procedura di deploy sicuro per la piattaforma InformaticaUmanistica. Il progetto include vincoli stringenti per impedire l'alterazione di ambienti Firebase non pertinenti.

## ⚠️ Vincolo di Sicurezza Assoluto

Il progetto è configurato per consentire il deploy **ESCLUSIVAMENTE** sul Firebase Project ID:
`informaticaumanistica-6b476`

Ogni tentativo di deploy su altri progetti verrà automaticamente bloccato dallo script `verify-project.sh`.

## 📦 Prerequisiti

Prima di iniziare il deploy, assicurati di avere:
1. Node.js installato.
2. Firebase CLI installata (`npm install -g firebase-tools`).
3. Effettuato il login a Firebase: `firebase login`.

## 🛠️ Setup al Primo Avvio

1. **Abilita Firestore**: Se non l'hai ancora fatto, devi abilitare il database Firestore per il progetto `informaticaumanistica-6b476` dalla [Google Cloud Console](https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=informaticaumanistica-6b476).
2. **Registra un'app Web**: Dalla Firebase Console del progetto, registra un'App Web.
3. **Aggiorna credenziali**: Copia l'`apiKey` e l'`appId` forniti da Firebase e incollali nel file `public/js/firebase-config.js`.

## 🚢 Comandi di Deploy

### 1. Deploy Completo Sicuro (Raccomandato)
Esegue tutti i controlli di sicurezza, ti mostra cosa sta per pubblicare, chiede conferma e invia tutti i servizi su Firebase:
```bash
npm run deploy
```

### 2. Deploy Parziali
Se vuoi aggiornare solo una parte del progetto (dopo aver verificato i controlli di sicurezza):
- **Solo Frontend (Hosting)**: `npm run deploy:hosting`
- **Solo Regole Database/Storage**: `npm run deploy:rules`

## 🔭 Preview Channels (Canali di Anteprima)

Se desideri testare una modifica in un ambiente reale ma non in produzione, puoi creare un canale di preview temporaneo:
```bash
firebase hosting:channel:deploy preview_name --project informaticaumanistica-6b476
```
Firebase genererà un URL univoco (es. `https://informaticaumanistica-6b476--preview-name-hash.web.app`) valido per alcuni giorni.

## 🔄 Procedura di Rollback

In caso di errore in produzione, è possibile effettuare un rollback istantaneo dall'Hosting:
1. Vai alla [Firebase Console](https://console.firebase.google.com/project/informaticaumanistica-6b476/hosting/sites).
2. Nella sezione "Cronologia delle release", individua la release precedente funzionante.
3. Clicca sull'icona "Tre puntini" e seleziona **"Esegui il rollback"**.

## ✅ Checklist Pre-Deploy

Prima di lanciare `npm run deploy`, verifica:
- [ ] Le modifiche sono state testate localmente tramite `npm run serve`.
- [ ] L'API Key e l'App ID in `public/js/firebase-config.js` sono corretti.
- [ ] Non sono presenti console.log con dati sensibili nel codice Javascript.
- [ ] Le regole `firestore.rules` sono state validate e non contengono vulnerabilità (es. `allow read, write: if true;`).
- [ ] Hai committato le modifiche su Git.
- [ ] Il progetto attivo nella Firebase CLI è corretto. (Verrà comunque verificato dagli script).

## 🤖 CI/CD con GitHub Actions

Il repository include un workflow GitHub Actions (`.github/workflows/deploy.yml`) che automatizza il deploy.
Ogni `push` al branch `main` innesca la verifica del project ID. Se superata, Firebase Hosting viene aggiornato automaticamente.
Per funzionare, richiede l'inserimento dei secret `FIREBASE_SERVICE_ACCOUNT` su GitHub.
