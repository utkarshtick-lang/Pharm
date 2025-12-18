// ========================================
// SHREYA PHARMACY - PAGE ENHANCEMENTS v2.0
// Smoother animations with lerp and spring physics
// ========================================

// Utility: Smooth lerp function
const lerpValue = (start, end, factor) => start + (end - start) * factor;

// Utility: Spring physics for bouncy animations
class Spring {
    constructor(stiffness = 0.1, damping = 0.8) {
        this.stiffness = stiffness;
        this.damping = damping;
        this.velocity = 0;
        this.value = 0;
        this.target = 0;
    }

    update() {
        const force = (this.target - this.value) * this.stiffness;
        this.velocity = this.velocity * this.damping + force;
        this.value += this.velocity;
        return this.value;
    }

    set(target) {
        this.target = target;
    }
}

// ========================================
// SMOOTH PAGE TRANSITIONS
// ========================================
class PageTransitions {
    constructor() {
        this.overlay = null;
        this.progress = 0;
        this.init();
    }

    init() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'page-transition-overlay';
        this.overlay.innerHTML = `
            <div class="transition-content">
                <div class="transition-logo">💊</div>
                <div class="transition-loader"></div>
                <div class="transition-progress"></div>
            </div>
        `;
        document.body.appendChild(this.overlay);

        this.fadeIn();
        this.interceptLinks();
    }

    fadeIn() {
        const progressBar = this.overlay.querySelector('.transition-progress');
        const animate = () => {
            this.progress = lerpValue(this.progress, 100, 0.08);
            progressBar.style.width = `${this.progress}%`;

            if (this.progress < 99) {
                requestAnimationFrame(animate);
            } else {
                document.body.classList.add('page-loaded');
                this.overlay.classList.add('fade-out');
            }
        };

        requestAnimationFrame(animate);
    }

    fadeOut(href) {
        document.body.classList.remove('page-loaded');
        document.body.classList.add('page-leaving');
        this.overlay.classList.remove('fade-out');
        this.overlay.classList.add('fade-in');

        setTimeout(() => {
            window.location.href = href;
        }, 500);
    }

    interceptLinks() {
        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');

            if (href &&
                !href.startsWith('http') &&
                !href.startsWith('#') &&
                !href.startsWith('mailto') &&
                (href.endsWith('.html') || href === 'index.html')) {

                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.fadeOut(href);
                });
            }
        });
    }
}

// ========================================
// SCROLL REVEAL WITH STAGGER
// ========================================
class ScrollReveal {
    constructor() {
        this.elements = [];
        this.init();
    }

    init() {
        // Elements animated by CSS ScrollReveal (excludes those animated by GSAP)
        // GSAP handles: section-header, feature-card, product-card, testimonial-card
        this.elements = document.querySelectorAll(
            '.reveal, .step-card, .benefit-card, .value-card, .team-card, ' +
            '.stat-item, .portal, .glass-card, .order-card, .address-card'
        );

        this.elements.forEach((el, i) => {
            el.classList.add('reveal-hidden');
            el.style.setProperty('--reveal-delay', `${i * 0.05}s`);
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    entry.target.classList.remove('reveal-hidden');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -80px 0px'
        });

        this.elements.forEach(el => observer.observe(el));
    }
}

// ========================================
// SMOOTH SCROLL WITH MOMENTUM
// ========================================
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    this.scrollTo(target);
                }
            });
        });
    }

    scrollTo(target) {
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - 80;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        const duration = Math.min(Math.abs(distance) * 0.5, 1200);
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Smooth easing
            const eased = 1 - Math.pow(1 - progress, 4);

            window.scrollTo(0, startPosition + distance * eased);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }
}

// ========================================
// PARALLAX WITH SMOOTH LERP
// ========================================
class ParallaxScroll {
    constructor() {
        this.elements = [];
        this.scrollY = 0;
        this.currentScrollY = 0;
        this.init();
    }

    init() {
        this.elements = document.querySelectorAll('[data-parallax]');
        if (this.elements.length === 0) return;

        window.addEventListener('scroll', () => {
            this.scrollY = window.scrollY;
        }, { passive: true });

        this.animate();
    }

    animate() {
        // Smooth scroll position
        this.currentScrollY = lerpValue(this.currentScrollY, this.scrollY, 0.1);

        this.elements.forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.5;
            const offset = this.currentScrollY * speed;
            el.style.transform = `translate3d(0, ${offset}px, 0)`;
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// 3D CARD TILT WITH SPRING PHYSICS
// ========================================
class CardEffects {
    constructor() {
        this.cards = [];
        this.init();
    }

    init() {
        document.querySelectorAll('.glass-card, .product-card, .feature-card, .portal, .benefit-card, .team-card').forEach(card => {
            const state = {
                rotateX: new Spring(0.08, 0.75),
                rotateY: new Spring(0.08, 0.75),
                scale: new Spring(0.1, 0.8),
                glowX: 0,
                glowY: 0
            };

            state.scale.value = 1;
            state.scale.target = 1;

            this.cards.push({ card, state });

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                state.rotateX.set((y - centerY) / 15);
                state.rotateY.set((centerX - x) / 15);
                state.scale.set(1.03);

                // Glow position
                state.glowX = (x / rect.width) * 100;
                state.glowY = (y / rect.height) * 100;
            });

            card.addEventListener('mouseleave', () => {
                state.rotateX.set(0);
                state.rotateY.set(0);
                state.scale.set(1);
            });
        });

        this.animate();
    }

    animate() {
        this.cards.forEach(({ card, state }) => {
            const rotateX = state.rotateX.update();
            const rotateY = state.rotateY.update();
            const scale = state.scale.update();

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
            card.style.setProperty('--glow-x', `${state.glowX}%`);
            card.style.setProperty('--glow-y', `${state.glowY}%`);
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// FLOATING ANIMATION FOR ICONS
// ========================================
class FloatingElements {
    constructor() {
        this.init();
    }

    init() {
        const elements = document.querySelectorAll('.portal-icon, .step-icon, .benefit-icon, .value-icon');

        elements.forEach((el, i) => {
            el.style.animation = `float ${3 + Math.random() * 2}s ease-in-out infinite`;
            el.style.animationDelay = `${i * 0.2}s`;
        });
    }
}

// ========================================
// SMOOTH NUMBER COUNTER
// ========================================
class CounterAnimation {
    constructor() {
        this.init();
    }

    init() {
        const counters = document.querySelectorAll('[data-target]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animate(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    animate(element) {
        const target = parseInt(element.dataset.target);
        const suffix = element.textContent.replace(/[0-9,]/g, '');
        const duration = 2500;
        const start = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            // Smoother easeOutQuint
            const eased = 1 - Math.pow(1 - progress, 5);

            element.textContent = Math.floor(target * eased).toLocaleString() + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    }
}

// ========================================
// HOVER GLOW EFFECT
// ========================================
class HoverGlow {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('.glow-btn, .add-cart-btn, .auth-btn').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                btn.style.setProperty('--glow-x', `${x}%`);
                btn.style.setProperty('--glow-y', `${y}%`);
            });
        });
    }
}

// ========================================
// TEXT REVEAL ANIMATION
// ========================================
class TextReveal {
    constructor() {
        this.init();
    }

    init() {
        const headings = document.querySelectorAll('.hero-title, .section-title, .page-title');

        headings.forEach(heading => {
            const text = heading.innerHTML;
            heading.innerHTML = `<span class="text-reveal-inner">${text}</span>`;
        });
    }
}

// ========================================
// INITIALIZE ALL ENHANCEMENTS
// ========================================
function initEnhancements() {
    new PageTransitions();
    new ScrollReveal();
    new SmoothScroll();
    new ParallaxScroll();
    new CardEffects();
    new FloatingElements();
    new CounterAnimation();
    new HoverGlow();
    new TextReveal();

    // Add CSS for new animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        .reveal-hidden {
            opacity: 0;
            transform: translateY(30px) scale(0.98);
        }

        .reveal-visible {
            opacity: 1;
            transform: translateY(0) scale(1);
            transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                        transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            transition-delay: var(--reveal-delay, 0s);
        }

        .page-leaving {
            pointer-events: none;
        }

        .page-leaving * {
            transition: opacity 0.3s ease-out !important;
        }

        .transition-progress {
            position: absolute;
            bottom: 30%;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 3px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
            overflow: hidden;
        }

        .transition-progress::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 0;
            background: var(--gradient-primary);
            border-radius: 3px;
            transition: width 0.1s ease-out;
        }

        .text-reveal-inner {
            display: inline-block;
            animation: textReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes textReveal {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    console.log('✨ Enhanced UI effects loaded');
}

// Auto-init when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEnhancements);
} else {
    initEnhancements();
}
