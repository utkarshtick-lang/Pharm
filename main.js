// ========================================
// SHREYA PHARMACY - MAIN ORCHESTRATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize loader
    const loader = document.getElementById('loader');

    // Start initialization
    init();

    // Hide loader after everything is ready
    setTimeout(() => {
        loader?.classList.add('hidden');
    }, 2000);
});

function init() {
    // Initialize effects (cursor trail, particles, magnetic buttons)
    if (typeof initEffects === 'function') {
        initEffects();
    }

    // Initialize Three.js 3D scene
    if (typeof initThreeScene === 'function') {
        initThreeScene();
    }

    // Initialize GSAP animations
    if (typeof initAnimations === 'function') {
        initAnimations();
    }

    // Initialize smooth scroll
    if (typeof initSmoothScroll === 'function') {
        initSmoothScroll();
    }

    // Initialize active nav tracking
    if (typeof initActiveNav === 'function') {
        initActiveNav();
    }

    // Initialize UI components
    if (typeof initComponents === 'function') {
        initComponents();
    }

    // Initialize testimonial carousel
    if (typeof TestimonialCarousel === 'function') {
        new TestimonialCarousel();
    }

    // Typewriter effect for subtitle
    initTypewriter();

    // Add keyboard shortcuts
    initKeyboardShortcuts();

    // Mobile menu
    initMobileMenu();
}

// Typewriter effect
function initTypewriter() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;

    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.classList.remove('typewriter');

    let i = 0;
    const type = () => {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
            setTimeout(type, 30);
        }
    };

    // Start after hero animations
    setTimeout(type, 1500);
}

// Keyboard shortcuts
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // ESC to close modals
        if (e.key === 'Escape') {
            closeAuthModal?.();
            closeProductModal?.();
            closeCart?.();
        }

        // Ctrl+K for search focus
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            document.querySelector('.search-input')?.focus();
        }
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (!menuBtn) return;

    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-open');
        menuBtn.classList.toggle('active');
    });
}

// Reduced motion check
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Performance check for heavy effects
function isHighPerformanceDevice() {
    // Simple heuristic: check for mobile or low memory
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const memory = navigator.deviceMemory || 4;
    return !isMobile && memory >= 4;
}

// Console easter egg
console.log(`
%c╔══════════════════════════════════════════╗
%c║   🧬 SHREYA PHARMACY - THE FUTURE OF      ║
%c║      HEALTHCARE COMMERCE IN 2045         ║
%c╠══════════════════════════════════════════╣
%c║  Built with:                             ║
%c║  • Three.js for 3D experiences           ║
%c║  • GSAP for buttery animations           ║
%c║  • Pure CSS for glassmorphism            ║
%c║  • Vanilla JS for maximum performance    ║
%c╚══════════════════════════════════════════╝
`,
    'color: #00F0FF; font-weight: bold',
    'color: #FF006E; font-weight: bold',
    'color: #FFD700; font-weight: bold',
    'color: #00F0FF; font-weight: bold',
    'color: #FF006E',
    'color: #00F0FF',
    'color: #00F0FF',
    'color: #00F0FF',
    'color: #00F0FF',
    'color: #00F0FF; font-weight: bold'
);
