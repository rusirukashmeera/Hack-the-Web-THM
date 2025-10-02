# NCA Student Portal - CTF Vulnerable Web Application

## Description
This is a deliberately vulnerable web application designed for Capture The Flag (CTF) training. It simulates the NCA Campus Student Portal with intentional security flaws for educational purposes.

## Story
NCA Campus recently updated their student portal. You are invited to pen test the portal as a Bounty Hunter. Your task is to test the portal without damaging their data, hardware and software. You did the testing and found some interesting vulnerabilities in the portal.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas cloud service)
- Git

### Installation

1. Clone or download the project
2. Install dependencies:
```bash
npm install
```

3. Configure MongoDB:
   - For local MongoDB: Update the `MONGODB_URI` in `app.js` to your local MongoDB connection string
   - For MongoDB Atlas: Replace the connection string with your Atlas cluster URL

4. Seed the database with test data:
```bash
node seed.js
```

5. Start the application:
```bash
npm start
```
or for development with auto-restart:
```bash
npm run dev
```

6. Access the application at `http://localhost:3000`

## Test Credentials

### Unified Login Page
The application now uses a single login page for both students and administrators. Users are automatically directed to the appropriate portal based on their username.

**Student Access:**
- Username: `user1`
- Password: `pwd@user1`

**Admin Access:**
- Username: `admin@it`
- Password: `password123`

## CTF Challenges

### Task 1: A01:2021 – Broken Access Control
**Objective**: Manipulate parameters to access admin portal

**Method**:
1. Go to the unified login page (`/login`)
2. Login as user with credentials: `user1` / `pwd@user1`
3. Intercept the login request and modify the `id` parameter from `student` to `admin`
4. Flag is the parameter value used to access admin portal: `admin`

### Task 2: A05:2021 – Security Misconfiguration
**Objective**: Exploit error messages to gain sensitive information and brute force login

**Method**:
1. Go to the unified login page (`/login`)
2. Try logging in with username `admin` (without @)
3. Observe error message revealing username pattern requirement
4. Try `admin@it` as username with a wrong password
5. Observe "Password is incorrect" message confirming username exists
6. Brute force the password field (hint: `password123`)
7. Flag appears in alert box upon successful login: `THM{security_misconfiguration_admin123}`

### Task 3: Injection Vulnerabilities

#### XSS (Cross-Site Scripting)
**Location**: Admin Search Students page
**Method**:
1. Navigate to admin search page
2. Enter XSS payload: `<script>alert(1)</script>`
3. Flag appears in alert box

#### OS Command Injection
**Location**: Admin Add Student page
**Method**:
1. Navigate to add student page
2. In the age field, enter: `20; whoami`
3. Submit the form
4. Flag (username) appears in response

## Project Structure
```
├── app.js              # Main application file
├── package.json        # Dependencies and scripts
├── seed.js             # Database seeding script
├── models/
│   ├── Student.js      # Student data model
│   └── Admin.js        # Admin data model
├── routes/
│   ├── auth.js         # Authentication routes
│   ├── student.js      # Student portal routes
│   └── admin.js        # Admin portal routes
├── views/              # EJS templates
│   ├── index.ejs       # Landing page
│   ├── student-login.ejs
│   ├── admin-login.ejs
│   ├── student-dashboard.ejs
│   ├── admin-dashboard.ejs
│   ├── admin-search.ejs
│   ├── admin-add-student.ejs
│   └── 404.ejs
└── public/
    ├── css/
    │   └── style.css    # Application styles
    └── uploads/         # File upload directory
```

## Key Features

1. **Unified Login System**: Single login page for both students and administrators
2. **Automatic Role Detection**: Users are redirected based on username pattern (@domain for admins)
3. **Optional Photo Upload**: Student photos are optional in the registration form
4. **Responsive Design**: Works on desktop and mobile devices
5. **Comprehensive Logging**: Verbose console output for debugging and monitoring

## Security Vulnerabilities (Intentional)

1. **Broken Access Control**: Parameter manipulation allows unauthorized access
2. **Security Misconfiguration**: Verbose error messages expose system information
3. **Cross-Site Scripting (XSS)**: Unsanitized user input in search functionality
4. **Command Injection**: Unsafe execution of system commands
5. **Weak Authentication**: No password hashing, predictable credentials
6. **Information Disclosure**: Detailed error messages and stack traces

## Technologies Used
- **Backend**: Node.js, Express.js
- **Frontend**: EJS templating, CSS
- **Database**: MongoDB with Mongoose ODM
- **File Upload**: Multer
- **Session Management**: express-session

## Development Notes
- Verbose console logging is enabled for debugging
- All vulnerabilities are intentional for educational purposes
- Error handling deliberately exposes sensitive information
- No input validation or sanitization in vulnerable endpoints

## Security Warning
⚠️ **This application contains intentional security vulnerabilities and should NEVER be deployed in a production environment. It is designed solely for educational and training purposes.**

## License
This project is for educational use only. Not intended for production deployment.