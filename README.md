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
