document.documentElement.classList.add('js');

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let prefersReducedMotion = reducedMotionQuery.matches;
let resizeObserverTimeout = null;

if (typeof reducedMotionQuery.addEventListener === 'function') {
    reducedMotionQuery.addEventListener('change', (event) => {
        prefersReducedMotion = event.matches;
    });
}

const projectsData = {
    'llm-telegram-bot': {
        icon: 'LLM',
        title: 'LLM Telegram Bot',
        description: 'A local-first AI assistant that turns model capability into a daily-use Telegram workflow instead of a novelty chat surface.',
        features: [
            'Built a Telegram interface that feels lightweight and usable for everyday conversations instead of one-off prompting.',
            'Added persona control, history management, thread reset tools, and export helpers to support longer-running sessions.',
            'Implemented streaming responses and live typing flow for a smoother conversational experience.',
            'Kept execution local through LM Studio so sensitive usage stays private and under direct control.',
        ],
        tags: ['Python', 'OpenAI', 'Telegram Bot API', 'LM Studio', 'LLM', 'Streaming', 'Prompt Engineering'],
        video: 'pet-projects/llm-tegegram-bot/LLM Telegram bot.mp4',
    },
    'stock-analysis': {
        icon: 'AI',
        title: 'Stock Analysis AI',
        description: 'A tool-using AI workflow that combines live market data with structured reasoning instead of prompt-only analysis.',
        features: [
            'Resolved ticker discovery by company name and market so users can start from natural language instead of memorized symbols.',
            'Pulled live pricing, volume, and supporting market context before any analysis step runs.',
            'Generated technical signals around momentum, volatility, moving averages, and support-resistance levels.',
            'Used function calling to turn natural language prompts into grounded analysis with traceable tool outputs.',
        ],
        tags: ['Python', 'OpenAI', 'Function Calling', 'LLM', 'yfinance', 'Pydantic', 'Technical Analysis', 'Yahoo Finance'],
        video: 'pet-projects/stock-ai-analysis/Stock BOT AI.mp4',
    },
    'qa-engine': {
        icon: 'RAG',
        title: 'Advanced RAG Multi-Source QA System',
        description: 'A multi-source QA pipeline built around reliability, evaluation, and observability instead of answer generation alone.',
        features: [
            'Combined semantic retrieval, keyword search, reranking, and diversity filtering to improve grounding across sources.',
            'Added query expansion and multi-hop reasoning to handle broader technical questions with better recall.',
            'Evaluated answer quality with RAGAS-style checks, grounding validation, and hallucination risk scoring.',
            'Included safety and observability layers such as prompt-injection checks, PII redaction, and system reporting.',
        ],
        tags: ['RAG', 'BM25', 'ChromaDB', 'RAGAS', 'Guardrails', 'Query Expansion', 'Hallucination Detection'],
        video: null,
    },
};

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
let sectionLinkObserver = null;

function getFocusableElements(container) {
    return Array.from(container.querySelectorAll(focusableSelector))
        .filter((element) => !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true');
}

function normalizeExternalUrl(url) {
    if (!url || url === '#') return null;
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function openModalDialog(modal, triggerEl, focusEl) {
    if (!modal) return;

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
    if (!modal) return;

    const { returnFocus = true } = options;

    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');

    if (activeModal === modal) {
        activeModal = null;
    }

    document.body.style.overflow = '';

    if (returnFocus && lastModalTrigger instanceof HTMLElement && document.contains(lastModalTrigger)) {
        requestAnimationFrame(() => lastModalTrigger.focus());
    }

    if (returnFocus) {
        lastModalTrigger = null;
    }
}

function getNavHeight() {
    const navbar = document.querySelector('.navbar');
    return navbar ? navbar.offsetHeight : 0;
}

function closeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (!hamburger || !navMenu) return;

    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
}

function setActiveNav(targetId) {
    document.querySelectorAll('.nav-link').forEach((link) => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === `#${targetId}`);
    });
}

function refreshNavbarState() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    navbar.classList.toggle('scrolled', window.scrollY > 12);
}

function syncEdgeSectionNav() {
    const scrollTop = window.scrollY;
    const viewportBottom = scrollTop + window.innerHeight;
    const documentHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
    );
    const bottomThreshold = getNavHeight() + 8;

    if (scrollTop <= 8) {
        setActiveNav('home');
        return true;
    }

    if (viewportBottom >= documentHeight - bottomThreshold) {
        setActiveNav('contact');
        return true;
    }

    return false;
}

function initSectionLinkObserver() {
    const sections = document.querySelectorAll('main section[id]');
    if (!sections.length || !('IntersectionObserver' in window)) return;

    if (sectionLinkObserver) {
        sectionLinkObserver.disconnect();
    }

    const visibleSections = new Map();

    sectionLinkObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const sectionId = entry.target.getAttribute('id');
            if (!sectionId) return;

            if (entry.isIntersecting) {
                visibleSections.set(sectionId, {
                    ratio: entry.intersectionRatio,
                    top: Math.abs(entry.boundingClientRect.top)
                });
            } else {
                visibleSections.delete(sectionId);
            }
        });

        if (syncEdgeSectionNav()) return;
        if (!visibleSections.size) return;

        const [activeSectionId] = Array.from(visibleSections.entries()).sort(([, a], [, b]) => {
            if (b.ratio !== a.ratio) {
                return b.ratio - a.ratio;
            }

            return a.top - b.top;
        })[0];

        setActiveNav(activeSectionId);
    }, {
        rootMargin: `-${getNavHeight() + 24}px 0px -48% 0px`,
        threshold: [0.12, 0.3, 0.55, 0.78]
    });

    sections.forEach((section) => {
        sectionLinkObserver.observe(section);
    });
}

function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const expanded = hamburger.classList.toggle('active');
            navMenu.classList.toggle('active', expanded);
            hamburger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            document.body.classList.toggle('menu-open', expanded);
        });
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetSelector = link.getAttribute('href');
            if (!targetSelector || !targetSelector.startsWith('#')) return;

            const target = document.querySelector(targetSelector);
            if (!target) return;

            event.preventDefault();

            window.scrollTo({
                top: target.offsetTop - getNavHeight(),
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });

            closeMobileMenu();
        });
    });

    document.addEventListener('click', (event) => {
        if (!navMenu || !navMenu.classList.contains('active')) return;
        if (event.target.closest('.navbar')) return;
        closeMobileMenu();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navMenu?.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 860) {
            closeMobileMenu();
        }

        window.clearTimeout(resizeObserverTimeout);
        resizeObserverTimeout = window.setTimeout(() => {
            initSectionLinkObserver();
            syncEdgeSectionNav();
        }, 120);
    });

    window.addEventListener('scroll', () => {
        refreshNavbarState();
        syncEdgeSectionNav();
    }, { passive: true });

    refreshNavbarState();
    if (!syncEdgeSectionNav()) {
        setActiveNav('home');
    }
    initSectionLinkObserver();
}

function initFooterYear() {
    const yearElement = document.getElementById('copyright-year');
    if (yearElement) {
        yearElement.textContent = String(new Date().getFullYear());
    }
}

function assignRevealTargets() {
    const revealGroups = [
        { selector: '.section-title', variant: 'soft' },
        { selector: '.section-intro, .projects-intro', variant: 'soft', baseDelay: 70 },
        { selector: '.about-lead', variant: 'soft' },
        { selector: '.about-card', variant: 'soft', stagger: 65 },
        { selector: '.skill-category', variant: 'soft', stagger: 55 },
        { selector: '.experience-item-primary', variant: 'soft', stagger: 60 },
        { selector: '.experience-item-secondary', variant: 'soft', baseDelay: 80, stagger: 45 },
        { selector: '.project-card', variant: 'scale', stagger: 70 },
        { selector: '.cert-card', variant: 'soft', stagger: 50 },
        { selector: '.education-card', variant: 'soft' },
        { selector: '.contact-content', variant: 'soft' },
        { selector: '.footer', variant: 'soft' }
    ];

    revealGroups.forEach(({ selector, variant = 'soft', baseDelay = 0, stagger = 0 }) => {
        document.querySelectorAll(selector).forEach((element, index) => {
            element.classList.add('reveal');
            element.dataset.reveal = variant;
            element.style.setProperty('--reveal-delay', `${baseDelay + (index * stagger)}ms`);
        });
    });
}

function initMotionSystem() {
    const root = document.documentElement;

    assignRevealTargets();

    const revealElements = document.querySelectorAll('.reveal');
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        revealElements.forEach((element) => element.classList.add('is-visible'));
        root.classList.add('page-ready');
        return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, {
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.14
    });

    revealElements.forEach((element) => revealObserver.observe(element));

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            root.classList.add('page-ready');
        });
    });
}

function initHeroQuoteTypewriter() {
    const quoteCode = document.querySelector('.hero-quote-code');
    const lines = Array.from(document.querySelectorAll('.hero-quote-line'));
    if (!quoteCode || !lines.length) {
        return;
    }

    const lineTexts = lines.map((line) => line.getAttribute('data-text') || line.textContent || '');

    if (prefersReducedMotion) {
        quoteCode.classList.add('is-typewriter-active');
        lines.forEach((line, index) => {
            line.textContent = lineTexts[index];
            line.classList.remove('is-typing');
        });
        return;
    }

    quoteCode.classList.add('is-typewriter-active');
    lines.forEach((line) => {
        line.textContent = '';
        line.classList.remove('is-typing');
    });

    let currentLineIndex = 0;
    let currentCharIndex = 0;
    let timeoutId = null;

    const initialDelay = 900;
    const typeDelay = 52;
    const spaceDelay = 20;
    const linePause = 180;
    const cyclePause = 1500;

    const queueNextStep = (delay) => {
        timeoutId = window.setTimeout(step, delay);
    };

    const clearTypingState = () => {
        lines.forEach((line) => line.classList.remove('is-typing'));
    };

    const resetLines = () => {
        clearTypingState();
        lines.forEach((line) => {
            line.textContent = '';
        });
        currentLineIndex = 0;
        currentCharIndex = 0;
    };

    const step = () => {
        if (prefersReducedMotion) {
            clearTypingState();
            lines.forEach((line, index) => {
                line.textContent = lineTexts[index];
            });
            return;
        }

        if (currentLineIndex >= lines.length) {
            queueNextStep(cyclePause);
            currentLineIndex = -1;
            return;
        }

        if (currentLineIndex === -1) {
            resetLines();
            queueNextStep(240);
            return;
        }

        const line = lines[currentLineIndex];
        const lineText = lineTexts[currentLineIndex];

        clearTypingState();
        line.classList.add('is-typing');

        if (currentCharIndex < lineText.length) {
            currentCharIndex += 1;
            line.textContent = lineText.slice(0, currentCharIndex);
            const typedCharacter = lineText[currentCharIndex - 1];
            queueNextStep(typedCharacter === ' ' ? spaceDelay : typeDelay);
            return;
        }

        line.classList.remove('is-typing');
        currentLineIndex += 1;
        currentCharIndex = 0;
        queueNextStep(linePause);
    };

    queueNextStep(initialDelay);
}

function initGlobalModalKeyboardHandling() {
    document.addEventListener('keydown', (event) => {
        if (!activeModal) return;

        if (event.key === 'Escape') {
            const closeButton = activeModal.querySelector('[data-modal-close], .cert-modal-close, .project-details-close');
            if (closeButton instanceof HTMLElement) {
                closeButton.click();
            }
        }

        if (event.key !== 'Tab') return;

        const focusableElements = getFocusableElements(activeModal);
        if (!focusableElements.length) {
            event.preventDefault();
            return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!activeModal.contains(document.activeElement)) {
            event.preventDefault();
            firstElement.focus();
            return;
        }

        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    });
}

function initCertificationModal() {
    const certModal = document.getElementById('certModal');
    const certModalClose = document.getElementById('certModalClose');
    const certImage = document.getElementById('certImage');
    const certVerifyLink = document.getElementById('certVerifyLink');
    const certModalIcon = document.getElementById('certModalIcon');
    const certModalIssuer = document.getElementById('certModalIssuer');
    const certModalTitle = document.getElementById('certModalTitle');

    if (!certModal || !certModalClose || !certImage || !certVerifyLink || !certModalIcon || !certModalIssuer || !certModalTitle) {
        return;
    }

    function closeCertModal() {
        certImage.removeAttribute('src');
        certImage.alt = 'Certificate';
        certImage.hidden = true;
        certVerifyLink.removeAttribute('href');
        certVerifyLink.hidden = true;
        closeModalDialog(certModal);
    }

    document.querySelectorAll('.achievement-badge[data-cert]').forEach((badge) => {
        const handleOpen = () => {
            const certFile = badge.getAttribute('data-cert');
            if (!certFile) return;

            certImage.src = `certs/${certFile}`;
            certImage.alt = badge.textContent.trim();
            certImage.hidden = false;
            certModalTitle.textContent = badge.textContent.trim();
            certModalIcon.textContent = '🏆';
            certModalIssuer.textContent = 'Achievement';
            certVerifyLink.hidden = true;

            openModalDialog(certModal, badge, certModalClose);
        };

        badge.addEventListener('click', handleOpen);
    });

    document.querySelectorAll('.cert-card').forEach((card) => {
        const handleOpen = () => {
            const certName = card.getAttribute('data-cert-name') || 'Certificate';
            const certIcon = card.getAttribute('data-cert-icon') || '🏆';
            const certIssuer = card.getAttribute('data-cert-issuer') || '';
            const certImageFile = card.getAttribute('data-cert-image');
            const verifyUrl = normalizeExternalUrl(card.getAttribute('data-cert-verify'));

            certModalTitle.textContent = certName;
            certModalIcon.textContent = certIcon;
            certModalIssuer.textContent = certIssuer;

            if (certImageFile) {
                certImage.src = `certs/${certImageFile}`;
                certImage.alt = certName;
                certImage.hidden = false;
            } else {
                certImage.removeAttribute('src');
                certImage.alt = 'Certificate';
                certImage.hidden = true;
            }

            if (verifyUrl) {
                certVerifyLink.href = verifyUrl;
                certVerifyLink.hidden = false;
            } else {
                certVerifyLink.removeAttribute('href');
                certVerifyLink.hidden = true;
            }

            openModalDialog(certModal, card, certModalClose);
        };

        card.addEventListener('click', handleOpen);
    });

    certModalClose.setAttribute('data-modal-close', 'true');
    certModalClose.addEventListener('click', closeCertModal);
    certModal.addEventListener('click', (event) => {
        if (event.target === certModal) {
            closeCertModal();
        }
    });
}

function initProjectCards() {
    document.querySelectorAll('.project-card').forEach((card) => {
        const demoButton = card.querySelector('.btn-project-demo');
        const actions = card.querySelector('.project-actions');

        if (demoButton && !demoButton.getAttribute('data-video')) {
            demoButton.hidden = true;
        }

        if (actions) {
            const visibleActions = Array.from(actions.children).filter((child) => !child.hidden);
            actions.classList.toggle('project-actions-single', visibleActions.length === 1);
        }
    });
}

function initProjectDemoModal() {
    const projectDemoModal = document.getElementById('projectDemoModal');
    const projectDemoClose = document.getElementById('projectDemoClose');
    const projectDemoVideo = document.getElementById('projectDemoVideo');
    const projectDemoTitle = document.getElementById('projectDemoTitle');

    if (!projectDemoModal || !projectDemoClose || !projectDemoVideo || !projectDemoTitle) {
        return { openProjectDemo: () => {} };
    }

    projectDemoVideo.playsInline = true;
    projectDemoVideo.preload = 'none';

    function closeProjectDemo() {
        projectDemoVideo.pause();
        projectDemoVideo.removeAttribute('src');
        projectDemoVideo.removeAttribute('poster');
        projectDemoVideo.load();
        closeModalDialog(projectDemoModal);
    }

    function openProjectDemo(triggerButton) {
        if (!(triggerButton instanceof HTMLElement)) return;

        const videoPath = triggerButton.getAttribute('data-video');
        if (!videoPath) return;
        const posterPath = triggerButton.getAttribute('data-poster');

        const titleElement = triggerButton.closest('.project-card')?.querySelector('.project-title');
        projectDemoTitle.textContent = titleElement ? titleElement.textContent : 'Project Demo';
        if (posterPath) {
            projectDemoVideo.poster = posterPath;
        } else {
            projectDemoVideo.removeAttribute('poster');
        }
        projectDemoVideo.src = videoPath;
        projectDemoVideo.currentTime = 0;

        openModalDialog(projectDemoModal, triggerButton, projectDemoClose);

        const playAttempt = projectDemoVideo.play();
        if (playAttempt && typeof playAttempt.catch === 'function') {
            playAttempt.catch(() => {});
        }
    }

    projectDemoClose.setAttribute('data-modal-close', 'true');
    projectDemoClose.addEventListener('click', closeProjectDemo);
    projectDemoModal.addEventListener('click', (event) => {
        if (event.target === projectDemoModal) {
            closeProjectDemo();
        }
    });

    document.querySelectorAll('.btn-project-demo').forEach((button) => {
        button.addEventListener('click', () => openProjectDemo(button));
    });

    return { openProjectDemo };
}

function initProjectDetailsModal(openProjectDemo) {
    const projectDetailsModal = document.getElementById('projectDetailsModal');
    const projectDetailsClose = document.getElementById('projectDetailsClose');
    const projectDetailsCloseBtn = document.getElementById('projectDetailsCloseBtn');
    const projectDetailsIcon = document.getElementById('projectDetailsIcon');
    const projectDetailsTitle = document.getElementById('projectDetailsTitle');
    const projectDetailsSummary = document.getElementById('projectDetailsSummary');
    const projectDetailsFeatures = document.getElementById('projectDetailsFeatures');
    const projectDetailsTags = document.getElementById('projectDetailsTags');
    const projectDetailsWatchDemo = document.getElementById('projectDetailsWatchDemo');

    if (!projectDetailsModal || !projectDetailsClose || !projectDetailsCloseBtn || !projectDetailsIcon || !projectDetailsTitle || !projectDetailsSummary || !projectDetailsFeatures || !projectDetailsTags || !projectDetailsWatchDemo) {
        return;
    }

    function closeProjectDetails(options = {}) {
        closeModalDialog(projectDetailsModal, options);
    }

    projectDetailsClose.setAttribute('data-modal-close', 'true');
    projectDetailsClose.addEventListener('click', () => closeProjectDetails());
    projectDetailsCloseBtn.addEventListener('click', () => closeProjectDetails());

    projectDetailsModal.addEventListener('click', (event) => {
        if (event.target === projectDetailsModal) {
            closeProjectDetails();
        }
    });

    document.querySelectorAll('.btn-project-details').forEach((button) => {
        button.addEventListener('click', () => {
            const projectKey = button.getAttribute('data-project');
            const project = projectKey ? projectsData[projectKey] : null;
            if (!project) return;

            projectDetailsIcon.textContent = project.icon;
            projectDetailsTitle.textContent = project.title;
            projectDetailsSummary.textContent = project.description;
            projectDetailsFeatures.innerHTML = project.features.map((feature) => `<li>${feature}</li>`).join('');
            projectDetailsTags.innerHTML = project.tags.map((tag) => `<span class="tech-tag">${tag}</span>`).join('');

            if (project.video) {
                projectDetailsWatchDemo.hidden = false;
                projectDetailsWatchDemo.onclick = () => {
                    closeProjectDetails({ returnFocus: false });
                    const demoButton = document.querySelector(`.btn-project-demo[data-demo="${projectKey}"]`);
                    if (demoButton) {
                        openProjectDemo(demoButton);
                    }
                };
            } else {
                projectDetailsWatchDemo.hidden = true;
                projectDetailsWatchDemo.onclick = null;
            }

            openModalDialog(projectDetailsModal, button, projectDetailsClose);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initFooterYear();
    initMotionSystem();
    initHeroQuoteTypewriter();
    initNavigation();
    initGlobalModalKeyboardHandling();
    initCertificationModal();
    initProjectCards();
    const { openProjectDemo } = initProjectDemoModal();
    initProjectDetailsModal(openProjectDemo);
});
