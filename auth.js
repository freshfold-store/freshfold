// auth.js - Authentication System with localStorage

// Initialize users array from localStorage
function getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

// Save users array to localStorage
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Get current logged-in user
function getCurrentUser() {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
}

// Save current user to localStorage
function saveCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Handle Sign Up
function handleSignup(event) {
    event.preventDefault();

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    // Validate passwords match
    if (password !== confirmPassword) {
        showAlert('Passwords do not match!', 'danger');
        return;
    }

    // Get existing users
    const users = getUsers();

    // Check if email already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        showAlert('Email already registered! Please login.', 'warning');
        return;
    }

    // Create new user object
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        password: password,
        registeredDate: new Date().toISOString()
    };

    // Add user to array and save
    users.push(newUser);
    saveUsers(users);

    // Show success message
    showAlert('Account created successfully! Redirecting to login...', 'success');

    // Redirect to login after 2 seconds
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Get existing users
    const users = getUsers();

    // Find user with matching credentials
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Save current user
        saveCurrentUser({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone
        });

        // If remember me is checked, set a flag
        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
        }

        // Show success message
        showAlert('Login successful! Redirecting...', 'success');

        // Redirect to home page after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } else {
        // Show error message
        showAlert('Invalid email or password!', 'danger');
    }
}

// Handle Logout
function logout() {
    // Check if remember me was set
    const rememberMe = localStorage.getItem('rememberMe');

    // Remove current user
    localStorage.removeItem('currentUser');

    // If remember me was not set, clear everything
    if (!rememberMe) {
        localStorage.removeItem('users');
    }

    // Redirect to home page
    window.location.href = 'index.html';
}

// Check Login Status on Page Load
function checkLoginStatus() {
    const currentUser = getCurrentUser();

    if (currentUser) {
        // User is logged in
        const authButtons = document.getElementById('authButtons');
        const userGreeting = document.getElementById('userGreeting');
        const userName = document.getElementById('userName');

        if (authButtons && userGreeting && userName) {
            authButtons.classList.add('d-none');
            userGreeting.classList.remove('d-none');
            userName.textContent = currentUser.name;
        }
    }
}

// Show Alert Messages
function showAlert(message, type) {
    const alertDiv = document.getElementById('alertMessage');
    if (!alertDiv) return;

    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    alertDiv.classList.remove('d-none');

    // Auto dismiss after 5 seconds
    setTimeout(() => {
        alertDiv.classList.add('d-none');
    }, 5000);
}

// Validate Email Format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate Phone Number (10 digits)
function validatePhone(phone) {
    const re = /^[0-9]{10}$/;
    return re.test(phone);
}
