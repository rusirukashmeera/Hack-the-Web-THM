const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Admin = require('../models/Admin');

// Unified login page
router.get('/login', (req, res) => {
    console.log('[INFO] Rendering unified login page');
    res.render('login');
});

// Backward compatibility routes
router.get('/student-login', (req, res) => {
    res.redirect('/login');
});

router.get('/admin-login', (req, res) => {
    res.redirect('/login');
});

// Unified login POST - Handles both student and admin login
router.post('/login', async (req, res) => {
    const { username, password, id } = req.body;
    
    console.log('[INFO] Unified login attempt');
    console.log('[DEBUG] Login data:', { username, password, id });
    
    try {
        // Vulnerable: Check if id parameter is 'admin' (Task 1 flag)
        if (id === 'admin') {
            console.log('[SECURITY] Broken Access Control detected - flag: admin');
            req.session.userType = 'admin';
            req.session.userId = 'admin';
            req.session.username = 'admin';
            return res.redirect('/admin/dashboard');
        }
        
        // First, check if it's an admin login (contains @)
        if (username && username.includes('@')) {
            console.log('[INFO] Admin login detected based on username pattern');
            
            // Vulnerable: Expose username pattern in error message (Task 2)
            const admin = await Admin.findOne({ username });
            
            if (!admin) {
                console.log('[SECURITY] Username pattern exposed in error');
                return res.render('login', { 
                    error: "Wrong username pattern. Username must be in 'admin@[Department]' format" 
                });
            }
            
            // Check password
            if (admin.password !== password) {
                console.log('[SECURITY] Password incorrect for admin:', username);
                return res.render('login', { 
                    error: "Password is incorrect" 
                });
            }
            
            // Successful admin login with flag
            console.log('[INFO] Admin login successful:', admin.username);
            req.session.userType = 'admin';
            req.session.userId = admin._id;
            req.session.username = admin.username;
            
            // Task 2 flag in alert box
            return res.send(`
                <script>
                    alert('Flag: THM{security_misconfiguration_admin123}');
                    window.location.href = '/admin/dashboard';
                </script>
            `);
        } else {
            // Try student login
            console.log('[INFO] Student login attempt');
            const student = await Student.findOne({ username, password }); // No password hashing for simplicity
            
            if (student) {
                console.log('[INFO] Student login successful:', student.username);
                req.session.userType = 'student';
                req.session.userId = student._id;
                req.session.username = student.username;
                req.session.studentId = student.studentId;
                return res.redirect('/student/dashboard');
            } else {
                console.log('[WARN] Invalid credentials');
                return res.render('login', { error: 'Invalid username or password' });
            }
        }
        
    } catch (error) {
        console.error('[ERROR] Login error:', error);
        res.render('login', { error: 'Login failed. Please try again.' });
    }
});

// Backward compatibility routes
router.post('/student-login', (req, res) => {
    // Redirect POST requests to unified login
    req.url = '/login';
    router.handle(req, res);
});

router.post('/admin-login', (req, res) => {
    // Redirect POST requests to unified login
    req.url = '/login';
    router.handle(req, res);
});

// Logout
router.get('/logout', (req, res) => {
    console.log('[INFO] User logout:', req.session.username);
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;