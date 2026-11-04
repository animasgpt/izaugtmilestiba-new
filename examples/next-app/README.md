# Next.js piemērs

`layout.tsx` ir pilns App Router servera layout piemērs kopējo iestatījumu nolasīšanai, atļauto Google Fonts ielādei un CSS mainīgo ievietošanai HTML. Vietnes pašreizējā un izvietotā integrācija ir React/Vite: `src/cms/CmsProvider.tsx`, `CmsPage.tsx`, `CmsSections.tsx` un `content.tsx`.

Lietojot piemēru atsevišķā Next.js projektā, pielāgojiet lokālos importus, pārnesiet `cms/design.ts`, `cms/model.ts`, `cms/normalize.ts`, `src/lib/cmsTheme.ts`, kā arī vietnes bāzes CSS mainīgos no `src/index.css`. Piemērs paredz Node.js servera izpildi un publisku Sanity dataset. `SANITY_PROJECT_ID` / `SANITY_DATASET` ir servera mainīgie; tokeni nav vajadzīgi. `cache: 'no-store'` dod aktuālos publicētos iestatījumus nākamajā lapas pieprasījumā. Esošās atvērtās cilnes reāllaika atjaunināšanai vajadzīgs klienta abonements, kāds jau ieviests React/Vite vietnē.

Next.js saitēm izmantojiet `next/link` adapteri `CmsAnchor` vietā, jo esošais publiskais rendereris izmanto React Router. Next.js piemērs pats par sevi nemaina esošo hostingu vai maršrutētāju.
