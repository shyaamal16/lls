const express = require('express');
const path = require('path');
const authRoutes = require('./routes/auth');
const qualityRoutes = require('./routes/quality'); // Import quality routes
const db = require('./db');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Middleware to check for authentication
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Routes
app.use('/api', authRoutes);
app.use('/api', qualityRoutes); // Register quality routes

// Protected route example
app.get('/api/dashboard', authenticateToken, (req, res) => {
    res.json({ message: 'Welcome to the dashboard', user: req.user });
});

// Database connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
