const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to check authentication

// Get user path
router.get('/path', authMiddleware, (req, res) => {
    const userId = req.user.id; // Assuming the user ID is in the JWT token

    const sql = 'SELECT directory_path FROM users WHERE id = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { directory_path } = results[0];
        res.json({ directoryPath: directory_path });
    });
});

module.exports = router;
