// ==================== DYNAMIC FOOTER YEAR ====================
document.addEventListener('DOMContentLoaded', function () {
    const currentYear = new Date().getFullYear();
    const copyrightElement = document.getElementById('copyright-year');
    if (copyrightElement) {
        copyrightElement.textContent = currentYear;
    }
});

// ==================== AOS INITIALIZATION ====================
window.addEventListener('load', function () {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: false,
        mirror: true,
        offset: 100
    });
});

// ==================== CERTIFICATE MODAL ====================
const certModal = document.getElementById('certModal');
const certModalClose = document.getElementById('certModalClose');
const certImage = document.getElementById('certImage');
const achievementBadges = document.querySelectorAll('.achievement-badge[data-cert]');

// Open modal on achievement badge click
achievementBadges.forEach(badge => {
    badge.addEventListener('click', function () {
        const certFile = this.getAttribute('data-cert');
        const certName = this.textContent.trim();

        // Determine file type based on extension
        const fileExt = certFile.split('.').pop().toLowerCase();
        const isMobile = window.innerWidth <= 768;

        // Show modal with image or download for PDF
        if (fileExt === 'pdf' && !isMobile) {
            // Try to display PDF
            certImage.src = `certs/${certFile}`;
            certImage.alt = certName;
        } else if (fileExt === 'pdf') {
            // On mobile, download PDF instead
            window.open(`certs/${certFile}`, '_blank');
            return;
        } else {
            // For images (jpg, png)
            certImage.src = `certs/${certFile}`;
            certImage.alt = certName;
        }

        // Update modal title
        document.getElementById('certModalTitle').textContent = certName;

        // Show modal
        certModal.classList.add('show');
        certModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    });

    // Add keyboard support
    badge.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
});

// Close modal on close button click
certModalClose.addEventListener('click', closeCertModal);

// Close modal on outside click
certModal.addEventListener('click', function (e) {
    if (e.target === certModal) {
        closeCertModal();
    }
});

// Close modal on escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && certModal.classList.contains('show')) {
        closeCertModal();
    }
});

function closeCertModal() {
    certModal.classList.remove('show');
    certModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
}

// ==================== THEME TOGGLE ====================
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);
// Set initial ARIA state
themeToggle.setAttribute('aria-checked', currentTheme === 'dark' ? 'true' : 'false');

themeToggle.addEventListener('click', () => {
    const theme = htmlElement.getAttribute('data-theme');
    const newTheme = theme === 'light' ? 'dark' : 'light';

    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);

    // Update ARIA state
    themeToggle.setAttribute('aria-checked', newTheme === 'dark' ? 'true' : 'false');
});

// ==================== SMOOTH SCROLL & ACTIVE LINK ====================
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

// Smooth scroll for nav links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            // Adjust offset for sticky navbar
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetSection.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Update active link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const navHeight = document.querySelector('.navbar').offsetHeight;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollY >= sectionTop - navHeight - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ==================== INTERSECTION OBSERVER FOR ANIMATIONS ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all major elements for fade-in animation
document.querySelectorAll('section, .experience-item, .cert-card, .skill-category, .stat-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ==================== NAVBAR SCROLL EFFECT ====================
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add subtle shadow on scroll
    if (scrollTop > 50) {
        navbar.style.boxShadow = 'var(--shadow)';
    } else {
        navbar.style.boxShadow = 'none';
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ==================== DYNAMIC CODE SNIPPETS ====================
const codeSnippets = [
    'const buildScalable = () => { return "microservices"; }',
    'function* eventSourcing() { yield transactions; }',
    'class DomainModel { architect(); }',
    'await kafka.stream().process();',
    'SELECT * FROM distributed_systems;',
    'interface HighPerformance { optimize(); }',
    'async function handleEvents() { replay(); }',
    'const architecture = new CQRS().design();',
    'db.optimize(indexes, caching);'
];

// Generate random code snippets for background
function generateCodeBackground() {
    const background = document.querySelector('.code-background');
    const snippets = background.querySelectorAll('.code-snippet');

    snippets.forEach((snippet, index) => {
        snippet.textContent = codeSnippets[index % codeSnippets.length];
    });
}

generateCodeBackground();

// ==================== FLOATING CARD INTERACTION ====================
const floatingCards = document.querySelectorAll('.floating-card');

floatingCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.6)';
        card.style.transform = 'scale(1.1)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = 'none';
        card.style.transform = 'scale(1)';
    });
});

// ==================== PARALLAX EFFECT FOR CODE BACKGROUND ====================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const codeSnippets = document.querySelectorAll('.code-snippet');

    codeSnippets.forEach((snippet, index) => {
        const speed = 0.5 + (index * 0.1);
        snippet.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ==================== SKILL CARDS HOVER EFFECT ====================
const skillTags = document.querySelectorAll('.skill-tag');

skillTags.forEach(tag => {
    tag.addEventListener('mouseenter', () => {
        // Animate all tags
        skillTags.forEach(t => {
            if (t !== tag) {
                t.style.opacity = '0.5';
                t.style.transform = 'scale(0.95)';
            }
        });
        tag.style.transform = 'scale(1.05)';
        tag.style.opacity = '1';
    });

    tag.addEventListener('mouseleave', () => {
        skillTags.forEach(t => {
            t.style.opacity = '1';
            t.style.transform = 'scale(1)';
        });
    });
});

// ==================== FORM VALIDATION & SUBMISSION ====================
const contactLinks = document.querySelectorAll('.contact-link');

contactLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // Allow default behavior (opening email/phone)
        // Add a subtle animation
        link.style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
            link.style.animation = '';
        }, 500);
    });
});

// Add pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: translateY(-5px);
        }
        50% {
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ==================== EXPERIENCE TIMELINE ANIMATION ====================
const experienceItems = document.querySelectorAll('.experience-item');

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Stagger animation for each item
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.1 });

experienceItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = `opacity 0.6s ease, transform 0.6s ease`;
    timelineObserver.observe(item);
});

// ==================== BUTTON RIPPLE EFFECT ====================
const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        // Create ripple style if not exists
        if (!document.querySelector('style[data-ripple]')) {
            const rippleStyle = document.createElement('style');
            rippleStyle.setAttribute('data-ripple', '');
            rippleStyle.textContent = `
                .btn {
                    position: relative;
                    overflow: hidden;
                }
                .ripple {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transform: scale(0);
                    animation: ripple-animation 0.6s ease-out;
                    pointer-events: none;
                }
                @keyframes ripple-animation {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(rippleStyle);
        }

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// ==================== PERFORMANCE OPTIMIZATION ====================
// Lazy load images and defer heavy animations
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==================== KEYBOARD NAVIGATION ====================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Could close modals or popovers if added
    }

    // Quick navigation with keyboard
    if (e.ctrlKey || e.metaKey) {
        const keyMap = {
            'h': '#home',
            'a': '#about',
            's': '#skills',
            'e': '#experience',
            'c': '#contact'
        };

        if (keyMap[e.key]) {
            e.preventDefault();
            const target = document.querySelector(keyMap[e.key]);
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                window.scrollTo({
                    top: target.offsetTop - navHeight,
                    behavior: 'smooth'
                });
            }
        }
    }
});

// ==================== MOBILE MENU CLOSE ON CLICK ====================
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // If there's a mobile menu, close it
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });
});

// ==================== PAGE LOAD ANIMATIONS ====================
window.addEventListener('load', () => {
    // Trigger animations after page load
    document.querySelectorAll('[data-animate]').forEach(el => {
        el.style.animation = 'fadeIn 0.6s ease forwards';
    });
});

// Add page load animation style
const loadStyle = document.createElement('style');
loadStyle.textContent = `
    @keyframes fadeIn {
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
document.head.appendChild(loadStyle);

// ==================== ACCESSIBILITY IMPROVEMENTS ====================
// Add focus visible for keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// Add keyboard nav styles
const a11yStyle = document.createElement('style');
a11yStyle.textContent = `
    body.keyboard-nav *:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
    }
`;
document.head.appendChild(a11yStyle);

// ==================== CONSOLE EASTER EGG ====================
console.log('%c🚀 Welcome to Hai Nguyen Thai\'s Portfolio!', 'color: #00ff88; font-size: 20px; font-weight: bold; text-shadow: 0 0 20px #00ff88;');
console.log('%cLet\'s build something amazing together!', 'color: #00ff88; font-size: 14px;');
console.log('%cFeel free to explore the code and reach out at nguyenthaihai00@gmail.com', 'color: #00ff88; font-size: 12px;');
