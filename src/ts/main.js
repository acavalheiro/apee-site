// ── Types ──────────────────────────────────────────────────────────────────
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// ── Constants ──────────────────────────────────────────────────────────────
var PAGE_ORDER = {
    home: 0,
    about: 1,
    activities: 2,
    contact: 3,
};
// ── Navigation ─────────────────────────────────────────────────────────────
function navigateTo(pageId) {
    var _a;
    // Hide all pages
    document.querySelectorAll('.page').forEach(function (p) {
        p.classList.remove('active');
    });
    // Show target page
    var target = document.getElementById("page-".concat(pageId));
    if (target)
        target.classList.add('active');
    // Update nav active state
    var navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(function (a) { return a.classList.remove('active'); });
    var activeLink = navLinks[PAGE_ORDER[pageId]];
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
    var nome = (_a = document.getElementById('f-name')) === null || _a === void 0 ? void 0 : _a.value.trim();
    var apelido = (_b = document.getElementById('f-surname')) === null || _b === void 0 ? void 0 : _b.value.trim();
    var email = (_c = document.getElementById('f-email')) === null || _c === void 0 ? void 0 : _c.value.trim();
    var assunto = (_d = document.getElementById('f-subject')) === null || _d === void 0 ? void 0 : _d.value;
    var mensagem = (_e = document.getElementById('f-msg')) === null || _e === void 0 ? void 0 : _e.value.trim();
    if (!nome || !email || !mensagem) {
        alert('Por favor preencha os campos obrigatórios (*).');
        return null;
    }
    return { nome: nome, apelido: apelido, email: email, assunto: assunto, mensagem: mensagem };
}
function showFormSuccess() {
    var fields = document.getElementById('form-fields');
    var success = document.getElementById('form-success');
    if (fields)
        fields.style.display = 'none';
    if (success)
        success.style.display = 'block';
}
function resetForm() {
    var fieldIds = ['f-name', 'f-surname', 'f-email', 'f-subject', 'f-msg'];
    fieldIds.forEach(function (id) {
        var el = document.getElementById(id);
        if (el)
            el.value = '';
    });
    var fields = document.getElementById('form-fields');
    var success = document.getElementById('form-success');
    if (fields)
        fields.style.display = 'block';
    if (success)
        success.style.display = 'none';
}
function submitForm() {
    return __awaiter(this, void 0, void 0, function () {
        var data, btn, error_1, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = getFormData();
                    if (!data)
                        return [2 /*return*/];
                    btn = document.getElementById('submitBtn');
                    if (btn) {
                        btn.disabled = true;
                        btn.textContent = 'A enviar...';
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
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
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 600); })];
                case 2:
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
                    _a.sent();
                    showFormSuccess();
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    message = error_1 instanceof Error ? error_1.message : 'Erro desconhecido.';
                    alert("Erro: ".concat(message, " Por favor tente novamente."));
                    return [3 /*break*/, 5];
                case 4:
                    if (btn) {
                        btn.disabled = false;
                        btn.textContent = 'Enviar Mensagem 🚀';
                    }
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// ── Event Listeners ─────────────────────────────────────────────────────────
function bindEvents() {
    var _a, _b, _c, _d;
    // Nav logo → home
    (_a = document.getElementById('navLogoBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () { return navigateTo('home'); });
    // Nav links
    document.querySelectorAll('.nav-links a[data-page]').forEach(function (link) {
        link.addEventListener('click', function () {
            var page = link.dataset.page;
            if (page)
                navigateTo(page);
        });
    });
    // All [data-goto] buttons (hero, cta, footer, etc.)
    document.querySelectorAll('[data-goto]').forEach(function (el) {
        el.addEventListener('click', function () {
            var page = el.dataset.goto;
            if (page)
                navigateTo(page);
        });
    });
    // Hamburger
    (_b = document.getElementById('hamburgerBtn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', toggleMobileMenu);
    // Contact form submit
    (_c = document.getElementById('submitBtn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function () { return void submitForm(); });
    // Contact form reset
    (_d = document.getElementById('resetBtn')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', resetForm);
}
// ── Init ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    bindEvents();
    navigateTo('home');
});
