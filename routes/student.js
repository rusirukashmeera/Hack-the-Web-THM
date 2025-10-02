const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Middleware to check if user is logged in as student
const requireStudent = (req, res, next) => {
    console.log('[AUTH] Checking student authentication');
    console.log('[AUTH] Session data:', req.session);
    
    if (!req.session.userType || req.session.userType !== 'student') {
        console.log('[AUTH] Access denied - not logged in as student');
        return res.redirect('/login');
    }
    next();
};

// Student dashboard
router.get('/dashboard', requireStudent, async (req, res) => {
    try {
        console.log('[INFO] Loading student dashboard for:', req.session.username);
        
        const student = await Student.findById(req.session.userId);
        
        if (!student) {
            console.error('[ERROR] Student not found in database');
            return res.redirect('/login');
        }
        
        console.log('[INFO] Student data loaded successfully');
        res.render('student-dashboard', { student });
        
    } catch (error) {
        console.error('[ERROR] Error loading student dashboard:', error);
        res.status(500).send('Error loading dashboard');
    }
});

module.exports = router;