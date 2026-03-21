# ATL Pragal — apee-site

Website for ATL Pragal, the free-time program run by the parents' association (APEE) of **EB1/JI nº1 do Pragal**, Almada, Portugal.

Live at: [www.apee-pragal.org](https://www.apee-pragal.org)

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Vanilla TypeScript, esbuild, bilingual PT/EN |
| Backend | Azure Functions v4, .NET 8 (isolated worker) |
| Hosting | Azure Static Web Apps |
| Email | Microsoft Graph API (shared mailbox) |
| Bot protection | Cloudflare Turnstile |

## Project Structure

```
apee-site/
├── src/                        # Static frontend (web root)
│   ├── index.html
│   ├── css/
│   ├── js/                     # Compiled output (main.js)
│   ├── img/
│   └── ts/
│       ├── main.ts             # App entry point
│       └── i18n/
│           ├── i18n.ts         # DOM translation engine
│           ├── pt.ts           # Portuguese strings
│           └── en.ts           # English strings
└── api/Apee/
    ├── Apee.slnx               # Solution file
    ├── Apee.Api/               # Azure Functions host
    │   ├── ContactFunction.cs  # POST /api/contact
    │   └── Program.cs          # DI setup
    └── Apee.Shared/            # Models, interfaces, services
        ├── Captcha/TurnstileService.cs
        └── Email/GraphEmailService.cs
```

## Prerequisites

- [Node.js](https://nodejs.org/) (for frontend tooling)
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Azure Functions Core Tools v4](https://learn.microsoft.com/azure/azure-functions/functions-run-local)

## Frontend Development

```bash
npm install

npm run dev       # watch + local dev server (src/)
npm run watch     # bundle with source maps, watch for changes
npm run build     # type-check + minified production bundle
npm run lint      # type-check only (tsc --noEmit)
```

TypeScript is used **only for type checking** — esbuild handles bundling. Output is written to `src/js/main.js`.

### i18n

Translatable strings live in `src/ts/i18n/pt.ts` and `src/ts/i18n/en.ts` (identical keys, different values). The DOM translation engine (`i18n.ts`) applies them via data attributes:

| Attribute | Purpose |
|---|---|
| `data-i18n` | Text content |
| `data-i18n-html` | Inner HTML |
| `data-i18n-placeholder` | Input placeholder |
| `data-i18n-aria-label` | `aria-label` |
| `data-i18n-title` | `title` attribute |

When adding translatable text, add the key to **both** language files and add the appropriate `data-i18n-*` attribute to the HTML element.

## Backend Development

```bash
cd api/Apee/Apee.Api
func start        # run Azure Functions locally
dotnet build      # build the solution
dotnet test       # run tests
```

Local configuration goes in `api/Apee/Apee.Api/local.settings.json` (git-ignored):

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated",
    "Turnstile__SecretKey": "<your-turnstile-secret>",
    "Turnstile__Url": "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    "Graph__TenantId": "<tenant-id>",
    "Graph__ClientId": "<client-id>",
    "Graph__ClientSecret": "<client-secret>",
    "Graph__SharedMailbox": "contacto@school.pt",
    "Graph__RecipientEmail": "recipient@school.pt"
  }
}
```

### Azure App Registration

The app registration used for Microsoft Graph must have:

- **API permission**: `Mail.Send` (Application, not Delegated)
- Optionally, an `ApplicationAccessPolicy` to restrict sending to the shared mailbox only

## Contact Form Flow

1. User submits the form → frontend POSTs JSON to `/api/contact`
2. `ContactFunction` validates the Turnstile token via Cloudflare's siteverify API
3. On success, sends an email via Microsoft Graph on behalf of the shared mailbox
4. Returns `{ success: bool, message?: string }`

## Deployment

Deployed automatically via **Azure Static Web Apps** on push to `main`. The `src/` directory is the static web root; `api/Apee/Apee.Api` is the serverless API backend. CORS and routing are managed by the platform (`src/staticwebapp.config.json`).
