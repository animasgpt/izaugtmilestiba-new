# Izaugt mīlestībā

React/Vite vietne ar Sanity vadītām lapām, sadaļām un dizainu. Kontaktformas pieteikumi un administrācijas pieslēgšanās glabājas jūsu Supabase projektā. Bezmaksas frontend hostingam izmantojams Cloudflare Pages.

- [Atvērt Sanity redaktoru](https://izaugtmilestiba-sxvw8jh8.sanity.studio/)
- [Lapu rediģēšana, priekšskatījums un pieslēgšana](SANITY.md)
- [Datubāzes pārnešanas instrukcija](MIGRATION.md)

Lokāli (Node.js 22.12+):

```powershell
npm ci
Copy-Item .env.example .env.local
# Aizpildiet Supabase publisko URL/atslēgu un Sanity Studio adresi.
npm run dev
```

Studio izstrādei: `npm --prefix studio ci`, pēc tam `npm run studio:dev`.

Pārbaudes: `npm test`, `npm run typecheck`, `npm run build`.
Datubāzes SQL sagatave: `npm run migration:prepare`.
Datu eksportus un servera slepenās atslēgas GitHub neievietojiet.
