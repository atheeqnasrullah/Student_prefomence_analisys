// Navigation Functions
function selectRole(role) {
    if (role === 'student') {
        window.location.href = 'student.html';
    } else if (role === 'teacher') {
        window.location.href = 'teacher.html';
    }
}

function goToPage(page) {
    window.location.href = page;
}

function goHome() {
    window.location.href = 'index.html';
}

function goBack() {
    window.history.back();
}

// User Management
function getStoredUsers() {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
    return { students, teachers };
}

function saveUser(userData, userType) {
    const { students, teachers } = getStoredUsers();
    
    if (userType === 'student') {
        students.push(userData);
        localStorage.setItem('students', JSON.stringify(students));
    } else if (userType === 'teacher') {
        teachers.push(userData);
        localStorage.setItem('teachers', JSON.stringify(teachers));
    }
}

function findUser(email, userType) {
    const { students, teachers } = getStoredUsers();
    const users = userType === 'student' ? students : teachers;
    return users.find(user => user.email === email);
}

function setCurrentUser(userData, userType) {
    const userSession = {
        ...userData,
        userType: userType,
        loginTime: new Date().toISOString()
    };
    localStorage.setItem('currentUser', JSON.stringify(userSession));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
}

function logout() {
    localStorage.removeItem('currentUser');
    showAlert('Logged out successfully!', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Form Validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 8;
}

function validateForm(formData, requiredFields) {
    const errors = {};

    requiredFields.forEach(field => {
        if (!formData[field] || formData[field].trim() === '') {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        }
    });

    if (formData.email && !validateEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
    }

    if (formData.password && !validatePassword(formData.password)) {
        errors.password = 'Password must be at least 8 characters long';
    }

    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
}

function displayFormErrors(errors) {
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

    // Display new errors
    Object.keys(errors).forEach(field => {
        const input = document.querySelector(`[name="${field}"]`);
        if (input) {
            input.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errors[field];
            input.parentNode.appendChild(errorDiv);
        }
    });
}

function clearFormErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

// Student Registration Handler
function handleStudentRegister(event) {
    event.preventDefault();
    clearFormErrors();

    const formData = new FormData(event.target);
    const studentData = Object.fromEntries(formData.entries());

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'studentId', 'grade', 'school', 'password', 'confirmPassword'];
    const errors = validateForm(studentData, requiredFields);

    // Check if terms are agreed
    if (!studentData.terms) {
        errors.terms = 'You must agree to the terms and conditions';
    }

    // Check if email already exists
    if (findUser(studentData.email, 'student')) {
        errors.email = 'A student with this email already exists';
    }

    if (Object.keys(errors).length > 0) {
        displayFormErrors(errors);
        return;
    }

    // Save student data
    const userData = {
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        email: studentData.email,
        studentId: studentData.studentId,
        grade: studentData.grade,
        school: studentData.school,
        registrationDate: new Date().toISOString()
    };

    saveUser(userData, 'student');
    setCurrentUser(userData, 'student');
    
    showAlert('Student account created successfully!', 'success');
    setTimeout(() => {
        window.location.href = 'student-dashboard.html';
    }, 1500);
}

// Teacher Registration Handler
function handleTeacherRegister(event) {
    event.preventDefault();
    clearFormErrors();

    const formData = new FormData(event.target);
    const teacherData = Object.fromEntries(formData.entries());

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'subject', 'experience', 'qualification', 'institution', 'password', 'confirmPassword'];
    const errors = validateForm(teacherData, requiredFields);

    // Check if terms are agreed
    if (!teacherData.terms) {
        errors.terms = 'You must agree to the terms and conditions';
    }

    // Check if email already exists
    if (findUser(teacherData.email, 'teacher')) {
        errors.email = 'A teacher with this email already exists';
    }

    if (Object.keys(errors).length > 0) {
        displayFormErrors(errors);
        return;
    }

    // Save teacher data
    const userData = {
        firstName: teacherData.firstName,
        lastName: teacherData.lastName,
        email: teacherData.email,
        employeeId: teacherData.employeeId,
        subject: teacherData.subject,
        experience: teacherData.experience,
        qualification: teacherData.qualification,
        institution: teacherData.institution,
        bio: teacherData.bio,
        registrationDate: new Date().toISOString()
    };

    saveUser(userData, 'teacher');
    setCurrentUser(userData, 'teacher');
    
    showAlert('Teacher account created successfully!', 'success');
    setTimeout(() => {
        window.location.href = 'teacher-dashboard.html';
    }, 1500);
}

// Student Login Handler
function handleStudentLogin(event) {
    event.preventDefault();
    clearFormErrors();

    const formData = new FormData(event.target);
    const loginData = Object.fromEntries(formData.entries());

    const errors = {};

    if (!loginData.email) {
        errors.email = 'Email is required';
    } else if (!validateEmail(loginData.email)) {
        errors.email = 'Please enter a valid email address';
    }

    if (!loginData.password) {
        errors.password = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
        displayFormErrors(errors);
        return;
    }

    // Check if user exists
    const user = findUser(loginData.email, 'student');
    if (!user) {
        errors.email = 'No student account found with this email';
        displayFormErrors(errors);
        return;
    }

    // In a real application, you would verify the password against a hashed version
    // For this demo, we'll assume the login is successful
    setCurrentUser(user, 'student');
    showAlert('Login successful!', 'success');
    setTimeout(() => {
        window.location.href = 'student-dashboard.html';
    }, 1500);
}

// Teacher Login Handler
function handleTeacherLogin(event) {
    event.preventDefault();
    clearFormErrors();

    const formData = new FormData(event.target);
    const loginData = Object.fromEntries(formData.entries());

    const errors = {};

    if (!loginData.email) {
        errors.email = 'Email is required';
    } else if (!validateEmail(loginData.email)) {
        errors.email = 'Please enter a valid email address';
    }

    if (!loginData.password) {
        errors.password = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
        displayFormErrors(errors);
        return;
    }

    // Check if user exists
    const user = findUser(loginData.email, 'teacher');
    if (!user) {
        errors.email = 'No teacher account found with this email';
        displayFormErrors(errors);
        return;
    }

    // In a real application, you would verify the password against a hashed version
    // For this demo, we'll assume the login is successful
    setCurrentUser(user, 'teacher');
    showAlert('Login successful!', 'success');
    setTimeout(() => {
        window.location.href = 'teacher-dashboard.html';
    }, 1500);
}

// Dashboard Initialization
function initializeDashboard() {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        showAlert('Please log in to access the dashboard', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }

    // Update user name in dashboard
    const userNameElement = document.getElementById('studentName') || document.getElementById('teacherName');
    if (userNameElement) {
        userNameElement.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    }

    // Add welcome message based on time
    const welcomeSection = document.querySelector('.welcome-section h2');
    if (welcomeSection && currentUser.userType === 'teacher') {
        const hour = new Date().getHours();
        let greeting = 'Good morning';
        if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
        else if (hour >= 17) greeting = 'Good evening';
        
        welcomeSection.textContent = `${greeting}, ${currentUser.firstName}!`;
    }
}

// Alert System
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());

    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideInRight 0.3s ease;
    `;

    // Set background color based on type
    switch (type) {
        case 'success':
            alert.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            break;
        case 'error':
            alert.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            break;
        case 'warning':
            alert.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
            break;
        default:
            alert.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    }

    alert.textContent = message;

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(alert);

    // Auto remove after 5 seconds
    setTimeout(() => {
        alert.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 300);
    }, 5000);
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Dashboard Interaction Functions
function viewCourse(courseId) {
    showAlert('Course viewer coming soon!', 'info');
}

function submitAssignment() {
    showAlert('Assignment submission feature coming soon!', 'info');
}

function viewGrades() {
    showAlert('Grade viewer coming soon!', 'info');
}

function viewSchedule() {
    showAlert('Schedule viewer coming soon!', 'info');
}

function createAssignment() {
    showAlert('Assignment creator coming soon!', 'info');
}

function gradeAssignment(assignmentId) {
    showAlert('Grading interface coming soon!', 'info');
}

function viewAnalytics() {
    showAlert('Analytics dashboard coming soon!', 'info');
}

function messageStudents() {
    showAlert('Messaging system coming soon!', 'info');
}

function manageClass(classId) {
    showAlert('Class management interface coming soon!', 'info');
}

function startClass(classId) {
    showAlert('Virtual classroom launching soon!', 'info');
}

// Search and Filter Functions
function searchCourses(query) {
    const courses = document.querySelectorAll('.course-card');
    courses.forEach(course => {
        const title = course.querySelector('h4').textContent.toLowerCase();
        const teacher = course.querySelector('p').textContent.toLowerCase();
        const searchQuery = query.toLowerCase();
        
        if (title.includes(searchQuery) || teacher.includes(searchQuery)) {
            course.style.display = 'block';
        } else {
            course.style.display = 'none';
        }
    });
}

function filterAssignments(status) {
    const assignments = document.querySelectorAll('.assignment-item');
    assignments.forEach(assignment => {
        const assignmentStatus = assignment.querySelector('.assignment-status').textContent.toLowerCase();
        
        if (status === 'all' || assignmentStatus.includes(status.toLowerCase())) {
            assignment.style.display = 'flex';
        } else {
            assignment.style.display = 'none';
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard if on dashboard page
    if (window.location.pathname.includes('dashboard')) {
        initializeDashboard();
    }

    // Add smooth scrolling to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add loading states to forms
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function() {
            const submitBtn = this.querySelector('[type="submit"]');
            if (submitBtn) {
                submitBtn.style.opacity = '0.7';
                submitBtn.style.pointerEvents = 'none';
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Processing...';
                
                setTimeout(() => {
                    submitBtn.style.opacity = '1';
                    submitBtn.style.pointerEvents = 'auto';
                    submitBtn.textContent = originalText;
                }, 2000);
            }
        });
    });

    // Add click handlers for navigation items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            document.querySelectorAll('.nav-item').forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Show appropriate content based on navigation
            const navText = this.textContent.trim();
            showAlert(`${navText} section coming soon!`, 'info');
        });
    });

    // Add responsive menu toggle for mobile
    const header = document.querySelector('.dashboard-header');
    if (header && window.innerWidth <= 768) {
        const menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '☰';
        menuToggle.style.cssText = `
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #667eea;
        `;
        
        menuToggle.addEventListener('click', function() {
            const sidebar = document.querySelector('.dashboard-sidebar');
            if (sidebar) {
                sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
            }
        });
        
        header.appendChild(menuToggle);
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for quick search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        showAlert('Quick search coming soon!', 'info');
    }
    
    // Escape to close alerts
    if (e.key === 'Escape') {
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => alert.remove());
    }
});

// Window resize handler
window.addEventListener('resize', function() {
    // Adjust dashboard layout on resize
    const sidebar = document.querySelector('.dashboard-sidebar');
    if (sidebar) {
        if (window.innerWidth > 768) {
            sidebar.style.display = 'block';
        } else if (window.innerWidth <= 768) {
            sidebar.style.display = 'none';
        }
    }
});

// Export functions for global access
window.eduFlow = {
    selectRole,
    goToPage,
    goHome,
    goBack,
    logout,
    showAlert,
    handleStudentRegister,
    handleTeacherRegister,
    handleStudentLogin,
    handleTeacherLogin,
    viewCourse,
    submitAssignment,
    viewGrades,
    viewSchedule,
    createAssignment,
    gradeAssignment,
    viewAnalytics,
    messageStudents,
    manageClass,
    startClass
};
