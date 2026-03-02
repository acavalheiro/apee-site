"use strict";
// ── Types ──────────────────────────────────────────────────────────────────
// ── Constants ──────────────────────────────────────────────────────────────
const PAGE_ORDER = {
    home: 0,
    about: 1,
    activities: 2,
    contact: 3,
};
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
}
function toggleMobileMenu() {
    var _a;
    (_a = document.getElementById('navLinks')) === null || _a === void 0 ? void 0 : _a.classList.toggle('open');
}
// ── Contact Form ────────────────────────────────────────────────────────────
function getFormData() {
    var _a, _b, _c, _d, _e;
    const nome = (_a = document.getElementById('f-name')) === null || _a === void 0 ? void 0 : _a.value.trim();
    const apelido = (_b = document.getElementById('f-surname')) === null || _b === void 0 ? void 0 : _b.value.trim();
    const email = (_c = document.getElementById('f-email')) === null || _c === void 0 ? void 0 : _c.value.trim();
    const assunto = (_d = document.getElementById('f-subject')) === null || _d === void 0 ? void 0 : _d.value;
    const mensagem = (_e = document.getElementById('f-msg')) === null || _e === void 0 ? void 0 : _e.value.trim();
    if (!nome || !email || !mensagem) {
        alert('Por favor preencha os campos obrigatórios (*).');
        return null;
    }
    return { nome, apelido, email, assunto, mensagem };
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