// ── Types ──────────────────────────────────────────────────────────────────

type PageId = 'home' | 'about' | 'activities' | 'contact';

interface ContactFormData {
  nome:      string;
  apelido:   string;
  email:     string;
  assunto:   string;
  mensagem:  string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
}

// ── Constants ──────────────────────────────────────────────────────────────

const PAGE_ORDER: Record<PageId, number> = {
  home:       0,
  about:      1,
  activities: 2,
  contact:    3,
};

// ── Navigation ─────────────────────────────────────────────────────────────

function navigateTo(pageId: PageId): void {
  // Hide all pages
  document.querySelectorAll<HTMLElement>('.page').forEach(p => {
    p.classList.remove('active');
  });

  // Show target page
  const target = document.getElementById(`page-${pageId}`);
  if (target) target.classList.add('active');

  // Update nav active state
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-links a');
  navLinks.forEach(a => a.classList.remove('active'));
  const activeLink = navLinks[PAGE_ORDER[pageId]];
  if (activeLink) activeLink.classList.add('active');

  // Close mobile menu
  document.getElementById('navLinks')?.classList.remove('open');

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu(): void {
  document.getElementById('navLinks')?.classList.toggle('open');
}

// ── Contact Form ────────────────────────────────────────────────────────────

function getFormData(): ContactFormData | null {
  const nome     = (document.getElementById('f-name')    as HTMLInputElement)?.value.trim();
  const apelido  = (document.getElementById('f-surname') as HTMLInputElement)?.value.trim();
  const email    = (document.getElementById('f-email')   as HTMLInputElement)?.value.trim();
  const assunto  = (document.getElementById('f-subject') as HTMLSelectElement)?.value;
  const mensagem = (document.getElementById('f-msg')     as HTMLTextAreaElement)?.value.trim();

  if (!nome || !email || !mensagem) {
    alert('Por favor preencha os campos obrigatórios (*).');
    return null;
  }

  return { nome, apelido, email, assunto, mensagem };
}

function showFormSuccess(): void {
  const fields  = document.getElementById('form-fields');
  const success = document.getElementById('form-success');
  if (fields)  fields.style.display  = 'none';
  if (success) success.style.display = 'block';
}

function resetForm(): void {
  const fieldIds = ['f-name', 'f-surname', 'f-email', 'f-subject', 'f-msg'] as const;
  fieldIds.forEach(id => {
    const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
    if (el) el.value = '';
  });
  const fields  = document.getElementById('form-fields');
  const success = document.getElementById('form-success');
  if (fields)  fields.style.display  = 'block';
  if (success) success.style.display = 'none';
}

async function submitForm(): Promise<void> {
  const data = getFormData();
  if (!data) return;

  const btn = document.getElementById('submitBtn') as HTMLButtonElement | null;
  if (btn) {
    btn.disabled     = true;
    btn.textContent  = 'A enviar...';
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
    await new Promise<void>(resolve => setTimeout(resolve, 600));

    showFormSuccess();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido.';
    alert(`Erro: ${message} Por favor tente novamente.`);
  } finally {
    if (btn) {
      btn.disabled    = false;
      btn.textContent = 'Enviar Mensagem 🚀';
    }
  }
}

// ── Event Listeners ─────────────────────────────────────────────────────────

function bindEvents(): void {
  // Nav logo → home
  document.getElementById('navLogoBtn')?.addEventListener('click', () => navigateTo('home'));

  // Nav links
  document.querySelectorAll<HTMLAnchorElement>('.nav-links a[data-page]').forEach(link => {
    link.addEventListener('click', () => {
      const page = link.dataset.page as PageId;
      if (page) navigateTo(page);
    });
  });

  // All [data-goto] buttons (hero, cta, footer, etc.)
  document.querySelectorAll<HTMLElement>('[data-goto]').forEach(el => {
    el.addEventListener('click', () => {
      const page = el.dataset.goto as PageId;
      if (page) navigateTo(page);
    });
  });

  // Hamburger
  document.getElementById('hamburgerBtn')?.addEventListener('click', toggleMobileMenu);

  // Contact form submit
  document.getElementById('submitBtn')?.addEventListener('click', () => void submitForm());

  // Contact form reset
  document.getElementById('resetBtn')?.addEventListener('click', resetForm);
}

// ── Init ────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  bindEvents();
  navigateTo('home');
});