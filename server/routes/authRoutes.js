const express = require('express');
const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    /*
    console.log('Login attempt:', req.body);
    */

    // Simple hardcoded check for now
    if (username === 'admin' && password === 'admin123') {
        res.json({
            success: true,
            token: 'fake-jwt-token-for-demo', // In a real app, use jsonwebtoken
            user: { username: 'admin' }
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

module.exports = router;
