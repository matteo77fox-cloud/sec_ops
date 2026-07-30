const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

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

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Persistence file: ${DB_FILE}`);
});
