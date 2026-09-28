# Pannello di gestione Mira El Bacha

Seconda applicazione Next.js nella stessa repository, pubblicabile separatamente dal portfolio. Consente di aggiungere, modificare, eliminare e riordinare progetti, immagini, esperienze AD, altre esperienze, formazione, competenze e paragrafi della biografia. Anche nome, professione e contatti sono modificabili.

## Avvio locale

Richiede Node.js 22 o successivo.

```bash
npm --prefix apps/admin ci
npm run dev:admin
```

Aprire http://localhost:3001. Senza configurazione Firebase il pannello mostra i contenuti reali iniziali in **modalità demo**: si possono provare le modifiche, ma non sono persistite né pubblicate. Il pulsante di salvataggio è disabilitato. Non viene creato automaticamente alcun progetto cloud.

Il sito pubblico continua ad avviarsi dalla root con `npm run dev`, sulla porta 3000. I due applicativi hanno dipendenze, lockfile e deploy indipendenti; i tipi, la validazione e i contenuti iniziali sono condivisi tramite `../../src/content` e riutilizzano i tipi e i dati già presenti in `src/data`.

## Configurazione di un nuovo progetto Firebase

1. Creare un progetto in [Firebase Console](https://console.firebase.google.com/) sul piano Spark. Per questo progetto è prevista **Firestore Standard**, database `(default)`, senza MongoDB compatibility. Scegliere una regione adatta prima di creare il database (per esempio una regione UE per un sito gestito dall’Italia).
2. Creare Firestore in **modalità produzione**, che nega l’accesso diretto dai client. L’app usa esclusivamente il Firebase Admin SDK sul server. Questa implementazione non crea, modifica o pubblica rules e indici.
3. In Authentication attivare Email/Password, creare l’utente amministratore e copiare il suo UID. Non è presente registrazione pubblica nel pannello. L’UID deve essere incluso in `ADMIN_UIDS`: essere autenticati da soli non dà diritto a modificare il sito.
4. Registrare un’app Web nel progetto e copiare `apiKey`, `projectId` e `authDomain` nelle corrispondenti variabili `NEXT_PUBLIC_FIREBASE_*`.
5. In Impostazioni progetto → Account di servizio, generare le credenziali server. Copiare `project_id`, `client_email` e `private_key` nelle variabili `FIREBASE_*`. Questi valori server non devono avere il prefisso `NEXT_PUBLIC_`. Conservare il JSON delle credenziali fuori dalla repository. Il service account deve poter leggere/scrivere Firestore e verificare utenti Firebase Authentication.
6. Copiare `.env.example` in `.env.local` **all’interno di `apps/admin`** e compilare le variabili. La chiave privata può essere una stringa fra doppi apici con `\n` al posto degli a-capo. In Vercel inserire il valore senza virgolette esterne, con gli a-capo reali oppure `\n`.
7. Impostare `NEXT_PUBLIC_SITE_URL` con l’indirizzo del sito pubblico. Aggiungere il dominio del pannello ai domini autorizzati in Authentication; includere `localhost` per sviluppo locale se necessario.
8. Riavviare il pannello. Accedere con l’utente autorizzato, effettuare una modifica e scegliere **Salva sul sito**. Il primo salvataggio crea il documento `siteContent/miraelbacha` a partire dai contenuti esistenti.

Le credenziali client e server devono appartenere allo **stesso progetto Firebase**. Se il documento non esiste, vengono letti i contenuti originali della repository; nessuna scrittura avviene durante il semplice caricamento.

## Collegamento del sito pubblico

Nella root copiare `.env.example` in `.env.local` e impostare:

```dotenv
NEXT_PUBLIC_CONTENT_API_URL=http://localhost:3001/api/content
```

In produzione usare `https://DOMINIO-DEL-PANNELLO/api/content`. Questa variabile è incorporata nel sito in fase di build: serve un deploy iniziale del sito pubblico per attivare il collegamento. Per GitHub Pages, aggiungere la variabile di repository `NEXT_PUBLIC_CONTENT_API_URL` in Settings → Secrets and variables → Actions → Variables; il workflow esistente la passa alla build.

Dopo il collegamento, i salvataggi dal pannello **non richiedono nuove build**. Un nuovo caricamento del sito legge subito i dati; le schede già aperte si aggiornano ogni 30 secondi, e quando tornano attive. Se il servizio non risponde o i dati non sono validi, la pagina conserva l’ultimo contenuto valido della sessione; al primo caricamento il fallback è la copia iniziale nella repository. Non esiste una cache persistente fra sessioni. L’HTML prerenderizzato contiene i dati iniziali: i dati aggiornati vengono caricati nel browser.

La home conserva il comportamento delle gallerie anche se un progetto aperto viene eliminato o se vengono rimosse immagini. I testi sono renderizzati da React; i campi non accettano HTML da eseguire.

## Deploy del pannello su Vercel

Creare un **secondo progetto Vercel** collegato alla stessa repository:

- **Root Directory**: `apps/admin`.
- Abilitare **Include source files outside of the Root Directory in the Build Step**, perché il pannello usa il modello e i dati condivisi nella root.
- Framework: Next.js. Node.js: 22 o successivo.
- Install command: `npm ci`. Build command: `npm run build`. Output: quello predefinito Next.js.
- Configurare tutte le variabili di `apps/admin/.env.example` nelle environment necessarie; non inserire credenziali server nel sito pubblico.
- Il dominio usato dal sito pubblico deve rendere raggiungibile `/api/content` senza Vercel Deployment Protection. Le API di amministrazione restano protette da Firebase Auth e dalla lista UID anche quando il dominio è pubblico.

[Documentazione Vercel sui monorepo](https://vercel.com/docs/monorepos/monorepo-faq).

Il pannello usa API Node.js e non può essere caricato su un hosting **solo statico** come GitHub Pages o Cloudflare Pages senza un adattatore/backend aggiuntivo. Il portfolio pubblico può restare sull’hosting attuale.

[Vercel Hobby](https://vercel.com/docs/limits/fair-use-guidelines) è gratuito per uso personale non commerciale: verificare l’idoneità del sito prima del deploy. [Firebase Spark](https://firebase.google.com/pricing) offre quote gratuite; per Firestore Standard la quota comprende 50.000 letture e 20.000 scritture al giorno, più 1 GiB di dati. Ogni richiesta pubblica effettua una lettura; il polling aumenta il consumo in base alle visite. Non sono configurati servizi a pagamento, Cloud Functions o Cloud Storage. La disponibilità gratuita resta soggetta alle quote e ai termini dei fornitori.

## Immagini

Il pannello gestisce URL HTTPS e percorsi `/img/...` già presenti nel sito. È possibile aggiungere, rimuovere e riordinare le immagini di ogni progetto; la prima è la copertina. **Il caricamento di nuovi file dal dispositivo non è implementato**: usare URL di immagini già ospitate oppure aggiungere i file alla cartella `public/img` del sito. Le immagini remote sono servite direttamente dal loro URL.

## API e salvataggio

- `GET /api/content`: contenuti pubblicati, revisione e data; CORS pubblico, nessun dato dell’account amministratore, nessuna cache HTTP.
- `GET /api/admin/content`: stessa struttura, richiede `Authorization: Bearer <Firebase ID token>` e UID autorizzato.
- `PUT /api/admin/content`: richiede lo stesso accesso; body JSON `{ "content": SiteContent, "revision": number }`.
- Il server verifica anche la revoca del token e l’abilitazione dell’utente. Il client usa persistenza della sessione e rinnovo dei token tramite Firebase SDK.
- Il contenuto viene validato sul server. Le richieste hanno un limite di dimensione; sono rifiutati identificativi duplicati, immagini mancanti, URL non sicuri e versioni dello schema sconosciute.
- Una transazione confronta la revisione con quella corrente e salva tutti i contenuti insieme. Una seconda sessione con dati superati riceve `409` e non sovrascrive modifiche più recenti. Il pannello conserva le sue modifiche e permette di ricaricare esplicitamente.
- Il pulsante **Annulla modifiche** ripristina l’ultima versione caricata; l’uscita con modifiche non salvate richiede conferma. Non ci sono salvataggi automatici parziali né una cronologia delle versioni.

**Report indici Firestore:** nessun indice composito da aggiungere o modificare. Si legge e scrive un solo documento per percorso, senza query. Nessun file di rules o indici è stato modificato.

## Verifiche

```bash
npm --prefix apps/admin run typecheck
npm --prefix apps/admin run lint
npm --prefix apps/admin test
npm run build:admin
npm run lint
npx tsc --noEmit
npm run build
```

I test controllano compatibilità con i dati iniziali, modifiche/ordinamento/rimozione, liste vuote, URL non sicuri, payload non validi, dimensioni, duplicati e metadati privati. Per il collaudo con Firebase configurato: verificare accesso consentito/negato, primo salvataggio, aggiornamento del sito, conflitto fra due sessioni e revoca dell’utente. Queste verifiche cloud richiedono il progetto e le credenziali reali.
