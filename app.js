const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');

dotenv.config();

const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection - Replace with your MongoDB Atlas connection string
const MONGODB_URI = process.env.MONGODB_URI; // Change this to your MongoDB Atlas URI

// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: 'vulnerable_secret_key_123', // Intentionally weak secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Intentionally insecure for HTTP
}));

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Verbose logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('Query:', req.query);
    console.log('Session:', req.session);
    console.log('Cookies:', req.cookies);
    next();
});

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('[INFO] Connected to MongoDB successfully');
}).catch(err => {
    console.error('[ERROR] MongoDB connection error:', err);
});

// Import models
const Student = require('./models/Student');
const Admin = require('./models/Admin');

// Routes
app.use('/', require('./routes/auth'));
app.use('/student', require('./routes/student'));
app.use('/admin', require('./routes/admin'));

// Main landing page
app.get('/', (req, res) => {
    console.log('[INFO] Rendering landing page');
    res.render('index');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('[ERROR] Application error:', err);
    console.error('[ERROR] Stack trace:', err.stack);
    res.status(500).send(`
        <h1>Internal Server Error</h1>
        <p>Error: ${err.message}</p>
        <pre>${err.stack}</pre>
    `); // Intentionally exposing error details for vulnerability
});

// 404 handler
app.use((req, res) => {
    console.log(`[WARN] 404 - Page not found: ${req.url}`);
    res.status(404).render('404');
});

// Start server
app.listen(PORT, () => {
    console.log(`[INFO] NCA Student Portal CTF Server running on port ${PORT}`);
    console.log(`[INFO] Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`[INFO] Database: ${MONGODB_URI}`);
    console.log(`[INFO] Vulnerable features enabled for CTF training`);
});

module.exports = app;