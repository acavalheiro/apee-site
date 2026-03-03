"use strict";
// ── Types ──────────────────────────────────────────────────────────────────
// ── Constants ──────────────────────────────────────────────────────────────
const PAGE_ORDER = {
    home: 0,
    about: 1,
    team: 2,
    activities: 3,
    contact: 4,
};
const TURNSTILE_SITE_KEY = '0x4AAAAAAClJQZMxeU_-KHD8';
// ── Turnstile State ─────────────────────────────────────────────────────────
let turnstileWidgetId = null;
let turnstileToken = null;
let turnstileReady = false;
function initTurnstile() {
    const container = document.getElementById('turnstile-container');
    if (!container || turnstileWidgetId)
        return;
    turnstileWidgetId = turnstile.render(container, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: 'light',
        language: 'pt',
        callback: (token) => {
            turnstileToken = token;
            turnstileReady = true;
            setTurnstileError(false);
        },
        'expired-callback': () => {
            turnstileToken = null;
            turnstileReady = false;
        },
        'error-callback': () => {
            turnstileToken = null;
            turnstileReady = false;
            setTurnstileError(true);
        },
    });
}
function resetTurnstile() {
    // if (turnstileWidgetId && window.turnstile) {
    //   window.turnstile.reset(turnstileWidgetId);
    // }
    // turnstileToken = null;
    // turnstileReady = false;
}
function setTurnstileError(show) {
    const el = document.getElementById('turnstile-error');
    if (el)
        el.style.display = show ? 'block' : 'none';
}
// ── Navigation ─────────────────────────────────────────────────────────────
function navigateTo(pageId) {
    var _a;
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    // Show target page
    const target = document.getElementById(`page-${pageId}`);
    if (target)
        target.classList.add('active');
    // Update nav active state
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(a => a.classList.remove('active'));
    const activeLink = navLinks[PAGE_ORDER[pageId]];
    if (activeLink)
        activeLink.classList.add('active');
    // Close mobile menu
    (_a = document.getElementById('navLinks')) === null || _a === void 0 ? void 0 : _a.classList.remove('open');
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Lazily init Turnstile the first time the contact page is shown
    if (pageId === 'contact') {
        initTurnstile();
    }
}
function toggleMobileMenu() {
    var _a;
    (_a = document.getElementById('navLinks')) === null || _a === void 0 ? void 0 : _a.classList.toggle('open');
}
// ── Contact Form ────────────────────────────────────────────────────────────
function getFormData() {
    var _a, _b, _c, _d, _e, _f;
    const forename = (_a = document.getElementById('f-name')) === null || _a === void 0 ? void 0 : _a.value.trim();
    const surname = (_b = document.getElementById('f-surname')) === null || _b === void 0 ? void 0 : _b.value.trim();
    const email = (_c = document.getElementById('f-email')) === null || _c === void 0 ? void 0 : _c.value.trim();
    const subject = (_d = document.getElementById('f-subject')) === null || _d === void 0 ? void 0 : _d.value;
    const message = (_e = document.getElementById('f-msg')) === null || _e === void 0 ? void 0 : _e.value.trim();
    if (!forename || !email || !message) {
        alert('Por favor preencha os campos obrigatórios (*).');
        return null;
    }
    if (!turnstileReady || !turnstileToken) {
        setTurnstileError(true);
        (_f = document.getElementById('turnstile-container')) === null || _f === void 0 ? void 0 : _f.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return null;
    }
    return { forename, surname, email, subject, message, turnstileToken };
}
function showFormSuccess() {
    const fields = document.getElementById('form-fields');
    const success = document.getElementById('form-success');
    if (fields)
        fields.style.display = 'none';
    if (success)
        success.style.display = 'block';
}
function resetForm() {
    const fieldIds = ['f-name', 'f-surname', 'f-email', 'f-subject', 'f-msg'];
    fieldIds.forEach(id => {
        const el = document.getElementById(id);
        if (el)
            el.value = '';
    });
    const fields = document.getElementById('form-fields');
    const success = document.getElementById('form-success');
    if (fields)
        fields.style.display = 'block';
    if (success)
        success.style.display = 'none';
}
async function submitForm() {
    const data = getFormData();
    if (!data)
        return;
    const btn = document.getElementById('submitBtn');
    if (btn) {
        btn.disabled = true;
        btn.textContent = 'A enviar...';
    }
    try {
        console.log(JSON.stringify(data));
        // ── FUTURE: Azure Function integration ──────────────────────────────
        // const response = await fetch('/api/contact', {
        //   method:  'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body:    JSON.stringify(data),
        // });
        //
        // if (!response.ok) {
        //   const err: ApiResponse = await response.json();
        //   throw new Error(err.message ?? 'Erro ao enviar mensagem.');
        // }
        // ────────────────────────────────────────────────────────────────────
        // Simulate async for now (remove when API is live)
        await new Promise(resolve => setTimeout(resolve, 600));
        showFormSuccess();
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido.';
        alert(`Erro: ${message} Por favor tente novamente.`);
    }
    finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = 'Enviar Mensagem 🚀';
        }
    }
}
// ── Event Listeners ─────────────────────────────────────────────────────────
function bindEvents() {
    var _a, _b, _c, _d;
    // Nav logo → home
    (_a = document.getElementById('navLogoBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => navigateTo('home'));
    // Nav links
    document.querySelectorAll('.nav-links a[data-page]').forEach(link => {
        link.addEventListener('click', () => {
            const page = link.dataset.page;
            if (page)
                navigateTo(page);
        });
    });
    // All [data-goto] buttons (hero, cta, footer, etc.)
    document.querySelectorAll('[data-goto]').forEach(el => {
        el.addEventListener('click', () => {
            const page = el.dataset.goto;
            if (page)
                navigateTo(page);
        });
    });
    // Hamburger
    (_b = document.getElementById('hamburgerBtn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', toggleMobileMenu);
    // Contact form submit
    (_c = document.getElementById('submitBtn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => void submitForm());
    // Contact form reset
    (_d = document.getElementById('resetBtn')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', resetForm);
}
// ── Init ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    bindEvents();
    navigateTo('home');
});
//# sourceMappingURL=main.js.map