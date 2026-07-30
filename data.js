/**
 * SECURITY PORTAL DATA TEMPLATE (LOCAL PERSISTENCE)
 * -------------------------------------------------
 * Contains the initial state of the database (users and assets/events/vulns/sandbox history).
 * Updates are automatically saved to localStorage on modification.
 */

const PORTAL_DEFAULT_USERS = [
    {
        "user": "Analyst_01",
        "pass": "admin"
    },
    {
        "user": "fox ",
        "pass": "123"
    },
    {
        "user": "juvemerda",
        "pass": "123"
    },
    {
        "user": "min",
        "pass": "chia"
    }
];

const PORTAL_DATA = {
    "stats": {
        "riskScore": 92,
        "activeThreats": 0,
        "vulnCount": 5,
        "uptime": "99.98%",
        "scoreHistory": [90, 91, 89, 90, 92, 90, 89]
    },
    "assets": [
        {
            "id": "DC-01.corp.internal",
            "type": "Server",
            "ip": "10.10.10.10",
            "os": "Windows Server 2022",
            "status": "secure"
        },
        {
            "id": "SIEM-LOG-01.corp.internal",
            "type": "Server",
            "ip": "10.10.10.50",
            "os": "Rocky Linux 9",
            "status": "secure"
        },
        {
            "id": "DB-PROD-SQL.corp.internal",
            "type": "Database",
            "ip": "10.20.10.12",
            "os": "Windows Server 2022",
            "status": "secure"
        },
        {
            "id": "APP-WEB-01.corp.internal",
            "type": "Server",
            "ip": "10.20.10.20",
            "os": "Red Hat Enterprise Linux 9",
            "status": "warning"
        },
        {
            "id": "ERP-SAP-01.corp.internal",
            "type": "Server",
            "ip": "10.20.10.30",
            "os": "SUSE Linux Enterprise Server 15",
            "status": "secure"
        },
        {
            "id": "WS-HR-004.corp.internal",
            "type": "Workstation",
            "ip": "192.168.10.45",
            "os": "Windows 11 Enterprise",
            "status": "secure"
        },
        {
            "id": "WS-FIN-012.corp.internal",
            "type": "Workstation",
            "ip": "192.168.10.52",
            "os": "Windows 11 Enterprise",
            "status": "secure"
        },
        {
            "id": "WS-DEV-009.corp.internal",
            "type": "Workstation",
            "ip": "192.168.10.88",
            "os": "Windows 11 Enterprise",
            "status": "secure"
        },
        {
            "id": "WS-CEO-LAPTOP.corp.internal",
            "type": "Workstation",
            "ip": "192.168.10.100",
            "os": "macOS Sequoia",
            "status": "secure"
        },
        {
            "id": "IoT-THERMO-1F.corp.internal",
            "type": "IoT Device",
            "ip": "192.168.50.11",
            "os": "Embedded Linux",
            "status": "warning"
        },
        {
            "id": "mail-gateway.corp.internal",
            "type": "Server",
            "ip": "10.0.0.12",
            "os": "Linux CentOS 9 (Postfix)",
            "status": "secure"
        },
        {
            "id": "FW-HQ-PALOALTO",
            "type": "Network",
            "ip": "10.0.0.1",
            "os": "PAN-OS 11.1",
            "status": "secure"
        },
        {
            "id": "SW-CORE-01",
            "type": "Network",
            "ip": "10.0.0.2",
            "os": "Cisco IOS-XE 17.9",
            "status": "secure"
        }
    ],
    "vulns": [
        {
            "cve": "CVE-2024-21413",
            "desc": "Microsoft Outlook Remote Code Execution Vulnerability (MonikerLink)",
            "severity": "Critical",
            "affected": "WS-HR-004.corp.internal"
        },
        {
            "cve": "CVE-2022-22536",
            "desc": "SAP NetWeaver memory corruption vulnerability",
            "severity": "Critical",
            "affected": "ERP-SAP-01.corp.internal"
        },
        {
            "cve": "CVE-2023-46604",
            "desc": "Apache ActiveMQ Remote Code Execution Vulnerability",
            "severity": "Critical",
            "affected": "APP-WEB-01.corp.internal"
        },
        {
            "cve": "DEFAULT-CREDS",
            "desc": "Default credentials enabled on building management interface",
            "severity": "Critical",
            "affected": "IoT-THERMO-1F.corp.internal"
        },
        {
            "cve": "CVE-2022-26925",
            "desc": "Active Directory LSA Spoofing vulnerability",
            "severity": "High",
            "affected": "DC-01.corp.internal"
        }
    ],
    "threatFeed": [
        {
            "date": "22/06/26",
            "title": "Nuova campagna phishing diffonde il ransomware BlackStorm via allegati dual-extension (.pdf.exe)",
            "source": "CSIRT ITA",
            "link": "#",
            "severity": "Critical",
            "cve": "N/A",
            "iocs": {
                "ips": ["45.22.19.112"],
                "files": ["invoice_copy.pdf.exe"],
                "hashes": ["e7f225da7b872ef724c7263070df77f6c6a6f434d07584b614cc46b37215b6ed87"],
                "domains": ["blackstorm-ransom.onion"]
            },
            "summary_it": "Una massiccia campagna di phishing sta prendendo di mira le aziende italiane distribuendo il ransomware BlackStorm. Le email contengono file d'archivio o allegati con doppia estensione (es. .pdf.exe) per trarre in inganno gli utenti. Il malware tenta di stabilire persistenza nella chiave di registro HKCU\\Run\\Updater e avvia la connessione C2 verso l'IP 45.22.19.112.",
            "summary_en": "A massive phishing campaign is targeting Italian organizations distributing the BlackStorm ransomware. The emails contain archives or attachments with double extensions (e.g., .pdf.exe) to mislead users. The malware attempts to establish persistence in the HKCU\\Run\\Updater registry key and initiates a C2 connection to IP 45.22.19.112.",
            "remediation_it": "1. Blocca l'IP 45.22.19.112 nel firewall perimetrale.\n2. Disabilita l'esecuzione di allegati con doppia estensione.\n3. Esegui la bonifica della chiave di persistenza HKCU\\Run\\Updater.",
            "remediation_en": "1. Block IP 45.22.19.112 at the perimeter firewall.\n2. Disable execution of double-extension attachments.\n3. Clean up the persistence registry key HKCU\\Run\\Updater."
        },
        {
            "date": "18/06/26",
            "title": "Sfruttamento attivo della vulnerabilità CVE-2024-21413 in Outlook per bypassare Defender",
            "source": "ACN",
            "link": "#",
            "severity": "Critical",
            "cve": "CVE-2024-21413",
            "iocs": {
                "ips": ["185.220.101.4"],
                "files": ["MonikerLink.html", "cmd.php", "shell.php"],
                "hashes": ["c525da7b872ef724c7263070df77f6a6a6f434d07584b614cc46b37215b6ed12"],
                "domains": ["exploit-outlook.com"]
            },
            "summary_it": "Sfruttamento attivo in-the-wild della vulnerabilità MonikerLink in Outlook. Consente l'esecuzione remota di codice (RCE) tramite il bypass delle restrizioni di sicurezza all'apertura di particolari link ipertestuali (file://). Alcuni vettori utilizzano caricamenti di backdoor PHP (come cmd.php) per controllo remoto.",
            "summary_en": "Active in-the-wild exploitation of the MonikerLink vulnerability in Outlook. Allows remote code execution (RCE) by bypassing security restrictions upon opening specific hyperlinks (file://). Some vectors make use of PHP web shell uploads (like cmd.php) for remote control.",
            "remediation_it": "1. Applica gli aggiornamenti di sicurezza rilasciati da Microsoft.\n2. Filtra il traffico SMB in uscita (Porta 445) verso destinazioni esterne.\n3. Controlla la creazione di file PHP sospetti nelle cartelle web.",
            "remediation_en": "1. Apply security updates released by Microsoft.\n2. Filter outbound SMB traffic (Port 445) to external destinations.\n3. Monitor creation of suspicious PHP files in web folders."
        },
        {
            "date": "12/06/26",
            "title": "Ransomware BlackStorm: Analisi dettagliata IoC e tecniche TTPs dei gruppi affiliati",
            "source": "UNIT42",
            "link": "#",
            "severity": "High",
            "cve": "N/A",
            "iocs": {
                "ips": ["91.240.118.15", "45.22.19.112"],
                "files": ["payload.dll", "encryptor.py"],
                "hashes": ["a123ea7b872ef724c7263070df77f6a6a6f434d07584b614cc46b37215b6ed45"],
                "domains": ["blackstorm-c2.onion"]
            },
            "summary_it": "Analisi approfondita del ransomware BlackStorm condotta da Unit42. Documenta le tecniche TTPs e fornisce IoC aggiornati. Il ransomware cripta i file aggiungendo l'estensione .blackstorm e richiede un riscatto in criptovalute.",
            "summary_en": "In-depth analysis of the BlackStorm ransomware by Unit42. Documents TTP techniques and provides updated IoCs. The ransomware encrypts files adding the .blackstorm extension and demands a cryptocurrency ransom.",
            "remediation_it": "1. Distribuisci la lista degli indicatori IoC sugli agenti endpoint.\n2. Configura le regole di protezione ransomware per bloccare comportamenti di cifratura massiva.",
            "remediation_en": "1. Distribute IoC blocklists across endpoint agents.\n2. Configure ransomware protection rules to block massive encryption behaviors."
        },
        {
            "date": "08/06/26",
            "title": "Campagne di port scanning SMB (Porta 445) mirate all'infiltrazione laterale",
            "source": "CISA",
            "link": "#",
            "severity": "Medium",
            "cve": "N/A",
            "iocs": {
                "ips": ["198.51.100.12", "198.51.100.72"],
                "files": ["smb_scan.sh"],
                "hashes": ["b223ea7b872ef724c7263070df77f6a6a6f434d07584b614cc46b37215b6ed22"],
                "domains": ["scanner-world.net"]
            },
            "summary_it": "CISA segnala un incremento globale di attività di scanning perimetrale sulla porta SMB 445 finalizzate a mappare condivisioni aperte e individuare host vulnerabili per movimenti laterali.",
            "summary_en": "CISA reports a global increase in scanning activity on SMB Port 445 aimed at mapping open shares and identifying vulnerable hosts for lateral movement.",
            "remediation_it": "1. Assicurati che la porta 445 sia bloccata ai confini della rete aziendale.\n2. Disabilita SMBv1 in tutta l'infrastruttura.",
            "remediation_en": "1. Ensure port 445 is strictly blocked at the network perimeter.\n2. Disable SMBv1 across the entire infrastructure."
        },
        {
            "date": "01/06/26",
            "title": "Aumento globale degli attacchi a infrastrutture critiche ed ERP SAP",
            "source": "CSIRT ITA",
            "link": "#",
            "severity": "High",
            "cve": "CVE-2022-22536",
            "iocs": {
                "ips": ["185.190.140.22"],
                "files": ["sap_exploit.py"],
                "hashes": ["d825da7b872ef724c7263070df77f6a6a6f434d07584b614cc46b37215b6ed99"],
                "domains": ["sap-support-update.com"]
            },
            "summary_it": "Aumento significativo di attacchi diretti a sistemi ERP SAP sfruttando la vulnerabilità di memoria CVE-2022-22536. Consente ad attaccanti non autenticati di eseguire richieste HTTP malevole di contrabbando (Request Smuggling).",
            "summary_en": "Significant increase in attacks targeting ERP SAP systems exploiting the memory corruption vulnerability CVE-2022-22536. Allows unauthenticated attackers to perform HTTP request smuggling.",
            "remediation_it": "1. Applica la nota di sicurezza SAP Note 3123396.\n2. Configura regole protettive specifiche sul Web Application Firewall (WAF).",
            "remediation_en": "1. Apply SAP Security Note 3123396.\n2. Configure specific signature rules on the Web Application Firewall (WAF)."
        }
    ],
    "events": [
        {
            "time": "14:10:22",
            "sev": "INFO",
            "msg": "Scheduled backup for ERP-SAP-01 completed successfully",
            "src": "SIEM-LOG-01.corp.internal"
        },
        {
            "time": "14:05:12",
            "sev": "INFO",
            "msg": "Active Directory group membership sync completed",
            "src": "DC-01.corp.internal"
        },
        {
            "time": "13:58:45",
            "sev": "INFO",
            "msg": "User Administrator session authenticated from 10.10.10.15",
            "src": "DC-01.corp.internal"
        },
        {
            "time": "13:45:30",
            "sev": "WARN",
            "msg": "SSH brute force attempts detected from public IP 198.51.100.72",
            "src": "FW-HQ-PALOALTO"
        },
        {
            "time": "13:30:15",
            "sev": "INFO",
            "msg": "Periodic health check passed for DB-PROD-SQL",
            "src": "DB-PROD-SQL.corp.internal"
        },
        {
            "time": "13:15:00",
            "sev": "INFO",
            "msg": "Network routing tables updated successfully",
            "src": "SW-CORE-01"
        }
    ],
    "sandboxHistory": [
        {
            "id": "1770025227506",
            "timestamp": 1770025227506,
            "fileName": "Screenshot_2026_Report.png",
            "fileHash": "f525da7b872ef724c7263070df77f6a6a6f434d07584b614cc46b37215b6ed89",
            "isMalicious": false,
            "details": {
                "name": "Screenshot_2026_Report.png",
                "size": 99358,
                "type": "image/png",
                "lastModified": 1731059004297,
                "magicBytes": "89 50 4E 47",
                "hash": "f525da7b872ef724c7263070df77f6a6a6f434d07584b614cc46b37215b6ed89",
                "entropy": "4.12"
            }
        }
    ]
};
