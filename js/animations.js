// ========================================
// SHREYA PHARMACY - ANIMATIONS (GSAP) v2.0
// Enhanced with smoother easing and better effects
// ========================================

function initAnimations() {
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded');
        return;
    }

    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Smoother default easing
    gsap.defaults({
        ease: 'power3.out',
        duration: 0.8
    });

    // Navbar scroll effect with smooth transition
    let lastScroll = 0;
    let scrollTimeout;

    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        const currentScroll = window.scrollY;

        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Smooth hide/show with debounce
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (currentScroll > lastScroll && currentScroll > 500) {
                gsap.to(navbar, { y: '-100%', duration: 0.4, ease: 'power2.inOut' });
            } else {
                gsap.to(navbar, { y: '0%', duration: 0.4, ease: 'power2.out' });
            }
            lastScroll = currentScroll;
        }, 50);
    });

    // Hero elements staggered entrance
    const heroTimeline = gsap.timeline({ delay: 0.3 });

    heroTimeline
        .from('.hero-badge', { y: 30, opacity: 0, duration: 0.6 })
        .from('.hero-title', { y: 40, opacity: 0, duration: 0.8 }, '-=0.3')
        .from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.6 }, '-=0.4')
        .from('.hero-cta', { y: 20, opacity: 0, scale: 0.95, duration: 0.5 }, '-=0.3');

    // Parallax layers with smoother calculation
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    if (parallaxLayers.length > 0) {
        gsap.to(parallaxLayers, {
            y: (i, el) => -parseFloat(el.dataset.speed || (i + 1) * 50),
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.5
            }
        });
    }

    // Section headers with smooth reveal
    gsap.utils.toArray('.section-header').forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 60,
            opacity: 0,
            duration: 1,
            ease: 'power4.out'
        });
    });

    // Feature cards with stagger (step-card excluded - animated by CSS)
    ScrollTrigger.batch('.feature-card, .benefit-card', {
        onEnter: batch => {
            gsap.from(batch, {
                y: 60,
                opacity: 0,
                scale: 0.95,
                stagger: 0.12,
                duration: 0.8,
                ease: 'back.out(1.2)'
            });
        },
        start: 'top 88%'
    });

    // Product cards with smoother stagger
    ScrollTrigger.batch('.product-card', {
        onEnter: batch => {
            gsap.from(batch, {
                y: 50,
                opacity: 0,
                scale: 0.92,
                stagger: 0.08,
                duration: 0.7,
                ease: 'power3.out'
            });
        },
        start: 'top 90%'
    });

    // Portal hover effects with smooth spring-like animation
    const portals = document.querySelectorAll('.portal');
    portals.forEach(portal => {
        const icon = portal.querySelector('.portal-icon');

        portal.addEventListener('mouseenter', () => {
            gsap.to(portal, {
                scale: 1.03,
                duration: 0.4,
                ease: 'elastic.out(1, 0.5)'
            });
            if (icon) {
                gsap.to(icon, {
                    y: -8,
                    rotation: 5,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        });

        portal.addEventListener('mouseleave', () => {
            gsap.to(portal, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
            if (icon) {
                gsap.to(icon, {
                    y: 0,
                    rotation: 0,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            }
        });
    });

    // Steps connector animation with draw effect
    gsap.utils.toArray('.step-connector').forEach(connector => {
        gsap.from(connector, {
            scrollTrigger: {
                trigger: connector,
                start: 'top 80%'
            },
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 1,
            ease: 'power2.inOut'
        });
    });

    // Testimonial cards entrance
    gsap.utils.toArray('.testimonial-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            },
            y: 40,
            opacity: 0,
            duration: 0.7,
            delay: i * 0.1,
            ease: 'power3.out'
        });
    });

    // Aurora wave continuous rotation
    gsap.to('.aurora-wave', {
        rotation: 360,
        duration: 40,
        ease: 'none',
        repeat: -1,
        transformOrigin: 'center center'
    });

    // Floating animation for decorative elements
    gsap.utils.toArray('.floating').forEach((el, i) => {
        gsap.to(el, {
            y: 15,
            duration: 2 + i * 0.3,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true
        });
    });
}

// Testimonial Carousel
class TestimonialCarousel {
    constructor() {
        this.track = document.querySelector('.testimonial-track');
        this.cards = document.querySelectorAll('.testimonial-card');
        this.dots = document.querySelectorAll('.carousel-dots .dot');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');

        if (!this.track || this.cards.length === 0) return;

        this.currentIndex = 0;
        this.cardWidth = this.cards[0].offsetWidth + 32; // Including gap

        this.bindEvents();
        this.startAutoplay();
    }

    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }

        this.dots.forEach((dot, i) => {
            dot.addEventListener('click', () => this.goTo(i));
        });
    }

    prev() {
        this.currentIndex = Math.max(0, this.currentIndex - 1);
        this.update();
    }

    next() {
        this.currentIndex = Math.min(this.cards.length - 1, this.currentIndex + 1);
        this.update();
    }

    goTo(index) {
        this.currentIndex = index;
        this.update();
    }

    update() {
        const offset = -this.currentIndex * this.cardWidth;
        this.track.style.transform = `translateX(${offset}px)`;

        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentIndex);
        });
    }

    startAutoplay() {
        setInterval(() => {
            this.currentIndex = (this.currentIndex + 1) % this.cards.length;
            this.update();
        }, 5000);
    }
}

// Smooth scroll for nav links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Active nav link on scroll
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

window.initAnimations = initAnimations;
window.TestimonialCarousel = TestimonialCarousel;
window.initSmoothScroll = initSmoothScroll;
window.initActiveNav = initActiveNav;
