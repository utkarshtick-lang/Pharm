// ========================================
// FIREBASE CONFIGURATION
// ========================================

const firebaseConfig = {
    apiKey: "AIzaSyCVu2kFEEHKwLa1Rk4EssFUpq9SmWHTw7M",
    authDomain: "shreya-pharma.firebaseapp.com",
    projectId: "shreya-pharma",
    storageBucket: "shreya-pharma.firebasestorage.app",
    messagingSenderId: "229302923508",
    appId: "1:229302923508:web:bbc0a73a657be70e07eea1",
    measurementId: "G-XN1R1GJ2T4"
};

// Check if Firebase is loaded
if (typeof firebase !== 'undefined') {
    // Initialize Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    // Export auth instance
    window.firebaseAuth = firebase.auth();
    window.googleProvider = new firebase.auth.GoogleAuthProvider();

    console.log('🔥 Firebase initialized successfully!');
} else {
    console.warn('Firebase SDK not loaded - running in demo mode');
    window.firebaseAuth = null;
    window.demoMode = true;
}
