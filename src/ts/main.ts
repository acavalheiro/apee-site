// ── src/ts/main.ts ─────────────────────────────────────────────────────────
import { initI18n, t, setLocale, type Locale } from './i18n/i18n';

// ── Types ───────────────────────────────────────────────────────────────────

type PageId = 'home' | 'about' | 'activities' | 'team' | 'contact';

interface ContactFormData {
  firstName:      string;
  lastName:       string;
  email:          string;
  subject:        string;
  message:        string;
  turnstileToken: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
}

interface TurnstileOptions {
  sitekey:             string;
  theme?:              'light' | 'dark' | 'auto';
  language?:           string;
  callback:            (token: string) => void;
  'expired-callback'?: () => void;
  'error-callback'?:   () => void;
}

declare global {
  interface Window {
    turnstile: {
      render:      (container: string | HTMLElement, options: TurnstileOptions) => string;
      reset:       (widgetId: string) => void;
      remove:      (widgetId: string) => void;
      getResponse: (widgetId: string) => string | undefined;
    };
    onTurnstileLoad: () => void;
  }
}

// ── Constants ────────────────────────────────────────────────────────────────

const PAGE_ORDER: Record<PageId, number> = {
  home:       0,
  about:      1,
  activities: 2,
  team:       3,
  contact:    4,
};

const TURNSTILE_SITE_KEY = '1x00000000000000000000AA';

// ── Turnstile ────────────────────────────────────────────────────────────────

let turnstileWidgetId: string | null = null;
let turnstileToken:    string | null = null;
let turnstileReady                   = false;

function initTurnstile(): void {
  const container = document.getElementById('turnstile-container');
  if (!container || !window.turnstile || turnstileWidgetId) return;

  turnstileWidgetId = window.turnstile.render(container, {
    sitekey:  TURNSTILE_SITE_KEY,
    theme:    'light',
    language: document.documentElement.lang ?? 'pt',

    callback: (token: string) => {
      turnstileToken = token;
      turnstileReady = true;
      setTurnstileError(false);
    },
    'expired-callback': () => { turnstileToken = null; turnstileReady = false; },
    'error-callback':   () => { turnstileToken = null; turnstileReady = false; setTurnstileError(true); },
  });
}

function resetTurnstile(): void {
  if (turnstileWidgetId && window.turnstile) window.turnstile.reset(turnstileWidgetId);
  turnstileToken = null;
  turnstileReady = false;
}

function setTurnstileError(show: boolean): void {
  const el = document.getElementById('turnstile-error');
  if (el) el.style.display = show ? 'block' : 'none';
}

window.onTurnstileLoad = (): void => {
  const contactPage = document.getElementById('page-contact');
  if (contactPage?.classList.contains('active')) initTurnstile();
};

// ── Navigation ───────────────────────────────────────────────────────────────

function navigateTo(pageId: PageId): void {
  document.querySelectorAll<HTMLElement>('.page').forEach(p => p.classList.remove('active'));

  const target = document.getElementById(`page-${pageId}`);
  if (target) target.classList.add('active');

  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-links a');
  navLinks.forEach(a => a.classList.remove('active'));
  navLinks[PAGE_ORDER[pageId]]?.classList.add('active');

  document.getElementById('navLinks')?.classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (pageId === 'contact') initTurnstile();
}

function toggleMobileMenu(): void {
  document.getElementById('navLinks')?.classList.toggle('open');
}

// ── Contact Form ─────────────────────────────────────────────────────────────

function getFormData(): ContactFormData | null {
  const firstName = (document.getElementById('f-name')    as HTMLInputElement)?.value.trim();
  const lastName  = (document.getElementById('f-surname') as HTMLInputElement)?.value.trim();
  const email     = (document.getElementById('f-email')   as HTMLInputElement)?.value.trim();
  const subject   = (document.getElementById('f-subject') as HTMLSelectElement)?.value;
  const message   = (document.getElementById('f-msg')     as HTMLTextAreaElement)?.value.trim();

  if (!firstName || !email || !message) {
    alert(t('contact.form.validation.required'));
    return null;
  }

  if (!turnstileReady || !turnstileToken) {
    setTurnstileError(true);
    document.getElementById('turnstile-container')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return null;
  }

  return { firstName, lastName, email, subject, message, turnstileToken };
}

function showFormSuccess(): void {
  const fields  = document.getElementById('form-fields');
  const success = document.getElementById('form-success');
  if (fields)  fields.style.display  = 'none';
  if (success) success.style.display = 'block';
}

function resetForm(): void {
  (['f-name', 'f-surname', 'f-email', 'f-subject', 'f-msg'] as const).forEach(id => {
    const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
    if (el) el.value = '';
  });
  resetTurnstile();
  setTurnstileError(false);
  const fields  = document.getElementById('form-fields');
  const success = document.getElementById('form-success');
  if (fields)  fields.style.display  = 'block';
  if (success) success.style.display = 'none';
}

async function submitForm(): Promise<void> {
  const data = getFormData();
  if (!data) return;

  const btn = document.getElementById('submitBtn') as HTMLButtonElement | null;
  if (btn) { btn.disabled = true; btn.textContent = t('contact.form.sending'); }

  try {
    const response = await fetch('http://localhost:7205/api/contact', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    });

    const result: ApiResponse = await response.json();
    if (!response.ok) throw new Error(result.message ?? t('contact.form.error.generic'));

    showFormSuccess();
  } catch (error) {
    const message = error instanceof Error ? error.message : t('contact.form.error.generic');
    alert(message);
    resetTurnstile();
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = t('contact.form.submit'); }
  }
}

// ── Event Listeners ──────────────────────────────────────────────────────────

function bindEvents(): void {
  document.getElementById('navLogoBtn')
    ?.addEventListener('click', () => navigateTo('home'));

  document.querySelectorAll<HTMLAnchorElement>('.nav-links a[data-page]').forEach(link => {
    link.addEventListener('click', () => {
      const page = link.dataset.page as PageId;
      if (page) navigateTo(page);
    });
  });

  document.querySelectorAll<HTMLElement>('[data-goto]').forEach(el => {
    el.addEventListener('click', () => {
      const page = el.dataset.goto as PageId;
      if (page) navigateTo(page);
    });
  });

  document.getElementById('hamburgerBtn')
    ?.addEventListener('click', toggleMobileMenu);

  document.getElementById('submitBtn')
    ?.addEventListener('click', () => void submitForm());

  document.getElementById('resetBtn')
    ?.addEventListener('click', resetForm);

  // Re-apply translations when locale changes (lang switcher handled by i18n.ts)
  document.addEventListener('localeChanged', () => {
    // Reset Turnstile with new language if on contact page
    if (turnstileWidgetId && window.turnstile) {
      window.turnstile.remove(turnstileWidgetId);
      turnstileWidgetId = null;
      turnstileToken    = null;
      turnstileReady    = false;
      const contactPage = document.getElementById('page-contact');
      if (contactPage?.classList.contains('active')) initTurnstile();
    }
  });
}

// ── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initI18n();   // ← must come first: detects locale + applies translations
  bindEvents();
  navigateTo('home');
});