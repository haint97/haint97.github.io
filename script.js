const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let prefersReducedMotion = reducedMotionQuery.matches;

if (typeof reducedMotionQuery.addEventListener === 'function') {
    reducedMotionQuery.addEventListener('change', (event) => {
        prefersReducedMotion = event.matches;
    });
}

const projectsData = {
    'llm-telegram-bot': {
        icon: '🤖',
        title: 'LLM Telegram Bot',
        description: 'An intelligent Telegram chatbot powered by a local LLM running on LM Studio, integrated with the OpenAI API for advanced conversational AI with privacy-first local execution.',
        features: [
            'Conversation management with commands for clearing history, resetting threads, reviewing summaries, and exporting chats.',
            'Custom personas and system prompts for switching between assistant modes and saving tailored behavior.',
            'Streaming responses with a live typing flow for a smoother conversational experience.',
            'Local-first execution through LM Studio to keep sensitive conversations off third-party servers.',
        ],
        tags: ['Python', 'OpenAI', 'Telegram Bot API', 'LM Studio', 'LLM', 'Streaming', 'Prompt Engineering'],
        video: 'pet-projects/llm-tegegram-bot/LLM Telegram bot.mov',
        github: null,
    },
    'stock-analysis': {
        icon: '📊',
        title: 'Stock Analysis AI',
        description: 'A conversational AI assistant that performs real-time stock market analysis with OpenAI function calling and chained tool usage.',
        features: [
            'Lookup of company tickers by name and country for fast symbol discovery.',
            'Retrieval of live pricing, volume, and supporting market data.',
            'Trend analysis with moving averages, volatility, momentum, and support and resistance signals.',
            'Tool-using AI workflow that turns natural language prompts into grounded market reports.',
        ],
        tags: ['Python', 'OpenAI', 'Function Calling', 'LLM', 'yfinance', 'Pydantic', 'Technical Analysis', 'Yahoo Finance'],
        video: 'pet-projects/stock-ai-analysis/Stock BOT AI.mov',
        github: null,
    },
    'qa-engine': {
        icon: '🧠',
        title: 'Advanced RAG Multi-Source QA System',
        description: 'A multi-source QA system that retrieves grounded answers from web, Wikipedia, and files with evaluation, guardrails, and hallucination checks built in.',
        features: [
            'Hybrid retrieval combining semantic search, keyword search, reranking, and diversity filtering.',
            'Query expansion and multi-hop reasoning to improve coverage on complex technical questions.',
            'RAGAS-based answer evaluation, grounding checks, and hallucination risk scoring.',
            'Production-minded safety features including prompt-injection checks, PII redaction, and observability reports.',
        ],
        tags: ['RAG', 'BM25', 'ChromaDB', 'RAGAS', 'Guardrails', 'Query Expansion', 'Hallucination Detection'],
        video: null,
        github: null,
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

    window.addEventListener('resize', () => {
        if (window.innerWidth > 860) {
            closeMobileMenu();
        }
        initSectionLinkObserver();
    });

    window.addEventListener('scroll', refreshNavbarState, { passive: true });

    refreshNavbarState();
    setActiveNav('home');
    initSectionLinkObserver();
}

function initFooterYear() {
    const yearElement = document.getElementById('copyright-year');
    if (yearElement) {
        yearElement.textContent = String(new Date().getFullYear());
    }
}

function initAOS() {
    window.addEventListener('load', () => {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                disable: prefersReducedMotion,
                duration: prefersReducedMotion ? 0 : 700,
                easing: 'ease-out-cubic',
                once: true,
                offset: 80,
            });
        }
    });
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
        closeModalDialog(certModal);
    }

    document.querySelectorAll('.achievement-badge[data-cert]').forEach((badge) => {
        const handleOpen = () => {
            const certFile = badge.getAttribute('data-cert');
            if (!certFile) return;

            certImage.src = `certs/${certFile}`;
            certImage.alt = badge.textContent.trim();
            certImage.style.display = 'block';
            certModalTitle.textContent = badge.textContent.trim();
            certModalIcon.textContent = '🏆';
            certModalIssuer.textContent = 'Achievement';
            certVerifyLink.hidden = true;

            openModalDialog(certModal, badge, certModalClose);
        };

        badge.addEventListener('click', handleOpen);
        badge.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleOpen();
            }
        });
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
                certImage.style.display = 'block';
            } else {
                certImage.removeAttribute('src');
                certImage.alt = '';
                certImage.style.display = 'none';
            }

            if (verifyUrl) {
                certVerifyLink.href = verifyUrl;
                certVerifyLink.hidden = false;
            } else {
                certVerifyLink.hidden = true;
            }

            openModalDialog(certModal, card, certModalClose);
        };

        card.addEventListener('click', handleOpen);
        card.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleOpen();
            }
        });
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
        const linkButton = card.querySelector('.btn-project-link');
        const actions = card.querySelector('.project-actions');

        if (demoButton && !demoButton.getAttribute('data-video')) {
            demoButton.hidden = true;
        }

        if (linkButton) {
            const normalizedHref = normalizeExternalUrl(linkButton.getAttribute('href'));
            if (!normalizedHref) {
                linkButton.hidden = true;
            } else {
                linkButton.href = normalizedHref;
            }
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

    function closeProjectDemo() {
        projectDemoVideo.pause();
        projectDemoVideo.removeAttribute('src');
        projectDemoVideo.load();
        closeModalDialog(projectDemoModal);
    }

    function openProjectDemo(triggerButton) {
        if (!(triggerButton instanceof HTMLElement)) return;

        const videoPath = triggerButton.getAttribute('data-video');
        if (!videoPath) return;

        const titleElement = triggerButton.closest('.project-card')?.querySelector('.project-title');
        projectDemoTitle.textContent = titleElement ? titleElement.textContent : 'Project Demo';
        projectDemoVideo.src = videoPath;

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
    const projectDetailsGithub = document.getElementById('projectDetailsGithub');

    if (!projectDetailsModal || !projectDetailsClose || !projectDetailsCloseBtn || !projectDetailsIcon || !projectDetailsTitle || !projectDetailsSummary || !projectDetailsFeatures || !projectDetailsTags || !projectDetailsWatchDemo || !projectDetailsGithub) {
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

            const githubUrl = normalizeExternalUrl(project.github);
            if (githubUrl) {
                projectDetailsGithub.hidden = false;
                projectDetailsGithub.href = githubUrl;
            } else {
                projectDetailsGithub.hidden = true;
                projectDetailsGithub.removeAttribute('href');
            }

            openModalDialog(projectDetailsModal, button, projectDetailsClose);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initFooterYear();
    initNavigation();
    initAOS();
    initGlobalModalKeyboardHandling();
    initCertificationModal();
    initProjectCards();
    const { openProjectDemo } = initProjectDemoModal();
    initProjectDetailsModal(openProjectDemo);
});
