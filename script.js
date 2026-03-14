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

// ===== CEM AI CHATBOT =====
const cemChat = {
    isOpen: false,
    greeted: false,

    // Knowledge base - TR & EN
    kb: [
        {
            keys: ['kimsin', 'sen kimsin', 'nedir', 'ne yapıyorsun', 'who are you', 'what are you', 'what do you do'],
            tr: 'Ben Cem AI, Cem Akın\'ın dijital asistanıyım 🤖 Academy hakkındaki tüm sorularını yanıtlamak için buradayım. Programlar, müfredat, kayıt süreci... ne merak ediyorsan sor!',
            en: 'I\'m Cem AI, Cem Akın\'s digital assistant 🤖 I\'m here to answer all your questions about the Academy. Programs, curriculum, registration... just ask!'
        },
        {
            keys: ['cem akın', 'cem akin', 'kurucu', 'founder', 'hakkında', 'about him', 'who is cem'],
            tr: 'Cem Akın, 20 yılı aşkın girişimcilik deneyimine sahip bir serial entrepreneur. 5 ülke, 8 şehirde iş kurmuş biri olarak konuşuyorum — Ankara\'dan başlayıp Miami\'ye uzanan bir yolculuk bu. Türkiye, Almanya, İngiltere ve Amerika\'da farklı sektörlerde şirketler kurdu. Şimdi tüm bu birikimi Academy\'de paylaşıyor.',
            en: 'Cem Akın is a serial entrepreneur with over 20 years of experience. He\'s built businesses across 5 countries and 8 cities — from Ankara to Miami. He\'s founded companies in Turkey, Germany, the UK, and the USA across various industries. Now he shares all this experience through the Academy.'
        },
        {
            keys: ['program', 'programlar', 'eğitim', 'kurs', 'courses', 'programs', 'training', 'kaç program'],
            tr: 'Academy\'de 5 kapsamlı eğitim programımız var:\n\n🔹 Girişimciliğe İlk Adım\n🔹 İş Modeli & Strateji\n🔹 Global İş Geliştirme\n🔹 Marka & Büyüme\n🔹 Liderlik & Vizyon\n\nHer program 4 modül ve 16 dersten oluşuyor. Toplamda 20 modül, 80 ders. Hangisi seni en çok ilgilendiriyor?',
            en: 'We have 5 comprehensive programs at the Academy:\n\n🔹 First Steps in Entrepreneurship\n🔹 Business Model & Strategy\n🔹 Global Business Development\n🔹 Brand & Growth\n🔹 Leadership & Vision\n\nEach program has 4 modules and 16 lessons. That\'s 20 modules and 80 lessons total. Which one interests you most?'
        },
        {
            keys: ['ilk adım', 'girişimciliğe', 'first step', 'başlangıç', 'beginner', 'yeni başlayan', 'program 1', 'ilk program'],
            tr: '\"Girişimciliğe İlk Adım\" tam sana göre bir başlangıç noktası! 4 modülden oluşuyor:\n\n1️⃣ Girişimci Zihin Yapısı — korkuları yenmek, risk alma\n2️⃣ Fikir Validasyonu — fikrini test etme yöntemleri\n3️⃣ İlk İş Planın — basit ama etkili planlama\n4️⃣ Sıfırdan Başlamak — ilk adımı atmak\n\nHiç deneyimin olmasa bile bu programla güçlü bir temel atarsın.',
            en: '\"First Steps in Entrepreneurship\" is a perfect starting point! It has 4 modules:\n\n1️⃣ Entrepreneurial Mindset — overcoming fears, risk-taking\n2️⃣ Idea Validation — methods to test your ideas\n3️⃣ Your First Business Plan — simple but effective planning\n4️⃣ Starting from Zero — taking the first step\n\nEven with zero experience, this program builds a strong foundation.'
        },
        {
            keys: ['iş modeli', 'strateji', 'business model', 'strategy', 'canvas', 'gelir', 'revenue', 'program 2'],
            tr: '\"İş Modeli & Strateji\" programı girişiminin iskeletini oluşturur:\n\n📊 Business Model Canvas — iş modelini tek sayfada tasarla\n💰 Gelir Modelleri — hangi model sana uygun?\n🎯 Rekabet Analizi — rakiplerinden nasıl sıyrılırsın\n🔄 Pivot Stratejileri — ne zaman ve nasıl yön değiştirirsin\n\nFikrin varsa ama yapıyı oturtamıyorsan, bu program tam sana göre.',
            en: '\"Business Model & Strategy\" builds the skeleton of your venture:\n\n📊 Business Model Canvas — design your model on one page\n💰 Revenue Models — which model fits you?\n🎯 Competitive Analysis — how to stand out\n🔄 Pivot Strategies — when and how to change direction\n\nIf you have an idea but can\'t structure it, this is your program.'
        },
        {
            keys: ['global', 'uluslararası', 'international', 'yurtdışı', 'abroad', 'avrupa', 'europe', 'amerika', 'usa', 'america', 'program 3'],
            tr: '\"Global İş Geliştirme\" — Cem Akın\'ın en güçlü olduğu alan! 5 ülkede iş kurmuş birinden öğreneceksin:\n\n🌍 Uluslararası Pazarlar — hangi pazara, nasıl girilir\n🤝 Kültürler Arası İş — her ülkenin kendi dinamiği var\n🇪🇺 Avrupa\'da İş Kurma — Almanya, İngiltere odaklı\n🇺🇸 Amerika\'da İş Kurma — ABD pazarının incelikleri\n\nYurtdışında iş kurmak istiyorsan, bu program yol haritanı çizer.',
            en: '\"Global Business Development\" — Cem Akın\'s strongest field! Learn from someone who\'s built businesses in 5 countries:\n\n🌍 International Markets — which market, how to enter\n🤝 Cross-Cultural Business — each country has its own dynamics\n🇪🇺 Starting Business in Europe — Germany, UK focused\n🇺🇸 Starting Business in America — nuances of the US market\n\nIf you want to build abroad, this program draws your roadmap.'
        },
        {
            keys: ['marka', 'büyüme', 'brand', 'growth', 'pazarlama', 'marketing', 'yatırım', 'investment', 'ölçeklendirme', 'scaling', 'program 4'],
            tr: '\"Marka & Büyüme\" programında işini bir sonraki seviyeye taşırsın:\n\n🎨 Marka Oluşturma — kimliğini inşa et\n📱 Dijital Pazarlama — doğru kanallar, doğru strateji\n📈 Ölçeklendirme — büyümenin matematiği\n💼 Yatırım & Ortaklık — yatırımcı nasıl bulunur, ortaklık nasıl kurulur\n\nİşin dönüyor ama büyüyemiyor mu? Bu program tam o noktada devreye giriyor.',
            en: '\"Brand & Growth\" takes your business to the next level:\n\n🎨 Brand Creation — build your identity\n📱 Digital Marketing — right channels, right strategy\n📈 Scaling — the math of growth\n💼 Investment & Partnership — how to find investors and build partnerships\n\nBusiness running but not growing? This program kicks in at exactly that point.'
        },
        {
            keys: ['liderlik', 'vizyon', 'leadership', 'vision', 'takım', 'team', 'kriz', 'crisis', 'program 5'],
            tr: '\"Liderlik & Vizyon\" — Academy\'nin zirve programı:\n\n👤 Lider Girişimci — liderlik stili geliştirme\n👥 Takım Kurma — doğru insanları bulma ve yönetme\n⚡ Kriz Yönetimi — zor zamanlarda ayakta kalma\n🏆 Sürdürülebilir Başarı — uzun vadeli strateji\n\nBu program seni sadece girişimci değil, bir lider yapıyor. 20 yıllık tecrübenin süzülmüş hali.',
            en: '\"Leadership & Vision\" — the Academy\'s pinnacle program:\n\n👤 Entrepreneurial Leader — developing your leadership style\n👥 Team Building — finding and managing the right people\n⚡ Crisis Management — surviving tough times\n🏆 Sustainable Success — long-term strategy\n\nThis program doesn\'t just make you an entrepreneur — it makes you a leader. Distilled from 20 years of experience.'
        },
        {
            keys: ['müfredat', 'ders', 'modül', 'curriculum', 'lesson', 'module', 'içerik', 'content', 'kaç ders'],
            tr: 'Toplamda 5 program, 20 modül ve 80 ders var. Her program 4 modül içeriyor ve her modülde 4 ders bulunuyor. Müfredat, girişimci zihin yapısından global iş geliştirmeye, marka oluşturmadan kriz yönetimine kadar her şeyi kapsıyor. Detaylı müfredatı sitedeki Programlar bölümünden inceleyebilirsin.',
            en: 'There are 5 programs, 20 modules, and 80 lessons in total. Each program contains 4 modules with 4 lessons each. The curriculum covers everything from entrepreneurial mindset to global business development, brand creation to crisis management. You can explore the detailed curriculum in the Programs section.'
        },
        {
            keys: ['kayıt', 'register', 'sign up', 'nasıl kayıt', 'üyelik', 'membership', 'katıl', 'join', 'başla'],
            tr: 'Kayıt olmak çok basit! Sayfanın sağ üstündeki \"Kayıt\" butonuna tıklaman yeterli. Adın, e-posta adresin ve bir şifre ile hızlıca hesabını oluşturabilirsin. Şu an erken kayıt dönemindeyiz, bu yüzden acele etmeni öneririm! 🚀',
            en: 'Registration is super simple! Just click the \"Register\" button at the top right of the page. You can quickly create your account with your name, email, and a password. We\'re in the early registration phase, so I\'d recommend you hurry! 🚀'
        },
        {
            keys: ['ücret', 'fiyat', 'price', 'cost', 'fee', 'para', 'money', 'ne kadar', 'how much', 'ücretsiz', 'free', 'bedava'],
            tr: 'Fiyatlandırma detayları için iletişim formunu doldurmanı veya hello@nextyouagency.com adresine e-posta göndermenizi öneririm. Her programa özel paketlerimiz var. İlgilendiğin programı belirtirsen sana daha doğru bilgi verebilirim!',
            en: 'For pricing details, I\'d suggest filling out the contact form or emailing hello@nextyouagency.com. We have special packages for each program. Let me know which program you\'re interested in and I can guide you better!'
        },
        {
            keys: ['iletişim', 'contact', 'ulaş', 'e-posta', 'email', 'mail', 'reach', 'telefon', 'phone'],
            tr: 'Bize ulaşmanın birkaç yolu var:\n\n📧 E-posta: hello@nextyouagency.com\n📸 Instagram: @_cemakin\n📍 Lokasyonlar: Miami, FL & İstanbul, TR\n🕐 Çalışma saatleri: Pazartesi-Cuma, 09:00-18:00\n\nYa da sayfanın altındaki iletişim formunu doldurabilirsin!',
            en: 'There are several ways to reach us:\n\n📧 Email: hello@nextyouagency.com\n📸 Instagram: @_cemakin\n📍 Locations: Miami, FL & Istanbul, TR\n🕐 Hours: Monday-Friday, 09:00-18:00\n\nOr you can fill out the contact form at the bottom of the page!'
        },
        {
            keys: ['şehir', 'nerede', 'lokasyon', 'konum', 'city', 'cities', 'location', 'where', 'ülke', 'country', 'countries'],
            tr: 'Cem Akın\'ın girişimcilik yolculuğu 8 şehir ve 5 ülkeye yayılıyor:\n\n🇹🇷 Ankara, Eskişehir, İstanbul\n🇩🇪 Düsseldorf\n🇬🇧 Londra\n🇺🇸 New York, Los Angeles, Miami\n\nHer şehir farklı bir deneyim ve farklı bir ders demek. Bu çeşitlilik Academy\'nin temelini oluşturuyor.',
            en: 'Cem Akın\'s entrepreneurial journey spans 8 cities and 5 countries:\n\n🇹🇷 Ankara, Eskişehir, Istanbul\n🇩🇪 Düsseldorf\n🇬🇧 London\n🇺🇸 New York, Los Angeles, Miami\n\nEach city means a different experience and a different lesson. This diversity forms the foundation of the Academy.'
        },
        {
            keys: ['next you', 'agency', 'ajans', 'danışmanlık', 'consulting'],
            tr: 'Next You Agency, Academy\'nin iş ortağı. Eğitim, danışmanlık ve rehberlik hizmetleri sunuyor. Özellikle yurtdışında hayallerini gerçekleştirmek isteyen kişilere yardımcı oluyorlar. Academy eğitimleriyle birlikte entegre bir deneyim sunuyoruz.',
            en: 'Next You Agency is the Academy\'s partner. They offer education, consulting, and guidance services. They particularly help people who want to achieve their dreams abroad. We offer an integrated experience together with Academy training.'
        },
        {
            keys: ['merhaba', 'selam', 'hello', 'hi', 'hey', 'günaydın', 'iyi günler', 'good morning', 'good afternoon', 'naber', 'nasılsın'],
            tr: 'Merhaba! 👋 Hoş geldin! Ben Cem AI, Academy hakkında merak ettiğin her şeyi sana anlatmak için buradayım. Programlar, müfredat, kayıt süreci... ne merak ediyorsan çekinmeden sor!',
            en: 'Hello! 👋 Welcome! I\'m Cem AI, and I\'m here to tell you everything about the Academy. Programs, curriculum, registration process... don\'t hesitate to ask anything!'
        },
        {
            keys: ['teşekkür', 'sağol', 'thanks', 'thank you', 'eyvallah'],
            tr: 'Rica ederim! 😊 Başka merak ettiğin bir şey varsa her zaman buradayım. Girişimcilik yolculuğunda yanındayız — \"Sen yürü, yürüdükçe yol sana görünür.\" 💪',
            en: 'You\'re welcome! 😊 If you have any other questions, I\'m always here. We\'re with you on your entrepreneurial journey — \"Walk forward; the path reveals itself.\" 💪'
        },
        {
            keys: ['yolculuk', 'journey', 'hikaye', 'story', 'nereden başladı', 'how it started'],
            tr: 'Cem Akın\'ın yolculuğu Ankara\'da başladı. Eskişehir\'de ilk girişimlerini yaptı, İstanbul\'da büyüdü. Sonra Düsseldorf\'a geçip Avrupa pazarına açıldı, Londra\'da global ağını genişletti. New York ve Los Angeles\'ta ABD\'ye adım attı, şimdi Miami\'den tüm dünyaya hitap ediyor. Her durak ayrı bir ders, ayrı bir deneyim.',
            en: 'Cem Akın\'s journey started in Ankara. He made his first ventures in Eskişehir, grew in Istanbul. Then moved to Düsseldorf to enter the European market, expanded his global network in London. He stepped into the USA through New York and Los Angeles, and now addresses the whole world from Miami. Each stop is a different lesson, a different experience.'
        },
        {
            keys: ['motto', 'söz', 'quote', 'slogan', 'yürü', 'yürüdükçe', 'yol sana', 'sen yürü', 'walk forward', 'path reveals'],
            tr: '\"Sen yürü. Yürüdükçe yol sana görünür.\" — Hah, benim en sevdiğim konuya geldin! 😄 Bu lafı o kadar çok söyledim ki, artık aynama yapıştırdım, buzdolabıma yazdım, hatta telefon şifrem bile neredeyse bu olacaktı. Şaka bir yana — 20 yılda 5 ülke gezdim, her seferinde yolun nereye gittiğini bilmeden başladım. Ve her seferinde yol göründü. Bu söz benim GPS\'im gibi bir şey, sadece yürümeye başlayınca çalışıyor. 🛤️😎',
            en: '\"Walk forward. The path reveals itself as you go.\" — Ahh, you touched my favorite topic! 😄 I\'ve said this so many times that I stuck it on my mirror, wrote it on my fridge, and almost made it my phone password. Jokes aside — 5 countries in 20 years, every single time I started without knowing where the road leads. And every time, it showed up. Think of this quote as my GPS — it only works when you hit walk. 🛤️😎'
        },
        {
            keys: ['öğrenci', 'student', 'seviye', 'level', 'hangi seviye', 'uygun mu', 'suitable'],
            tr: 'Academy, girişimciliğin her seviyesine uygun tasarlandı. 5 aşamalı yolculuk:\n\n1️⃣ Başlangıç → Program 1\n2️⃣ Gelişim → Program 2\n3️⃣ İleri Seviye → Program 3\n4️⃣ Uzmanlaşma → Program 4\n5️⃣ Ustalık → Program 5\n\nSıfırdan başlayan da, deneyimli girişimci de kendine uygun programı buluyor.',
            en: 'The Academy is designed for every level of entrepreneurship. 5-stage journey:\n\n1️⃣ Beginner → Program 1\n2️⃣ Development → Program 2\n3️⃣ Advanced → Program 3\n4️⃣ Specialization → Program 4\n5️⃣ Mastery → Program 5\n\nWhether starting from zero or an experienced entrepreneur, everyone finds their fit.'
        },
        {
            keys: ['dil', 'türkçe', 'ingilizce', 'language', 'turkish', 'english'],
            tr: 'Site hem Türkçe hem İngilizce olarak kullanılabiliyor. Sağ üst köşedeki TR/EN butonlarıyla dil değiştirebilirsin. Ben de her iki dilde sana yardımcı olabilirim! 🌍',
            en: 'The site is available in both Turkish and English. You can switch languages with the TR/EN buttons in the top right corner. I can also help you in both languages! 🌍'
        },
        {
            keys: ['instagram', 'sosyal medya', 'social media', 'takip'],
            tr: 'Cem Akın\'ı Instagram\'da takip edebilirsin: @_cemakin 📸 Oradan da güncel içerik ve girişimcilik tüyolarına ulaşabilirsin!',
            en: 'You can follow Cem Akın on Instagram: @_cemakin 📸 You\'ll find fresh content and entrepreneurship tips there too!'
        }
    ],

    suggestions: {
        tr: ['Programlar neler?', 'Cem Akın kimdir?', 'Nasıl kayıt olabilirim?', 'Hangi ülkelerde?'],
        en: ['What programs?', 'Who is Cem Akın?', 'How to register?', 'Which countries?']
    },

    detectLang(text) {
        const trChars = /[çğıöşüÇĞİÖŞÜ]/;
        const trWords = /\b(merhaba|selam|nasıl|nedir|kimdir|hakkında|program|kayıt|ücret|fiyat|nerede|teşekkür|sağol|evet|hayır|ne|nasıl|hangi|kaç)\b/i;
        if (trChars.test(text) || trWords.test(text)) return 'tr';
        const enWords = /\b(hello|hi|hey|what|who|how|where|when|why|program|price|register|about|thank|yes|no|can|do|is|are)\b/i;
        if (enWords.test(text)) return 'en';
        return currentLang;
    },

    findAnswer(text, lang) {
        const lower = text.toLowerCase().replace(/[?!.,;:'"]/g, '');
        let bestMatch = null;
        let bestScore = 0;

        for (const item of this.kb) {
            let score = 0;
            for (const key of item.keys) {
                if (lower.includes(key)) {
                    score += key.split(' ').length * 2;
                }
            }
            if (score > bestScore) {
                bestScore = score;
                bestMatch = item;
            }
        }

        if (bestMatch && bestScore > 0) {
            return bestMatch[lang];
        }

        return lang === 'tr'
            ? 'Hmm, bu konuda elimde net bir bilgi yok ama seni doğru kişiye yönlendirebilirim. hello@nextyouagency.com adresine yazarsan ekibimiz sana en kısa sürede dönüş yapacaktır. Ya da başka bir soru sorabilirsin — programlar, kayıt, müfredat gibi konularda sana yardımcı olabilirim! 😊'
            : 'Hmm, I don\'t have specific info on that, but I can point you in the right direction. Email hello@nextyouagency.com and our team will get back to you ASAP. Or you can ask me about programs, registration, curriculum — I\'m happy to help! 😊';
    }
};

// Render functions
function addCemMsg(text, type) {
    const body = document.getElementById('cemChatBody');
    const msg = document.createElement('div');
    msg.className = 'cem-msg ' + type;

    if (type === 'bot') {
        msg.innerHTML = '<div class="cem-msg-avatar"><img src="cem-akin.jpg" alt="Cem AI"></div><div class="cem-msg-bubble">' + text.replace(/\n/g, '<br>') + '</div>';
    } else {
        msg.innerHTML = '<div class="cem-msg-bubble">' + text.replace(/\n/g, '<br>') + '</div>';
    }

    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
}

function showCemTyping() {
    const body = document.getElementById('cemChatBody');
    const typing = document.createElement('div');
    typing.className = 'cem-typing';
    typing.id = 'cemTypingIndicator';
    typing.innerHTML = '<div class="cem-typing-avatar"><img src="cem-akin.jpg" alt="Cem AI"></div><div class="cem-typing-dots"><span></span><span></span><span></span></div>';
    body.appendChild(typing);
    body.scrollTop = body.scrollHeight;

    // Update status
    const status = document.getElementById('cemChatStatus');
    status.textContent = currentLang === 'tr' ? 'yazıyor...' : 'typing...';
}

function hideCemTyping() {
    const typing = document.getElementById('cemTypingIndicator');
    if (typing) typing.remove();

    const status = document.getElementById('cemChatStatus');
    status.textContent = currentLang === 'tr' ? 'Çevrimiçi' : 'Online';
}

function showSuggestions() {
    const container = document.getElementById('cemChatSuggestions');
    const lang = currentLang;
    const sugs = cemChat.suggestions[lang];
    container.innerHTML = sugs.map(s => '<button class="cem-sug-btn" onclick="sendSuggestion(this)">' + s + '</button>').join('');
}

function clearSuggestions() {
    document.getElementById('cemChatSuggestions').innerHTML = '';
}

function sendSuggestion(btn) {
    const text = btn.textContent;
    clearSuggestions();
    document.getElementById('cemChatInput').value = '';
    processCemChat(text);
}

let cemScrollY = 0;

function toggleCemChat() {
    const fab = document.getElementById('cemChatFab');
    const win = document.getElementById('cemChatWindow');
    cemChat.isOpen = !cemChat.isOpen;

    fab.classList.toggle('open', cemChat.isOpen);
    win.classList.toggle('open', cemChat.isOpen);

    // Lock body scroll on mobile
    if (window.innerWidth <= 768) {
        if (cemChat.isOpen) {
            cemScrollY = window.scrollY;
            document.body.classList.add('cem-chat-locked');
            document.body.style.top = '-' + cemScrollY + 'px';
        } else {
            document.body.classList.remove('cem-chat-locked');
            document.body.style.top = '';
            window.scrollTo(0, cemScrollY);
        }
    }

    // Hide badge
    const badge = document.getElementById('cemFabBadge');
    if (cemChat.isOpen) badge.classList.add('hidden');

    if (cemChat.isOpen && !cemChat.greeted) {
        cemChat.greeted = true;
        const lang = currentLang;
        setTimeout(() => {
            showCemTyping();
            const delay = 800 + Math.random() * 600;
            setTimeout(() => {
                hideCemTyping();
                const greeting = lang === 'tr'
                    ? 'Merhaba! 👋 Ben Cem AI. Cem Akın Academy hakkında merak ettiğin her şeyi bana sorabilirsin. Nasıl yardımcı olabilirim?'
                    : 'Hello! 👋 I\'m Cem AI. You can ask me anything about Cem Akın Academy. How can I help you?';
                addCemMsg(greeting, 'bot');
                showSuggestions();
            }, delay);
        }, 400);

        document.getElementById('cemChatInput').focus();
    }

    if (cemChat.isOpen) {
        setTimeout(() => document.getElementById('cemChatInput').focus(), 100);
    }
}

function sendCemChat() {
    const input = document.getElementById('cemChatInput');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    clearSuggestions();
    processCemChat(text);
}

function processCemChat(text) {
    addCemMsg(text, 'user');

    const lang = cemChat.detectLang(text);

    // Show typing with variable delay for realism
    setTimeout(() => {
        showCemTyping();
        const thinkTime = 1000 + Math.random() * 1500 + text.length * 15;
        setTimeout(() => {
            hideCemTyping();
            const answer = cemChat.findAnswer(text, lang);
            addCemMsg(answer, 'bot');

            // Show suggestions again after a response
            setTimeout(showSuggestions, 500);
        }, thinkTime);
    }, 300);
}

// Init chatbot with entrance animation
document.addEventListener('DOMContentLoaded', () => {
    const fab = document.getElementById('cemChatFab');
    setTimeout(() => {
        fab.classList.add('intro');
    }, 2000);

    // Auto-open hint after 5 seconds
    setTimeout(() => {
        if (!cemChat.isOpen) {
            const badge = document.getElementById('cemFabBadge');
            badge.classList.remove('hidden');
        }
    }, 5000);
});

// ===== MOBILE KEYBOARD FIX =====
(function() {
    const chatInput = document.getElementById('cemChatInput');
    if (!chatInput) return;

    chatInput.addEventListener('focus', function() {
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                const body = document.getElementById('cemChatBody');
                body.scrollTop = body.scrollHeight;
            }, 300);
        }
    });

    // Prevent body scroll when chat is open on mobile
    document.getElementById('cemChatWindow').addEventListener('touchmove', function(e) {
        e.stopPropagation();
    }, { passive: true });
})();
