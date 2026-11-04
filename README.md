# Izaugt mīlestībā

React/Vite vietne ar Vercel hostingu, jūsu Supabase un neatkarīgu Sanity CMS.

Pārcelšanas soļi un datu eksports: [MIGRATION.md](MIGRATION.md).

Lokāli (Node.js 22):

```powershell
npm ci
Copy-Item .env.example .env.local
# Aizpildiet jaunā Supabase URL un publisko atslēgu .env.local.
npm run dev
```

Pārbaudes: `npm run build`, `npm test`, `npm run lint`.
Datubāzes SQL sagatave: `npm run migration:prepare`.
Neievietojiet datu eksportus vai servera slepenās atslēgas GitHub.
