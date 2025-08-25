// ===== AUTHENTICATION SYSTEM =====

class AuthSystem {
    constructor() {
        this.isLoggedIn = false;
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.addEventListeners();
        this.updateAuthDisplay();
    }

    checkAuthStatus() {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('currentUser');
        
        if (token && userData) {
            this.isLoggedIn = true;
            this.currentUser = JSON.parse(userData);
        }
    }

    addEventListeners() {
        // Auth modal triggers
        const createAccountBtn = document.getElementById('create-account');
        const loginBtn = document.getElementById('login');
        
        if (createAccountBtn) {
            createAccountBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAuthModal('register');
            });
        }
        
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAuthModal('login');
            });
        }

        // Modal functionality
        const modal = document.getElementById('auth-modal');
        const closeBtn = document.querySelector('.close');
        
        if (modal && closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideAuthModal();
            });

            window.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideAuthModal();
                }
            });
        }

        // Form switching
        const showRegisterLink = document.getElementById('show-register');
        const showLoginLink = document.getElementById('show-login');
        
        if (showRegisterLink) {
            showRegisterLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchForm('register');
            });
        }
        
        if (showLoginLink) {
            showLoginLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchForm('login');
            });
        }

        // Form submissions
        const loginForm = document.querySelector('#login-form form');
        const registerForm = document.querySelector('#register-form form');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(e.target);
            });
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister(e.target);
            });
        }

        // Newsletter functionality
        const newsletterBtn = document.getElementById('newsletter-btn');
        if (newsletterBtn) {
            newsletterBtn.addEventListener('click', () => {
                this.handleNewsletter();
            });
        }
    }

    showAuthModal(type = 'login') {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.style.display = 'block';
            this.switchForm(type);
        }
    }

    hideAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.style.display = 'none';
            // Clear forms
            const forms = modal.querySelectorAll('form');
            forms.forEach(form => form.reset());
        }
    }

    switchForm(type) {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (type === 'register') {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        } else {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        }
    }

    handleLogin(form) {
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;

        if (!email || !password) {
            this.showNotification('Por favor completa todos los campos', 'error');
            return;
        }

        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.login(user);
            this.hideAuthModal();
            this.showNotification('¡Bienvenido de vuelta!', 'success');
        } else {
            this.showNotification('Email o contraseña incorrectos', 'error');
        }
    }

    handleRegister(form) {
        const name = form.querySelector('input[type="text"]').value;
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelectorAll('input[type="password"]')[0].value;
        const confirmPassword = form.querySelectorAll('input[type="password"]')[1].value;

        if (!name || !email || !password || !confirmPassword) {
            this.showNotification('Por favor completa todos los campos', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showNotification('Las contraseñas no coinciden', 'error');
            return;
        }

        if (password.length < 6) {
            this.showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }

        if (this.users.find(u => u.email === email)) {
            this.showNotification('Este email ya está registrado', 'error');
            return;
        }

        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));
        
        this.login(newUser);
        this.hideAuthModal();
        this.showNotification('¡Cuenta creada exitosamente!', 'success');
    }

    login(user) {
        this.isLoggedIn = true;
        this.currentUser = user;
        
        // Generate simple token
        const token = btoa(JSON.stringify({ userId: user.id, timestamp: Date.now() }));
        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        this.updateAuthDisplay();
    }

    logout() {
        this.isLoggedIn = false;
        this.currentUser = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        this.updateAuthDisplay();
        this.showNotification('Sesión cerrada', 'success');
    }

    updateAuthDisplay() {
        const createAccountBtn = document.getElementById('create-account');
        const loginBtn = document.getElementById('login');
        
        if (this.isLoggedIn && this.currentUser) {
            if (createAccountBtn) createAccountBtn.textContent = this.currentUser.name;
            if (loginBtn) {
                loginBtn.textContent = 'Cerrar sesión';
                loginBtn.onclick = (e) => {
                    e.preventDefault();
                    this.logout();
                };
            }
        } else {
            if (createAccountBtn) createAccountBtn.textContent = 'Crear cuenta';
            if (loginBtn) {
                loginBtn.textContent = 'Iniciar sesión';
                loginBtn.onclick = (e) => {
                    e.preventDefault();
                    this.showAuthModal('login');
                };
            }
        }
    }

    handleNewsletter() {
        const emailInput = document.getElementById('newsletter-email');
        if (emailInput) {
            const email = emailInput.value.trim();
            
            if (email && this.isValidEmail(email)) {
                // Store newsletter subscription
                const subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions')) || [];
                if (!subscriptions.includes(email)) {
                    subscriptions.push(email);
                    localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
                }
                
                this.showNotification('¡Te has suscrito al newsletter!', 'success');
                emailInput.value = '';
            } else {
                this.showNotification('Por favor ingresa un email válido', 'error');
            }
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        const backgroundColor = type === 'success' ? '#4CAF50' : '#f44336';
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${backgroundColor};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize auth system when DOM is loaded
let authSystem;
document.addEventListener('DOMContentLoaded', function() {
    authSystem = new AuthSystem();
});

// Add CSS for modal and animations
const authStyle = document.createElement('style');
authStyle.textContent = `
    .modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.8);
        animation: fadeIn 0.3s ease-out;
    }

    .modal-content {
        background-color: #111;
        margin: 5% auto;
        padding: 30px;
        border: 1px solid #333;
        border-radius: 10px;
        width: 90%;
        max-width: 400px;
        position: relative;
        animation: slideDown 0.3s ease-out;
    }

    .close {
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
        position: absolute;
        right: 20px;
        top: 15px;
        cursor: pointer;
        transition: color 0.3s ease;
    }

    .close:hover {
        color: #fff;
    }

    .auth-form h2 {
        text-align: center;
        margin-bottom: 25px;
        color: #fff;
        font-size: 1.8em;
    }

    .auth-form form {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .auth-form input {
        padding: 12px;
        border: 1px solid #333;
        border-radius: 5px;
        background: #222;
        color: #fff;
        font-size: 1em;
    }

    .auth-form input:focus {
        outline: none;
        border-color: #fff;
    }

    .auth-form button {
        background: #fff;
        color: #000;
        padding: 12px;
        border: none;
        border-radius: 5px;
        font-size: 1em;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.3s ease;
    }

    .auth-form button:hover {
        background: #f0f0f0;
    }

    .auth-form p {
        text-align: center;
        margin-top: 20px;
        color: #ccc;
    }

    .auth-form a {
        color: #fff;
        text-decoration: underline;
        cursor: pointer;
    }

    .auth-form a:hover {
        color: #ccc;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideDown {
        from {
            transform: translateY(-50px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    @media (max-width: 480px) {
        .modal-content {
            margin: 10% auto;
            padding: 20px;
            width: 95%;
        }
    }
`;
document.head.appendChild(authStyle);
