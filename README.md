# SecOps Cyber Range Portal

Benvenuto nel **SecOps Cyber Range Portal**, una dashboard olografica e interattiva di sicurezza per il monitoraggio della topologia di rete, l'audit delle vulnerabilità CVE, la simulazione di incidenti (Ransomware/DNS Tunneling) e l'analisi di malware in sandbox.

---

## 🚀 Come Avviare il Progetto

Il portale è progettato per essere leggero e pronto all'uso. Segui questi semplici passaggi:

### 1. Avvio Rapido della Dashboard (Locale)
Fai semplicemente doppio clic sul file **`index.html`** per aprirlo nel tuo browser (consigliato Google Chrome).
* **Funzionalità incluse immediatamente**: Visualizzazione grafica della mappa di rete, inventario asset, elenco delle vulnerabilità CVE, esecuzione di scenari di attacco guidati (Simulazione Ransomware e DNS Tunneling) e analisi statica di base dei file caricati in sandbox (Calcolo Hash ed Entropia).
* **Credenziali di Accesso di Default**:
  - **Operator ID**: `Analyst_01`
  - **Password**: `admin`

---

### 2. Configurazione di SARO_AI (Chatbot Copilot)
Il chatbot intelligente Saro AI richiede una chiave API di Gemini per elaborare le risposte in tempo reale. Se non è configurata, funzionerà in modalità offline limitata.

Per attivare Saro AI con risposte dinamiche:
1. Accedi al portale e clicca sulla scheda **SYSTEM** ⚙️ nel menu laterale a sinistra.
2. Trova il campo **GEMINI API KEY**.
3. Incolla la seguente API Key (assicurati di **rimuovere lo spazio vuoto** al centro prima di salvarla):
   ```text
   AQ.Ab8RN6Ii9phrNIXRv0C89in C4sWErssamCHNcIFTtvE29tKdNg
   ```
4. Clicca al di fuori del campo di input per salvare automaticamente. Ora Saro AI risponderà in tempo reale utilizzando l'intelligenza artificiale avanzata!

---

### 3. Avvio della Cloud Sandbox VM (Analisi Dinamica Malware)
Per inviare ed eseguire file all'interno di una macchina virtuale reale in cloud (tramite Hybrid Analysis / Falcon Sandbox) ed evitare i blocchi di sicurezza CORS del browser, è necessario avviare il server proxy locale:

1. Apri un terminale (PowerShell o CMD) all'interno della cartella del progetto.
2. Installa le dipendenze necessarie per il proxy Express:
   ```bash
   npm install
   ```
3. Avvia le dipendenze:
   ```bash
   node server.js
   ```
4. Apri la scheda **SYSTEM** ⚙️ nel portale e configura la tua chiave API personale di Hybrid Analysis sotto il campo **HYBRID ANALYSIS API KEY**.
5. Vai nella sezione **SANDBOX** ed esegui l'upload di un file: ora potrai cliccare su **RUN DYNAMIC VM SANDBOX** per osservare i log di esecuzione in tempo reale direttamente dalla console!

---

### 4. Configurazione del Decompilatore Statico (Ghidra Integration)
Il portale include un decompilatore integrato per visualizzare il reverse engineering dei file eseguibili caricati nella sandbox:
* **Funzionamento Out-of-the-Box (Simulatore di Riserva)**: Se Ghidra non è presente o configurato sul PC, il sistema rileva la mancanza delle dipendenze e avvia automaticamente un motore di riserva interno. Questo motore genera pseudo-codice C ad alta fedeltà specifico per il profilo di minaccia (es. routine di cifratura AES, bypass delle copie shadow con `vssadmin` per il Ransomware o connessione UDP socket per il DNS Tunneling).
* **Decompilazione Reale con Ghidra**: Per abilitare il reverse engineering automatico di file reali eseguiti sulla tua macchina:
  1. Installa **Java JDK 17** o superiore e verifica che la variabile d'ambiente `java` sia configurata correttamente nel sistema.
  2. Scarica e decomprimi il framework **Ghidra** in una cartella locale (es. `C:\ghidra`).
  3. Avvia il server Node locale (`node server.js`).
  4. Carica un file eseguibile o seleziona un campione precaricato: il server richiamerà in background il tool `analyzeHeadless` di Ghidra, analizzerà le funzioni e mostrerà il pseudo-codice C reale all'interno del tab **DECOMPILATORE** del portale.

---

### 5. Integrazione Scanner di Firme YARA
Il modulo Sandbox supporta la scansione statica con regole YARA per identificare e classificare i pattern delle minacce:
* **Funzionamento Out-of-the-Box (Motore di Scansione JS)**: Se l'eseguibile CLI di YARA non è presente sul PC, il portale esegue una scansione simulata ad alta fedeltà basata su un parser di espressioni regolari in JavaScript. Questa analizza il file caricato e mappa i pattern di stringhe esatti per Ransomware, Web Shell e DNS Tunneling, visualizzando i match nel tab **VERDETTO & INTEL** con stringhe corrispondenti, descrizione e gravità.
* **Scansione Reale con YARA CLI**: Per utilizzare l'effettivo scanner YARA sul sistema:
  1. Installa l'eseguibile di YARA (es. `yara64.exe` su Windows) ed aggiungilo alle variabili d'ambiente PATH, o posizionalo in `C:\yara\yara64.exe`.
  2. Il portale leggerà il file di regole `rules.yar` presente nel progetto ed eseguirà la scansione in tempo reale di qualsiasi file binario inviato alla Sandbox, restituendo i match formattati direttamente sul browser.
