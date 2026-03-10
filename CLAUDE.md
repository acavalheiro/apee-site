# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Frontend (TypeScript + esbuild)

```bash
npm run build       # Type-check with tsc, then bundle with esbuild (minified)
npm run watch       # Bundle with source maps, watch for changes
npm run dev         # watch + serve src/ (local dev server)
npm run lint        # Type-check only (tsc --noEmit)
```

The TypeScript compiler (`tsc`) is used **only for type checking** — esbuild handles bundling. Output goes to `src/js/main.js`.

### Backend (Azure Functions)

```bash
# From api/Apee/Apee.Api/
func start                    # Run Azure Functions locally (requires Azure Functions Core Tools)
dotnet build                  # Build the solution
dotnet test                   # Run tests (if any)
```

The solution file is `api/Apee/Apee.slnx`. Local settings live in `api/Apee/Apee.Api/local.settings.json` (git-ignored).

## Architecture

### Frontend

Single-page app with no framework. All source is in `src/ts/main.ts`, compiled to `src/js/main.js`.

- **Navigation**: JS-driven SPA — clicking nav links shows/hides `<div class="page" id="page-*">` sections with CSS transitions. No routing library.
- **i18n**: `src/ts/i18n/` — `pt.ts` and `en.ts` export flat key→value objects. `i18n.ts` walks the DOM applying translations via `data-i18n`, `data-i18n-html`, `data-i18n-placeholder`, `data-i18n-aria-label`, and `data-i18n-title` attributes. Locale is persisted to `localStorage`. `TranslationKey` is typed as `keyof typeof pt`, so both language files must have identical keys.
- **Contact form**: Validates client-side, renders a Cloudflare Turnstile widget, then POSTs JSON to `/api/contact`. On success, swaps `#form-fields` for `#form-success`.

### Backend

Azure Functions v4 (.NET 8, isolated worker model). Two projects:

- **`Apee.Shared`** (class library): models, interfaces, and service implementations
  - `Models/`: `ContactRequest`, `TurnstileConfiguration`, `GraphConfiguration`
  - `Interfaces/`: `ICaptchaService`, `IEmailService`
  - `Captcha/TurnstileService.cs`: validates tokens against Cloudflare's siteverify API
  - `Email/GraphEmailService.cs`: sends mail via MS Graph API using client credentials on a shared mailbox
- **`Apee.Api`** (Functions host): `Program.cs` wires DI; `ContactFunction.cs` is the single HTTP trigger at `POST /api/contact`

### Deployment

Azure Static Web Apps. The frontend (`src/`) is the static root; the Azure Functions API (`api/Apee/Apee.Api`) is the serverless backend. CORS and routing are handled by the platform.

## i18n Conventions

When adding translatable text:
1. Add the key+value to **both** `src/ts/i18n/pt.ts` and `src/ts/i18n/en.ts`.
2. Add `data-i18n="your.key"` (or the appropriate variant) to the HTML element.
3. Static content that has no English variant (e.g., team member bios) can be left without `data-i18n` — it won't be translated.
