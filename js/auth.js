// ========================================
// SHREYA PHARMACY - AUTHENTICATION
// ========================================

class AuthManager {
    constructor() {
        this.user = null;
        this.listeners = [];
        this.dropdownVisible = false;
        this.init();
    }

    init() {
        // IMMEDIATELY intercept auth button clicks to prevent navigation
        this.setupAuthButtonInterceptor();

        // Check for Firebase auth
        if (window.firebaseAuth) {
            // Listen to auth state changes
            window.firebaseAuth.onAuthStateChanged((user) => {
                console.log('🔐 Auth state changed:', user ? user.displayName : 'signed out');
                this.user = user;
                this.updateUI();
                this.notifyListeners();
            });
        } else {
            // Demo mode - check localStorage
            const savedUser = localStorage.getItem('demo_user');
            if (savedUser) {
                try {
                    this.user = JSON.parse(savedUser);
                    console.log('🔐 Demo user loaded:', this.user.displayName);
                } catch (e) {
                    console.error('Failed to parse demo user');
                }
            }
            // Update UI after DOM is ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.updateUI());
            } else {
                this.updateUI();
            }
        }
    }

    setupAuthButtonInterceptor() {
        // Use event delegation on document to catch auth button clicks
        document.addEventListener('click', (e) => {
            const authBtn = e.target.closest('.auth-btn');
            if (!authBtn) return;

            // Always prevent default navigation
            e.preventDefault();
            e.stopPropagation();

            if (this.user) {
                // User is signed in - show dropdown
                this.toggleDropdown();
            } else {
                // User is signed out - navigate to auth
                window.location.href = 'auth.html';
            }
        }, true); // Use capture phase
    }

    // Google Sign In
    async signInWithGoogle() {
        try {
            if (window.firebaseAuth && window.googleProvider) {
                const result = await window.firebaseAuth.signInWithPopup(window.googleProvider);
                this.user = result.user;
                showToast(`Welcome, ${this.user.displayName}!`, 'success');
                return { success: true, user: this.user };
            } else {
                return this.demoSignIn('google');
            }
        } catch (error) {
            console.error('Google sign-in error:', error);
            showToast('Sign-in failed. Please try again.', 'error');
            return { success: false, error: error.message };
        }
    }

    // Email/Password Sign In
    async signInWithEmail(email, password) {
        try {
            if (window.firebaseAuth) {
                const result = await window.firebaseAuth.signInWithEmailAndPassword(email, password);
                this.user = result.user;
                showToast(`Welcome back!`, 'success');
                return { success: true, user: this.user };
            } else {
                return this.demoSignIn('email', email);
            }
        } catch (error) {
            console.error('Email sign-in error:', error);
            showToast(this.getErrorMessage(error.code), 'error');
            return { success: false, error: error.message };
        }
    }

    // Email/Password Sign Up
    async signUpWithEmail(email, password, displayName) {
        try {
            if (window.firebaseAuth) {
                const result = await window.firebaseAuth.createUserWithEmailAndPassword(email, password);
                await result.user.updateProfile({ displayName });
                this.user = result.user;
                showToast(`Account created! Welcome, ${displayName}!`, 'success');
                return { success: true, user: this.user };
            } else {
                return this.demoSignIn('email', email, displayName);
            }
        } catch (error) {
            console.error('Sign-up error:', error);
            showToast(this.getErrorMessage(error.code), 'error');
            return { success: false, error: error.message };
        }
    }

    // Sign Out
    async signOut() {
        try {
            if (window.firebaseAuth) {
                await window.firebaseAuth.signOut();
            }
            this.user = null;
            localStorage.removeItem('demo_user');
            this.closeDropdown();
            this.updateUI();
            showToast('Signed out successfully', 'info');
        } catch (error) {
            console.error('Sign-out error:', error);
        }
    }

    // Demo mode sign in
    demoSignIn(provider, email = '', displayName = '') {
        const demoUser = {
            uid: 'demo-' + Date.now(),
            email: email || 'demo@shreyapharmacy.com',
            displayName: displayName || 'Demo User',
            photoURL: null,
            provider: provider
        };

        this.user = demoUser;
        localStorage.setItem('demo_user', JSON.stringify(demoUser));
        this.updateUI();
        showToast(`Welcome, ${demoUser.displayName}!`, 'success');
        return { success: true, user: demoUser };
    }

    // Update UI based on auth state
    updateUI() {
        const authBtn = document.querySelector('.auth-btn');
        if (!authBtn) return;

        if (this.user) {
            // User is signed in - show avatar and name
            const initial = this.user.displayName?.charAt(0).toUpperCase() || '👤';
            const avatarHTML = this.user.photoURL
                ? `<img src="${this.user.photoURL}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`
                : initial;

            authBtn.innerHTML = `
                <span class="user-avatar">${avatarHTML}</span>
                <span class="user-name">${this.user.displayName || 'Account'}</span>
            `;
            authBtn.classList.add('signed-in');

            // Prevent default link behavior
            authBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleDropdown();
            };
        } else {
            // User is signed out - show Sign In button
            authBtn.innerHTML = '<span>Sign In</span>';
            authBtn.classList.remove('signed-in');
            authBtn.onclick = (e) => {
                e.preventDefault();
                window.location.href = 'auth.html';
            };
            this.closeDropdown();
        }

        this.notifyListeners();
    }

    toggleDropdown() {
        let dropdown = document.getElementById('user-dropdown-menu');

        if (!dropdown) {
            // Create dropdown and append to body (not nav)
            dropdown = document.createElement('div');
            dropdown.id = 'user-dropdown-menu';
            dropdown.className = 'user-dropdown-fixed';
            dropdown.innerHTML = `
                <div class="dropdown-header">
                    <span class="dropdown-name">${this.user?.displayName || 'User'}</span>
                    <span class="dropdown-email">${this.user?.email || ''}</span>
                </div>
                <div class="dropdown-divider"></div>
                <a href="cart.html" class="dropdown-item">🛒 My Cart</a>
                <a href="orders.html" class="dropdown-item">📋 Order History</a>
                <a href="settings.html" class="dropdown-item">⚙️ Settings</a>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item sign-out-btn">🚪 Sign Out</button>
            `;
            document.body.appendChild(dropdown);

            // Sign out handler
            dropdown.querySelector('.sign-out-btn').onclick = () => {
                this.signOut();
            };

            // Close on outside click
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.auth-btn') && !e.target.closest('#user-dropdown-menu')) {
                    this.closeDropdown();
                }
            }, { once: false });
        }

        // Position dropdown below auth button
        const authBtn = document.querySelector('.auth-btn');
        if (authBtn) {
            const rect = authBtn.getBoundingClientRect();
            dropdown.style.top = `${rect.bottom + 8}px`;
            dropdown.style.right = `${window.innerWidth - rect.right}px`;
        }

        // Toggle visibility
        this.dropdownVisible = !this.dropdownVisible;
        dropdown.classList.toggle('show', this.dropdownVisible);
    }

    closeDropdown() {
        const dropdown = document.getElementById('user-dropdown-menu');
        if (dropdown) {
            dropdown.classList.remove('show');
            this.dropdownVisible = false;
        }
    }

    onAuthStateChange(callback) {
        this.listeners.push(callback);
        callback(this.user);
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback(this.user));
    }

    getErrorMessage(code) {
        const messages = {
            'auth/email-already-in-use': 'This email is already registered.',
            'auth/invalid-email': 'Please enter a valid email address.',
            'auth/user-not-found': 'No account found with this email.',
            'auth/wrong-password': 'Incorrect password.',
            'auth/weak-password': 'Password should be at least 6 characters.',
            'auth/popup-closed-by-user': 'Sign-in was cancelled.',
            'auth/network-request-failed': 'Network error. Please check your connection.'
        };
        return messages[code] || 'An error occurred. Please try again.';
    }

    isAuthenticated() {
        return !!this.user;
    }

    getCurrentUser() {
        return this.user;
    }
}

// Initialize auth manager
const auth = new AuthManager();
window.auth = auth;

// Auth form handlers
function initAuthForms() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            const btn = loginForm.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.innerHTML = '<span>Signing in...</span>';

            const result = await auth.signInWithEmail(email, password);

            if (result.success) {
                window.location.href = 'index.html';
            } else {
                btn.disabled = false;
                btn.innerHTML = '<span>Sign In</span>';
            }
        });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;

            const btn = registerForm.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.innerHTML = '<span>Creating account...</span>';

            const result = await auth.signUpWithEmail(email, password, name);

            if (result.success) {
                window.location.href = 'index.html';
            } else {
                btn.disabled = false;
                btn.innerHTML = '<span>Create Account</span>';
            }
        });
    }

    // Google sign-in buttons
    document.querySelectorAll('.google-signin, .social-auth-btn.google').forEach(btn => {
        btn.addEventListener('click', async () => {
            btn.disabled = true;
            const result = await auth.signInWithGoogle();
            if (result.success) {
                window.location.href = 'index.html';
            } else {
                btn.disabled = false;
            }
        });
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initAuthForms);
