// ===== LANGUAGE SYSTEM =====
let currentLang = 'tr';

function setLang(lang) {
    currentLang = lang;

    // Update buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update all translatable elements
    document.querySelectorAll('[data-tr][data-en]').forEach(el => {
        const text = el.getAttribute('data-' + lang);
        if (text) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            } else {
                el.innerHTML = text;
            }
        }
    });

    // Update html lang attribute
    document.documentElement.lang = lang;
}

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    navbar.classList.toggle('scrolled', currentScroll > 50);
    lastScroll = currentScroll;
});

// ===== MOBILE MENU =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    }
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    });
});

// ===== PROGRAM CURRICULUM TOGGLE =====
function toggleProgram(id) {
    const curriculum = document.getElementById('prog-' + id);
    const card = curriculum.closest('.program-card');
    const toggle = card.querySelector('.program-toggle');
    const isOpen = curriculum.classList.contains('open');

    // Close all others
    document.querySelectorAll('.program-curriculum').forEach(c => c.classList.remove('open'));
    document.querySelectorAll('.program-toggle').forEach(t => {
        t.classList.remove('active');
        t.innerHTML = t.getAttribute('data-' + currentLang) || (currentLang === 'tr' ? 'Müfredatı Gör' : 'View Curriculum');
    });

    if (!isOpen) {
        curriculum.classList.add('open');
        toggle.classList.add('active');
        toggle.innerHTML = currentLang === 'tr' ? 'Müfredatı Gizle' : 'Hide Curriculum';
    }
}

// ===== CONTACT FORM =====
function handleSubmit(event) {
    event.preventDefault();
    const success = document.getElementById('formSuccess');
    success.classList.add('show');
    event.target.reset();
    setTimeout(() => {
        success.classList.remove('show');
    }, 4000);
}

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add animation classes
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll(
        '.program-card, .path-step, .world-city, .info-card, .about-content, .about-visual'
    );

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Visible class
const style = document.createElement('style');
style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(style);

// ===== AUTH MODALS =====
function openModal(type) {
    document.getElementById('modalOverlay').classList.add('active');
    if (type === 'login') {
        document.getElementById('loginModal').classList.add('active');
        document.getElementById('registerModal').classList.remove('active');
    } else {
        document.getElementById('registerModal').classList.add('active');
        document.getElementById('loginModal').classList.remove('active');
    }
    document.body.style.overflow = 'hidden';
    // Close mobile menu if open
    navLinks.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
    document.getElementById('loginModal').classList.remove('active');
    document.getElementById('registerModal').classList.remove('active');
    document.body.style.overflow = '';
}

function switchModal(type) {
    openModal(type);
}

function handleAuth(event, type) {
    event.preventDefault();
    const msgId = type === 'login' ? 'loginMsg' : 'registerMsg';
    const msg = document.getElementById(msgId);
    const text = currentLang === 'tr'
        ? (type === 'login' ? 'Sistem bakımda. Lütfen daha sonra tekrar deneyin.' : 'Kayıtlar şu an için kapalıdır. Lütfen daha sonra tekrar deneyin.')
        : (type === 'login' ? 'System is under maintenance. Please try again later.' : 'Registrations are currently closed. Please try again later.');
    msg.textContent = text;
    msg.classList.add('show');
    event.target.reset();
    setTimeout(() => msg.classList.remove('show'), 5000);
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollY >= top && scrollY < top + height) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.add('active');
                }
            });
        }
    });
});
