// ── src/ts/i18n/i18n.ts ────────────────────────────────────────────────────
/* eslint-disable @typescript-eslint/no-explicit-any */
import { pt } from './pt';
import { en } from './en';
// ── Config ───────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'atl-locale';
const DEFAULT_LOCALE = 'pt';
const SUPPORTED = ['pt', 'en'];
const LOCALES = { pt, en };
// ── State ────────────────────────────────────────────────────────────────────
let currentLocale = DEFAULT_LOCALE;
// ── Core ─────────────────────────────────────────────────────────────────────
/**
 * Translate a key. Supports interpolation: t('key', { name: 'ATL' })
 * replaces {{name}} in the string.
 */
export function t(key, vars) {
    var _a, _b;
    const translations = LOCALES[currentLocale];
    let value = (_b = (_a = translations[key]) !== null && _a !== void 0 ? _a : LOCALES[DEFAULT_LOCALE][key]) !== null && _b !== void 0 ? _b : key;
    if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
            value = value.replace(new RegExp(`{{${k}}}`, 'g'), v);
        });
    }
    return value;
}
export function getLocale() {
    return currentLocale;
}
export function setLocale(locale) {
    if (!SUPPORTED.includes(locale))
        return;
    currentLocale = locale;
    localStorage.setItem(STORAGE_KEY, locale);
    applyTranslations();
    updateHtmlLang();
    updateLanguageSwitcher();
    document.dispatchEvent(new CustomEvent('localeChanged', { detail: { locale } }));
}
/**
 * Detect locale from: localStorage → browser language → default
 */
export function detectLocale() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored))
        return stored;
    const browser = navigator.language.slice(0, 2);
    if (SUPPORTED.includes(browser))
        return browser;
    return DEFAULT_LOCALE;
}
// ── DOM Application ──────────────────────────────────────────────────────────
/**
 * Walk all elements with [data-i18n] and replace their text/html/attributes.
 *
 * Supported attributes on elements:
 *   data-i18n="key"               → sets element.textContent
 *   data-i18n-html="key"          → sets element.innerHTML (for <br> etc.)
 *   data-i18n-placeholder="key"   → sets input placeholder
 *   data-i18n-aria-label="key"    → sets aria-label
 *   data-i18n-title="key"         → sets title attribute
 */
export function applyTranslations() {
    // Text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        el.textContent = t(key);
    });
    // Inner HTML (allows <br>, <strong>, etc.)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.dataset.i18nHtml;
        el.innerHTML = t(key);
    });
    // Placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        el.placeholder = t(key);
    });
    // aria-label
    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
        const key = el.dataset.i18nAriaLabel;
        el.setAttribute('aria-label', t(key));
    });
    // title
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.dataset.i18nTitle;
        el.setAttribute('title', t(key));
    });
}
function updateHtmlLang() {
    document.documentElement.lang = currentLocale;
}
function updateLanguageSwitcher() {
    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
        const lang = btn.dataset.langBtn;
        btn.classList.toggle('lang-btn--active', lang === currentLocale);
    });
}
// ── Init ─────────────────────────────────────────────────────────────────────
export function initI18n() {
    currentLocale = detectLocale();
    applyTranslations();
    updateHtmlLang();
    updateLanguageSwitcher();
    // Bind language switcher buttons
    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.langBtn;
            setLocale(lang);
        });
    });
}
//# sourceMappingURL=i18n.js.map