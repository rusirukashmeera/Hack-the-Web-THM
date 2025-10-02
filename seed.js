// Database seeding script to populate initial data
const mongoose = require('mongoose');
const Student = require('./models/Student');
const Admin = require('./models/Admin');
const dotenv = require('dotenv');
dotenv.config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

async function seedDatabase() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('[INFO] Connected to MongoDB for seeding');

        // Clear existing data
        await Student.deleteMany({});
        await Admin.deleteMany({});

        // Create test student (for Task 1)
        const testStudent = new Student({
            studentId: 'NCA0001',
            fullName: 'John Doe',
            email: 'john.doe@nca.edu',
            contactNumber: '+1234567890',
            currentYear: 2,
            currentSemester: 1,
            username: 'user1',
            password: 'pwd@user1',
            photo: '/uploads/default-student.jpg',
            age: '20',
            examResults: [
                {
                    semester: 1,
                    year: 1,
                    subjects: [
                        { name: 'Mathematics', grade: 'A', credits: 3 },
                        { name: 'Programming Fundamentals', grade: 'B+', credits: 4 },
                        { name: 'Database Systems', grade: 'A-', credits: 3 }
                    ],
                    gpa: 3.7
                },
                {
                    semester: 2,
                    year: 1,
                    subjects: [
                        { name: 'Data Structures', grade: 'A', credits: 4 },
                        { name: 'Web Development', grade: 'A-', credits: 3 },
                        { name: 'Computer Networks', grade: 'B+', credits: 3 }
                    ],
                    gpa: 3.6
                }
            ]
        });

        await testStudent.save();

        // Create test admin (for Task 2)
        const testAdmin = new Admin({
            username: 'admin@it',
            password: 'password123', // Common password for brute force
            department: 'IT',
            fullName: 'Admin User',
            role: 'admin'
        });

        await testAdmin.save();

        // Create additional sample students
        const sampleStudents = [
            {
                studentId: 'NCA0002',
                fullName: 'Jane Smith',
                email: 'jane.smith@nca.edu',
                contactNumber: '+1234567891',
                currentYear: 3,
                currentSemester: 1,
                username: 'janesmith',
                password: 'student123',
                photo: '/uploads/default-student.jpg',
                age: '21',
                examResults: [
                    {
                        semester: 1,
                        year: 2,
                        subjects: [
                            { name: 'Software Engineering', grade: 'A', credits: 4 },
                            { name: 'Operating Systems', grade: 'A-', credits: 3 }
                        ],
                        gpa: 3.8
                    }
                ]
            },
            {
                studentId: 'NCA0003',
                fullName: 'Mike Johnson',
                email: 'mike.johnson@nca.edu',
                contactNumber: '+1234567892',
                currentYear: 1,
                currentSemester: 2,
                username: 'mikejohnson',
                password: 'student123',
                photo: '/uploads/default-student.jpg',
                age: '19',
                examResults: [
                    {
                        semester: 1,
                        year: 1,
                        subjects: [
                            { name: 'Introduction to Computing', grade: 'B+', credits: 3 },
                            { name: 'Mathematics', grade: 'A-', credits: 3 }
                        ],
                        gpa: 3.5
                    }
                ]
            }
        ];

        for (const studentData of sampleStudents) {
            const student = new Student(studentData);
            await student.save();
        }

        console.log('[SUCCESS] Database seeded successfully!');
        console.log('[INFO] Test student: username=user1, password=pwd@user1');
        console.log('[INFO] Test admin: username=admin@it, password=password123');
        console.log('[INFO] Additional students created for testing');

        await mongoose.disconnect();
        console.log('[INFO] Disconnected from MongoDB');

    } catch (error) {
        console.error('[ERROR] Database seeding failed:', error);
        process.exit(1);
    }
}

// Run seeding
seedDatabase();