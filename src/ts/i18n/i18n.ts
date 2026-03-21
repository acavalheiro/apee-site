// ── src/ts/i18n/i18n.ts ────────────────────────────────────────────────────
/* eslint-disable @typescript-eslint/no-explicit-any */

import { pt } from './pt';
import { en } from './en';

// ── Types ───────────────────────────────────────────────────────────────────

export type Locale = 'pt' | 'en';

// All keys are required in both language files — TypeScript enforces this
export type TranslationKey = keyof typeof pt;
export type Translations   = Record<string, string>;

// ── Config ───────────────────────────────────────────────────────────────────

const STORAGE_KEY    = 'atl-locale';
const DEFAULT_LOCALE: Locale = 'pt';
const SUPPORTED: Locale[]    = ['pt', 'en'];

const LOCALES: Record<Locale, Translations> = { pt, en };

// ── State ────────────────────────────────────────────────────────────────────

let currentLocale: Locale = DEFAULT_LOCALE;

// ── Core ─────────────────────────────────────────────────────────────────────

/**
 * Translate a key. Supports interpolation: t('key', { name: 'ATL' })
 * replaces {{name}} in the string.
 */
export function t(key: string, vars?: Record<string, string>): string {
  const translations = LOCALES[currentLocale];
  let value = translations[key] ?? LOCALES[DEFAULT_LOCALE][key] ?? key;

  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      value = value.replace(new RegExp(`{{${k}}}`, 'g'), v);
    });
  }

  return value;
}

export function getLocale(): Locale {
  return currentLocale;
}

export function setLocale(locale: Locale): void {
  if (!SUPPORTED.includes(locale)) return;
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
export function detectLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
  if (stored && SUPPORTED.includes(stored)) return stored;

  const browser = navigator.language.slice(0, 2) as Locale;
  if (SUPPORTED.includes(browser)) return browser;

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
export function applyTranslations(): void {
  // Text content
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n!;
    el.textContent = t(key);
  });

  // Inner HTML (allows <br>, <strong>, etc.)
  document.querySelectorAll<HTMLElement>('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml!;
    el.innerHTML = t(key);
  });

  // Placeholder
  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
    '[data-i18n-placeholder]'
  ).forEach(el => {
    const key = (el as HTMLElement).dataset.i18nPlaceholder!;
    el.placeholder = t(key);
  });

  // aria-label
  document.querySelectorAll<HTMLElement>('[data-i18n-aria-label]').forEach(el => {
    const key = el.dataset.i18nAriaLabel!;
    el.setAttribute('aria-label', t(key));
  });

  // title
  document.querySelectorAll<HTMLElement>('[data-i18n-title]').forEach(el => {
    const key = el.dataset.i18nTitle!;
    el.setAttribute('title', t(key));
  });
}

function updateHtmlLang(): void {
  document.documentElement.lang = currentLocale;
}

function updateLanguageSwitcher(): void {
  document.querySelectorAll<HTMLElement>('[data-lang-btn]').forEach(btn => {
    const lang = btn.dataset.langBtn as Locale;
    btn.classList.toggle('lang-btn--active', lang === currentLocale);
  });
}

// ── Init ─────────────────────────────────────────────────────────────────────

export function initI18n(): void {
  currentLocale = detectLocale();
  applyTranslations();
  updateHtmlLang();
  updateLanguageSwitcher();

  // Bind language switcher buttons
  document.querySelectorAll<HTMLElement>('[data-lang-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.langBtn as Locale;
      setLocale(lang);
    });
  });
}
