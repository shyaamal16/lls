const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Utility function for error response
const sendErrorResponse = (res, statusCode, message) => {
    res.status(statusCode).json({ success: false, message });
};

// Sign-Up Route
router.post('/signup', async (req, res) => {
    const { role, userId, password } = req.body;

    if (!role || !userId || !password) {
        return sendErrorResponse(res, 400, 'All fields are required.');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const table = role === 'manager' ? 'managers' : 'employees';
        const query = `INSERT INTO ${table} (user_id, password) VALUES (?, ?)`;

        db.query(query, [userId, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return sendErrorResponse(res, 409, 'User ID already exists.');
                }
                console.error('Database Error:', err);
                return sendErrorResponse(res, 500, 'Error creating user.');
            }
            res.status(201).json({ success: true, message: 'User created successfully.' });
        });
    } catch (error) {
        console.error('Error:', error);
        sendErrorResponse(res, 500, 'Internal server error.');
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { userId, password } = req.body;

    if (!userId || !password) {
        return res.status(400).json({ success: false, message: 'User ID and password are required.' });
    }

    try {
        const query = `
            SELECT * FROM (
                SELECT 'employee' as role, id, user_id, password FROM employees
                UNION ALL
                SELECT 'manager' as role, id, user_id, password FROM managers
            ) AS users
            WHERE user_id = ?
        `;

        db.query(query, [userId], async (err, results) => {
            if (err) {
                console.error('Database Error:', err);
                return res.status(500).json({ success: false, message: 'Internal server error.' });
            }

            if (results.length === 0) {
                return res.status(401).json({ success: false, message: 'Invalid user ID or password.' });
            }

            const user = results[0];
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                const token = jwt.sign(
                    { userId: user.id, role: user.role },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );
                res.status(200).json({
                    success: true,
                    message: 'Login successful.',
                    token,
                    role: user.role,
                });
            } else {
                res.status(401).json({ success: false, message: 'Invalid user ID or password.' });
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});
module.exports = router;
