
const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const router = express.Router(); 
const USERS_FILE = 'users.json';

function readUsers() {
    if (!fs.existsSync(USERS_FILE)) return {};
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

function writeUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Missing username or password' });

    let users = readUsers();
    if (users[username]) return res.status(400).json({ message: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    users[username] = { password: hashedPassword };
    writeUsers(users);

    res.json({ message: 'Registration successful' });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    let users = readUsers();
    
    if (!users[username]) return res.status(400).json({ message: 'Invalid username or password' });
    
    const isMatch = await bcrypt.compare(password, users[username].password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });
    
    res.json({ message: 'Login successful' });
});

module.exports = router; 
