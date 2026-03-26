// ==================== HAMBURGER MENU ====================
document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu when hamburger is clicked
    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active'));
    });

    // Close menu when a nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
        const isClickInsideNav = event.target.closest('.navbar');
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
});

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
const certVerifyLink = document.getElementById('certVerifyLink');
const certModalIcon = document.getElementById('certModalIcon');
const certModalIssuer = document.getElementById('certModalIssuer');
const achievementBadges = document.querySelectorAll('.achievement-badge[data-cert]');
const certificationCards = document.querySelectorAll('.cert-card[data-cert-verify]');
const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
].join(', ');

let activeModal = null;
let lastModalTrigger = null;

function getFocusableElements(container) {
    return Array.from(container.querySelectorAll(focusableSelector))
        .filter(el => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true');
}

function openModalDialog(modal, triggerEl, focusEl) {
    lastModalTrigger = triggerEl instanceof HTMLElement ? triggerEl : document.activeElement;
    activeModal = modal;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const nextFocus = focusEl || getFocusableElements(modal)[0] || modal;
    requestAnimationFrame(() => {
        if (nextFocus && typeof nextFocus.focus === 'function') {
            nextFocus.focus();
        }
    });
}

function closeModalDialog(modal, options = {}) {
    const { returnFocus = true } = options;

    if (!modal) return;

    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');

    if (activeModal === modal) {
        activeModal = null;
    }

    document.body.style.overflow = 'auto';

    if (returnFocus && lastModalTrigger instanceof HTMLElement && document.contains(lastModalTrigger)) {
        requestAnimationFrame(() => lastModalTrigger.focus());
    }

    if (returnFocus) {
        lastModalTrigger = null;
    }
}

document.addEventListener('keydown', function (e) {
    if (!activeModal || e.key !== 'Tab') return;

    const focusableElements = getFocusableElements(activeModal);
    if (!focusableElements.length) {
        e.preventDefault();
        return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!activeModal.contains(document.activeElement)) {
        e.preventDefault();
        firstElement.focus();
        return;
    }

    if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
    }
});

// Open modal on achievement badge click (for award badges)
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
        certModalIcon.textContent = '🏆';
        certModalIssuer.textContent = 'Achievement';
        certVerifyLink.style.display = 'none';

        openModalDialog(certModal, this, certModalClose);
    });

    // Add keyboard support
    badge.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
});

// Open modal on certification card click
certificationCards.forEach(card => {
    card.addEventListener('click', function (e) {
        e.preventDefault();
        const certName = this.getAttribute('data-cert-name');
        const certIcon = this.getAttribute('data-cert-icon');
        const certIssuer = this.getAttribute('data-cert-issuer');
        const verifyUrl = this.getAttribute('data-cert-verify');
        const certImageFile = this.getAttribute('data-cert-image');

        // Update modal content
        document.getElementById('certModalTitle').textContent = certName;
        certModalIcon.textContent = certIcon;
        certModalIssuer.textContent = certIssuer;

        // Show/hide image based on whether image file exists
        if (certImageFile) {
            certImage.src = `certs/${certImageFile}`;
            certImage.alt = certName;
            certImage.style.display = 'block';
        } else {
            certImage.style.display = 'none';
        }

        // Show and update verify link
        certVerifyLink.href = verifyUrl;
        certVerifyLink.style.display = 'inline-block';

        openModalDialog(certModal, this, certModalClose);
    });

    // Add keyboard support
    card.addEventListener('keypress', function (e) {
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
    closeModalDialog(certModal);
}

// ==================== THEME TOGGLE ====================
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Always default to dark mode - no localStorage
htmlElement.setAttribute('data-theme', 'dark');
themeToggle.setAttribute('aria-checked', 'true');

themeToggle.addEventListener('click', () => {
    const theme = htmlElement.getAttribute('data-theme');
    const newTheme = theme === 'light' ? 'dark' : 'light';

    htmlElement.setAttribute('data-theme', newTheme);
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
document.querySelectorAll('section, .experience-item, .cert-card, .skill-category').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ==================== NAVBAR SCROLL EFFECT ====================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add subtle shadow on scroll
    if (scrollTop > 50) {
        navbar.style.boxShadow = 'var(--shadow)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});


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
            'p': '#projects',
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
        outline: 2px solid var(--accent);
        outline-offset: 2px;
    }
`;
document.head.appendChild(a11yStyle);

// ==================== PROJECT DEMO BUTTONS ====================
const projectDemoButtons = document.querySelectorAll('.btn-project-demo');
const projectDemoModal = document.getElementById('projectDemoModal');
const projectDemoClose = document.getElementById('projectDemoClose');
const projectDemoVideo = document.getElementById('projectDemoVideo');
const projectDemoTitle = document.getElementById('projectDemoTitle');

projectDemoButtons.forEach(button => {
    button.addEventListener('click', function() {
        openProjectDemo(this);
    });
});

function openProjectDemo(button) {
    const demoType = button.getAttribute('data-demo');
    const videoPath = button.getAttribute('data-video');

    if (videoPath) {
        projectDemoVideo.src = videoPath;
        projectDemoTitle.textContent = button.closest('.project-card').querySelector('.project-title').textContent;
        openModalDialog(projectDemoModal, button, projectDemoClose);

        projectDemoVideo.play().catch(err => {
            console.log('Auto-play prevented:', err);
        });
    } else {
        alert(`Demo for ${demoType} would be displayed here.\n\nYou can replace this with:\n- A modal showing project screenshots\n- An embedded video demo\n- A link to a live demo\n- An interactive project walkthrough`);
    }
}

// Close project demo modal
if (projectDemoClose) {
    projectDemoClose.addEventListener('click', closeProjectDemoModal);
}

// Close modal on outside click
if (projectDemoModal) {
    projectDemoModal.addEventListener('click', function (e) {
        if (e.target === projectDemoModal) {
            closeProjectDemoModal();
        }
    });
}

// Close modal on escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && projectDemoModal && projectDemoModal.classList.contains('show')) {
        closeProjectDemoModal();
    }
});

function closeProjectDemoModal() {
    if (projectDemoModal) {
        closeModalDialog(projectDemoModal);

        // Stop and reset video
        if (projectDemoVideo) {
            projectDemoVideo.pause();
            projectDemoVideo.currentTime = 0;
            projectDemoVideo.src = '';
        }
    }
}

// ==================== PROJECT DETAILS MODAL ====================
const projectsData = {
    'llm-telegram-bot': {
        icon: '🤖',
        title: 'LLM Telegram Bot',
        description: 'An intelligent Telegram chatbot powered by a local LLM running on LM Studio, integrated with the OpenAI API for advanced conversational AI — with a strong focus on privacy by keeping model execution fully local.',
        features: [
            'Conversation Management: /clear (clear history), /history (show summary), /reset (new thread), /export (export chat as file)',
            'Custom Personas: /persona <name> — switch between predefined personas (assistant, coder, teacher, creative writer)',
            'Custom System Prompts: /systemprompt <text> — set a fully custom system prompt with saved user preferences',
            'Streaming Responses: real-time token delivery with a live "typing…" indicator for a natural conversational feel',
            'Privacy-first: local LLM execution via LM Studio keeps sensitive conversations off third-party servers',
        ],
        tags: ['Python', 'OpenAI', 'Telegram Bot API', 'LM Studio', 'LLM', 'Streaming', 'Prompt Engineering'],
        video: 'pet-projects/llm-tegegram-bot/LLM Telegram bot.mov',
        github: null,
    },
    'stock-analysis': {
        icon: '📊',
        title: 'Stock Analysis AI',
        description: 'An intelligent AI chatbot that performs real-time stock market analysis through natural conversation. Demonstrates advanced OpenAI function calling by automatically chaining multiple tool invocations to deliver comprehensive market reports.',
        features: [
            'Stock Symbol Lookup: find ticker symbols for companies by name and country',
            'Current Price Retrieval: get the latest stock price, volume, and key market data',
            'Trend Analysis: historical price trends, moving averages, volatility, momentum, and support/resistance levels',
            'AI Investment Recommendations: actionable buy/hold/sell suggestions based on technical analysis',
            'Interactive Console CLI: prompt-based interface for entering company, country, and analysis period',
            'OpenAI Function Calling: chains tool calls automatically to generate comprehensive, grounded market reports',
        ],
        tags: ['Python', 'OpenAI', 'Function Calling', 'LLM', 'yfinance', 'Pydantic', 'Technical Analysis', 'Yahoo Finance'],
        video: 'pet-projects/stock-ai-analysis/Stock BOT AI.mov',
        github: null,
    },
    'qa-engine': {
        icon: '🧠',
        title: 'Advanced RAG Multi-Source QA System',
        description: 'An intelligent question-answering system that retrieves accurate, grounded answers from multiple sources (Wikipedia, web, files) with adaptive content-aware chunking and built-in quality assurance — including hallucination detection using RAGAS metrics.',
        features: [
            '🔍 INTELLIGENT RETRIEVAL (88% context relevance) — Hybrid search: 70% semantic (sentence-transformers) + 30% keyword (BM25). Smart Chunk Sizing: AI-driven auto-sizing (128–2048 tokens) with 8–12% precision improvement. Parent-Child Hierarchical Chunking: small precise chunks (256 tokens) for retrieval + large context chunks (1024 tokens) for LLM, improving coherence by 15%. Two-stage retrieval: bi-encoder + cross-encoder reranking with MMR diversity filtering (+15–20% precision). HyDE: bridges semantic gap (+15–25% on technical queries).',
            '🧩 ADVANCED REASONING (40% improvement on complex questions) — Multi-hop reasoning: decomposes complex queries into 3 sequential sub-questions, retrieves for each, synthesizes coherent answer. Query expansion: 4-variation expansion (+12–15% coverage). Self-query decomposition: auto-splits multi-aspect questions for focused retrieval. Agentic RAG with ReAct pattern: autonomous agent selects optimal strategy from 10 available actions based on query characteristics.',
            '✅ QUALITY ASSURANCE (85%+ faithfulness) — RAGAS evaluation: context relevance, answer relevance, faithfulness scoring on every query. Hallucination detection: grounding analysis + auto-mitigation with 3-tier risk scoring (LOW / MEDIUM / HIGH). Fact-checking: claim-level verification against retrieved context. Adversarial testing suite: 8 edge-case tests (87% pass rate). Passage highlighting: sentence-level extraction showing which passages support each answer.',
            '🛡️ PRODUCTION SAFETY & OBSERVABILITY — Guardrails: blocks prompt injection, XSS, SQL injection, jailbreak attempts; detects & redacts PII (emails, SSN, credit cards); rate limiting. Observability dashboard: real-time metrics tracking, query logging, HTML reports with visualizations. Async pipeline: parallel batch processing (2–3× speedup for concurrent queries). Full audit trail: persistent conversation history + all metrics to JSON.',
        ],
        tags: ['RAG', 'Semantic Search', 'Keyword Search (BM25)', 'Vector Embeddings & Cosine Similarity', 'ChromaDB', 'Cross-Encoder Reranking', 'Maximal Marginal Relevance (MMR)', 'Hypothetical Document Embeddings (HyDE)', 'Smart Chunk Sizing', 'Parent-Child Hierarchical Chunking', 'Multi-hop Reasoning', 'Query Decomposition', 'Agentic RAG with ReAct Pattern', 'RAGAS Metrics', 'Hallucination Detection', 'Grounding Analysis', 'Fact-Checking & Claim Verification', 'Prompt Injection Detection', 'PII Detection & Redaction', 'Input/Output Guardrails', 'LRU Embedding Cache', 'Async Pipeline', 'Web Scraping', 'PDF Parsing', 'Tokenization (NLTK)', 'Sentence-Transformers'],
        video: null,
        github: '#',
    },
};

const projectDetailsModal    = document.getElementById('projectDetailsModal');
const projectDetailsClose    = document.getElementById('projectDetailsClose');
const projectDetailsCloseBtn = document.getElementById('projectDetailsCloseBtn');
const projectDetailsIcon     = document.getElementById('projectDetailsIcon');
const projectDetailsTitle    = document.getElementById('projectDetailsTitle');
const projectDetailsSummary  = document.getElementById('projectDetailsSummary');

const projectDetailsFeats    = document.getElementById('projectDetailsFeatures');
const projectDetailsTags     = document.getElementById('projectDetailsTags');
const projectDetailsWatchDemo = document.getElementById('projectDetailsWatchDemo');
const projectDetailsGithub   = document.getElementById('projectDetailsGithub');

document.querySelectorAll('.btn-project-details').forEach(btn => {
    btn.addEventListener('click', function () {
        const key  = this.getAttribute('data-project');
        const data = projectsData[key];
        if (!data) return;

        projectDetailsIcon.textContent     = data.icon;
        projectDetailsTitle.textContent    = data.title;
        projectDetailsSummary.textContent  = data.description;


        projectDetailsFeats.innerHTML = data.features.map(f => `<li>${f}</li>`).join('');
        projectDetailsTags.innerHTML  = data.tags.map(t => `<span class="tech-tag">${t}</span>`).join('');

        if (data.video) {
            projectDetailsWatchDemo.style.display = 'inline-flex';
            projectDetailsWatchDemo.onclick = () => {
                closeProjectDetails({ returnFocus: false });
                const demoBtn = document.querySelector(`.btn-project-demo[data-demo="${key}"]`);
                if (demoBtn) openProjectDemo(demoBtn);
            };
        } else {
            projectDetailsWatchDemo.style.display = 'none';
        }

        if (data.github && data.github !== '#') {
            projectDetailsGithub.style.display = 'inline-flex';
            projectDetailsGithub.href = data.github;
        } else {
            projectDetailsGithub.style.display = 'none';
        }

        openModalDialog(projectDetailsModal, this, projectDetailsClose);
    });
});

[projectDetailsClose, projectDetailsCloseBtn].forEach(el => {
    if (el) el.addEventListener('click', closeProjectDetails);
});

projectDetailsModal && projectDetailsModal.addEventListener('click', e => {
    if (e.target === projectDetailsModal) closeProjectDetails();
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && projectDetailsModal && projectDetailsModal.classList.contains('show')) {
        closeProjectDetails();
    }
});

function closeProjectDetails(options = {}) {
    if (projectDetailsModal) {
        closeModalDialog(projectDetailsModal, options);
    }
}
