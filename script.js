// ============================================================================
// THEME MANAGEMENT
// ============================================================================

class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.html = document.documentElement;
        this.init();
    }

    init() {
        // Check for saved theme preference or default to 'light'
        const savedTheme = localStorage.getItem('theme') ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

        this.setTheme(savedTheme);
        this.themeToggle.addEventListener('click', (e) => this.toggleTheme(e));

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            this.setTheme(e.matches ? 'dark' : 'light');
        });
    }

    toggleTheme(e) {
        e.preventDefault();
        const currentTheme = this.html.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        this.html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }
}

// ============================================================================
// NAVIGATION
// ============================================================================

class Navigation {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.hamburger.addEventListener('click', () => this.toggleMenu());
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    }

    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
    }
}

// ============================================================================
// SMOOTH SCROLLING & ACTIVE LINK HIGHLIGHTING
// ============================================================================

class SmoothScroll {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        this.init();
    }

    init() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offsetTop = target.offsetTop - 70;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });

        // Update active link on scroll
        window.addEventListener('scroll', () => this.updateActiveLink());
    }

    updateActiveLink() {
        let current = '';

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}

// ============================================================================
// CONTACT FORM HANDLING
// ============================================================================

class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        // Validate form
        if (!this.validateForm(data)) {
            return;
        }

        // Show loading state
        const button = this.form.querySelector('button');
        const originalText = button.textContent;
        button.textContent = 'Sending...';
        button.disabled = true;

        // Simulate form submission (replace with actual backend)
        setTimeout(() => {
            this.showSuccess();
            this.form.reset();
            button.textContent = originalText;
            button.disabled = false;
        }, 1500);
    }

    validateForm(data) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!data.name.trim()) {
            this.showError('Please enter your name');
            return false;
        }

        if (!emailRegex.test(data.email)) {
            this.showError('Please enter a valid email');
            return false;
        }

        if (!data.subject.trim()) {
            this.showError('Please enter a subject');
            return false;
        }

        if (!data.message.trim()) {
            this.showError('Please enter a message');
            return false;
        }

        return true;
    }

    showSuccess() {
        const message = document.createElement('div');
        message.className = 'form-message success';
        message.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
        message.style.cssText = `
            padding: 1rem;
            background-color: rgba(16, 185, 129, 0.1);
            color: #10b981;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            animation: slideIn 0.3s ease-out;
        `;
        this.form.insertBefore(message, this.form.firstChild);

        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }

    showError(text) {
        const message = document.createElement('div');
        message.className = 'form-message error';
        message.textContent = `✗ ${text}`;
        message.style.cssText = `
            padding: 1rem;
            background-color: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            animation: slideIn 0.3s ease-out;
        `;

        const existingMessage = this.form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        this.form.insertBefore(message, this.form.firstChild);

        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }
}

// ============================================================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================================================

class AnimationObserver {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        // Observe project cards, skill items, etc.
        document.querySelectorAll('.project-card, .skill-category, .education-card, .experience-item, .testimonial-card').forEach(el => {
            observer.observe(el);
        });
    }

    animateElement(element) {
        element.style.animation = 'fadeInUp 0.6s ease-out forwards';
    }
}

// ============================================================================
// SKILL PROGRESS BARS ANIMATION
// ============================================================================

class SkillProgressAnimator {
    constructor() {
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateProgressBars();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        const skillsSection = document.getElementById('skills');
        if (skillsSection) {
            observer.observe(skillsSection);
        }
    }

    animateProgressBars() {
        this.skillBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';

            setTimeout(() => {
                bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                bar.style.width = width;
            }, 100);
        });
    }
}

// ============================================================================
// SCROLL TO TOP BUTTON
// ============================================================================

class ScrollToTop {
    constructor() {
        this.scrollLinks = document.querySelectorAll('.scroll-to-top');
        this.init();
    }

    init() {
        this.scrollLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        });
    }
}

// ============================================================================
// LAZY LOADING FOR IMAGES
// ============================================================================

class LazyLoader {
    constructor() {
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
}

// ============================================================================
// KEYBOARD NAVIGATION
// ============================================================================

class KeyboardNavigation {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            // ESC to close mobile menu
            if (e.key === 'Escape') {
                const nav = document.querySelector('.nav-menu');
                if (nav) {
                    nav.classList.remove('active');
                    document.querySelector('.hamburger').classList.remove('active');
                }
            }

            // Keyboard shortcuts for quick navigation
            if (e.ctrlKey || e.metaKey) {
                if (e.key === '/') {
                    e.preventDefault();
                    document.getElementById('search')?.focus();
                }
            }
        });
    }
}

// ============================================================================
// COPY EMAIL TO CLIPBOARD
// ============================================================================

class CopyToClipboard {
    constructor() {
        this.init();
    }

    init() {
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');

        emailLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Allow normal email client opening, but can be modified for clipboard
                // e.preventDefault();
                // const email = link.href.replace('mailto:', '');
                // this.copyToClipboard(email);
            });
        });
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copied to clipboard: ' + text);
        });
    }
}

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        if (window.performance && window.performance.timing) {
            window.addEventListener('load', () => {
                this.logPerformanceMetrics();
            });
        }
    }

    logPerformanceMetrics() {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const connectTime = perfData.responseEnd - perfData.requestStart;
        const renderTime = perfData.domComplete - perfData.domLoading;

        console.log('Performance Metrics:', {
            pageLoadTime: pageLoadTime + 'ms',
            connectTime: connectTime + 'ms',
            renderTime: renderTime + 'ms'
        });
    }
}

// ============================================================================
// DOCUMENT READY INITIALIZATION
// ============================================================================

function initializeApp() {
    // Check if DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}

function init() {
    // Initialize all modules
    new ThemeManager();
    new Navigation();
    new SmoothScroll();
    new ContactForm();
    new AnimationObserver();
    new SkillProgressAnimator();
    new ScrollToTop();
    new LazyLoader();
    new KeyboardNavigation();
    new CopyToClipboard();
    new PerformanceMonitor();

    console.log('Portfolio website initialized successfully');
}

// Start initialization
initializeApp();

// ============================================================================
// ADD CUSTOM ANIMATIONS TO STYLESHEET
// ============================================================================

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }

    .nav-link.active {
        color: var(--color-primary);
        font-weight: 600;
    }
`;
document.head.appendChild(style);

// ============================================================================
// HELPER FUNCTION FOR DEBUGGING (Can be disabled in production)
// ============================================================================

window.PortfolioDebug = {
    getTheme: () => document.documentElement.getAttribute('data-theme'),
    setTheme: (theme) => document.documentElement.setAttribute('data-theme', theme),
    toggleTheme: () => {
        const current = window.PortfolioDebug.getTheme() || 'light';
        window.PortfolioDebug.setTheme(current === 'light' ? 'dark' : 'light');
    },
    getPerformance: () => {
        if (window.performance && window.performance.timing) {
            const perfData = window.performance.timing;
            return {
                pageLoadTime: perfData.loadEventEnd - perfData.navigationStart,
                connectTime: perfData.responseEnd - perfData.requestStart,
                renderTime: perfData.domComplete - perfData.domLoading
            };
        }
        return null;
    }
};

console.log('📚 Portfolio Debug Tools Available: window.PortfolioDebug');
