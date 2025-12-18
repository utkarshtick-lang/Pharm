// ========================================
// SHREYA PHARMACY - ELEGANT EFFECTS v2.1
// PERFORMANCE OPTIMIZED for smooth 60fps
// ========================================

const lerp = (start, end, factor) => start + (end - start) * factor;

// Performance check
const isLowPerfDevice = () => {
    return navigator.hardwareConcurrency <= 4 ||
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

// ========================================
// INSTANT CURSOR GLOW (Optimized)
// ========================================
class CursorGlow {
    constructor() {
        this.canvas = document.getElementById('cursor-trail');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d', { alpha: true });
        this.mouse = { x: -100, y: -100 };
        this.resize();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    bindEvents() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.resize(), 100);
        });
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        }, { passive: true });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const gradient = this.ctx.createRadialGradient(
            this.mouse.x, this.mouse.y, 0,
            this.mouse.x, this.mouse.y, 150
        );
        gradient.addColorStop(0, 'rgba(196, 167, 125, 0.15)');
        gradient.addColorStop(0.5, 'rgba(196, 167, 125, 0.05)');
        gradient.addColorStop(1, 'rgba(196, 167, 125, 0)');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// OPTIMIZED BACKGROUND
// ========================================
class ElegantBackground {
    constructor() {
        this.canvas = document.getElementById('particle-bg');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d', { alpha: true });
        this.lowPerf = isLowPerfDevice();
        this.orbs = [];
        this.stars = [];
        this.shootingStars = [];
        this.wavePoints = [];
        this.ripples = [];
        this.time = 0;
        this.lastShootingStar = 0;
        this.mouse = { x: -1000, y: -1000 };

        this.resize();
        this.init();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        // Fewer orbs for performance
        const orbCount = this.lowPerf ? 4 : 5;
        this.orbs = [];
        for (let i = 0; i < orbCount; i++) {
            this.orbs.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: 200 + Math.random() * 300,
                speedX: (Math.random() - 0.5) * 0.2,
                speedY: (Math.random() - 0.5) * 0.2,
                baseOpacity: 0.03 + Math.random() * 0.02,
                hue: 30 + Math.random() * 20,
                saturation: 35 + Math.random() * 15,
                pulseSpeed: 0.2 + Math.random() * 0.3,
                pulseOffset: Math.random() * Math.PI * 2
            });
        }

        // Fewer stars
        const starCount = this.lowPerf ? 10 : 15;
        this.stars = [];
        for (let i = 0; i < starCount; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: 1 + Math.random() * 1.5,
                twinkleSpeed: 0.3 + Math.random() * 0.5,
                twinkleOffset: Math.random() * Math.PI * 2
            });
        }

        // Simpler aurora waves
        const waveCount = this.lowPerf ? 2 : 3;
        this.wavePoints = [];
        for (let w = 0; w < waveCount; w++) {
            const points = [];
            for (let i = 0; i <= 8; i++) {
                points.push({
                    x: (this.canvas.width / 8) * i,
                    baseY: this.canvas.height * (0.3 + w * 0.15),
                    amplitude: 30 + Math.random() * 40,
                    speed: 0.2 + Math.random() * 0.3,
                    offset: Math.random() * Math.PI * 2
                });
            }
            this.wavePoints.push({ points, opacity: 0.02 + w * 0.01, hue: 35 + w * 5 });
        }
    }

    bindEvents() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => { this.resize(); this.init(); }, 100);
        });
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        }, { passive: true });
        window.addEventListener('click', (e) => {
            if (this.ripples.length < 3) {
                this.ripples.push({ x: e.clientX, y: e.clientY, radius: 0, opacity: 0.3, speed: 5 });
            }
        }, { passive: true });
    }

    drawRipples() {
        this.ripples = this.ripples.filter(r => {
            r.radius += r.speed;
            r.opacity -= 0.01;
            if (r.opacity <= 0) return false;
            this.ctx.beginPath();
            this.ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(196, 167, 125, ${r.opacity})`;
            this.ctx.lineWidth = 1.5;
            this.ctx.stroke();
            return true;
        });
    }

    drawAuroraWaves() {
        this.wavePoints.forEach(wave => {
            this.ctx.beginPath();
            const pts = wave.points.map(p => ({
                x: p.x,
                y: p.baseY + Math.sin(this.time * p.speed + p.offset) * p.amplitude
            }));
            this.ctx.moveTo(pts[0].x, pts[0].y);
            for (let i = 1; i < pts.length - 1; i++) {
                const xc = (pts[i].x + pts[i + 1].x) / 2;
                const yc = (pts[i].y + pts[i + 1].y) / 2;
                this.ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
            }
            this.ctx.lineTo(this.canvas.width, this.canvas.height);
            this.ctx.lineTo(0, this.canvas.height);
            this.ctx.closePath();
            const grad = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
            grad.addColorStop(0, `hsla(${wave.hue}, 40%, 60%, ${wave.opacity})`);
            grad.addColorStop(0.5, `hsla(${wave.hue}, 35%, 50%, ${wave.opacity * 0.5})`);
            grad.addColorStop(1, 'transparent');
            this.ctx.fillStyle = grad;
            this.ctx.fill();
        });
    }

    drawStars() {
        this.stars.forEach(star => {
            const twinkle = Math.sin(this.time * star.twinkleSpeed + star.twinkleOffset);
            const opacity = 0.4 + twinkle * 0.4;

            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 250, 240, ${opacity})`;
            this.ctx.fill();
        });
    }

    spawnShootingStar() {
        if (this.shootingStars.length < 2 && this.time - this.lastShootingStar > 4) {
            this.lastShootingStar = this.time;
            this.shootingStars.push({
                x: Math.random() * this.canvas.width * 0.6,
                y: Math.random() * this.canvas.height * 0.3,
                length: 80 + Math.random() * 100,
                speed: 12 + Math.random() * 6,
                angle: Math.PI / 4,
                opacity: 0.7,
                life: 1
            });
        }
    }

    drawShootingStars() {
        this.shootingStars = this.shootingStars.filter(s => {
            s.x += Math.cos(s.angle) * s.speed;
            s.y += Math.sin(s.angle) * s.speed;
            s.life -= 0.015;
            if (s.life <= 0 || s.x > this.canvas.width) return false;

            const tailX = s.x - Math.cos(s.angle) * s.length * s.life;
            const tailY = s.y - Math.sin(s.angle) * s.length * s.life;
            const grad = this.ctx.createLinearGradient(tailX, tailY, s.x, s.y);
            grad.addColorStop(0, 'rgba(196, 167, 125, 0)');
            grad.addColorStop(1, `rgba(255, 250, 240, ${s.opacity * s.life})`);
            this.ctx.beginPath();
            this.ctx.moveTo(tailX, tailY);
            this.ctx.lineTo(s.x, s.y);
            this.ctx.strokeStyle = grad;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            return true;
        });
    }

    animate() {
        this.time += 0.016;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Layer 1: Aurora waves
        this.drawAuroraWaves();

        // Layer 2: Orbs (simplified - no mouse interaction for performance)
        this.orbs.forEach(orb => {
            orb.x += orb.speedX;
            orb.y += orb.speedY;

            if (orb.x < -orb.radius) orb.x = this.canvas.width + orb.radius;
            if (orb.x > this.canvas.width + orb.radius) orb.x = -orb.radius;
            if (orb.y < -orb.radius) orb.y = this.canvas.height + orb.radius;
            if (orb.y > this.canvas.height + orb.radius) orb.y = -orb.radius;

            const pulse = Math.sin(this.time * orb.pulseSpeed + orb.pulseOffset);
            const opacity = orb.baseOpacity + pulse * 0.01;

            const grad = this.ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
            grad.addColorStop(0, `hsla(${orb.hue}, ${orb.saturation}%, 70%, ${opacity})`);
            grad.addColorStop(0.5, `hsla(${orb.hue}, ${orb.saturation}%, 60%, ${opacity * 0.5})`);
            grad.addColorStop(1, 'transparent');

            this.ctx.beginPath();
            this.ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = grad;
            this.ctx.fill();
        });

        // Layer 3: Stars
        this.drawStars();

        // Layer 4: Ripples
        this.drawRipples();

        // Layer 5: Shooting stars
        this.spawnShootingStar();
        this.drawShootingStars();

        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// MAGNETIC BUTTONS (Optimized)
// ========================================
class MagneticButtons {
    constructor() {
        this.buttons = document.querySelectorAll('.magnetic-btn');
        this.buttons.forEach(btn => this.init(btn));
    }

    init(btn) {
        let targetX = 0, targetY = 0;

        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            targetX = (e.clientX - rect.left - rect.width / 2) * 0.15;
            targetY = (e.clientY - rect.top - rect.height / 2) * 0.15;
            btn.style.transform = `translate(${targetX}px, ${targetY}px)`;
        }, { passive: true });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        }, { passive: true });
    }
}

// ========================================
// SCROLL PROGRESS (Optimized)
// ========================================
class ScrollProgress {
    constructor() {
        this.progressBar = document.querySelector('.scroll-progress-bar');
        if (!this.progressBar) return;

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                    const progress = (window.scrollY / scrollHeight) * 100;
                    this.progressBar.style.width = `${progress}%`;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
}

// ========================================
// BACK TO TOP (Optimized)
// ========================================
class BackToTop {
    constructor() {
        this.btn = document.getElementById('back-to-top');
        if (!this.btn) return;

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const visible = window.scrollY > 500;
                    this.btn.style.opacity = visible ? '1' : '0';
                    this.btn.style.pointerEvents = visible ? 'auto' : 'none';
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        this.btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// ========================================
// COUNTER ANIMATION
// ========================================
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.observed = new Set();
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.observed.has(entry.target)) {
                    this.observed.add(entry.target);
                    this.animate(entry.target);
                }
            });
        }, { threshold: 0.5 });
        this.counters.forEach(counter => observer.observe(counter));
    }

    animate(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const start = performance.now();
        const update = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            element.textContent = Math.floor(target * eased).toLocaleString();
            if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    }
}

// ========================================
// TEXT SCRAMBLE EFFECT
// ========================================
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise(resolve => this.resolve = resolve);
        this.queue = [];

        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 30);
            const end = start + Math.floor(Math.random() * 30);
            this.queue.push({ from, to, start, end });
        }

        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;

        for (let i = 0; i < this.queue.length; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.3) {
                    char = this.chars[Math.floor(Math.random() * this.chars.length)];
                    this.queue[i].char = char;
                }
                output += `<span class="scramble-char">${char}</span>`;
            } else {
                output += from;
            }
        }

        this.el.innerHTML = output;
        if (complete === this.queue.length) this.resolve();
        else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
}

// ========================================
// INITIALIZE
// ========================================
function initEffects() {
    new CursorGlow();
    new ElegantBackground();
    new MagneticButtons();
    new ScrollProgress();
    new BackToTop();
    new CounterAnimation();

    const heroTitle = document.querySelector('.hero-title .gradient-text');
    if (heroTitle) {
        const scrambler = new TextScramble(heroTitle);
        const originalText = heroTitle.innerText;
        heroTitle.addEventListener('mouseenter', () => scrambler.setText(originalText));
    }
}

window.initEffects = initEffects;
window.TextScramble = TextScramble;
window.lerp = lerp;
