const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    currentYear: {
        type: Number,
        required: true
    },
    currentSemester: {
        type: Number,
        required: true
    },
    photo: {
        type: String,
        default: '/uploads/default-student.jpg'
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    examResults: [{
        semester: Number,
        year: Number,
        subjects: [{
            name: String,
            grade: String,
            credits: Number
        }],
        gpa: Number
    }],
    age: {
        type: String, // Intentionally string for command injection vulnerability
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);