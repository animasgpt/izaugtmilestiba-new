# Pārcelšana uz savu hostingu un Supabase

Bezmaksas komerciālās vietnes hostingam izmantojiet Cloudflare Pages; aktuālie soļi ir [SANITY.md](SANITY.md). Zemāk saglabāta arī Vercel konfigurācija, ja izmantojat piemērotu maksas plānu. Vercel Hobby nav paredzēts komerciālai vietnei.

## Kas jāpārnes

| Daļa | Pašlaik kodā | Jaunā vide |
| --- | --- | --- |
| Vietne un attēli | React/Vite; attēli repozitorijā | Vercel |
| Kontaktformas pieteikumi | Supabase `contact_submissions` | Jaunais Supabase |
| Rediģējamais saturs | Supabase `site_content` | Jaunais Supabase |
| Lietotāji un lomas | Supabase Auth + `user_roles` | Auth izveido no jauna; lomas sasaista pēc e-pasta |
| Hero teksts un cenas | Sanity `sxvw8jh8`, `production` | Esošais Sanity vai jūsu jaunais Sanity |

Vecā Supabase projekta atsauce: `skrrmbaewrhcfvevamwi`.
Kodā nav Storage vai Edge Functions izsaukumu. Dzīvās DB struktūra, Auth
lietotāju skaits un ārpus koda konfigurēti servisi nav pārbaudīti: Lovable
datubāzes savienotājs pārbaudes laikā atgrieza kļūdu.

## 1. Izveidot jauno datubāzi

1. Vajadzīgajā Supabase kontā izveidojiet **tukšu** projektu, vēlams ES reģionā.
2. SQL Editor izpildiet visu `migration/01-schema.sql` vienā reizē. Tas izveido
   tabulas, lomas, RLS, satura noklusējumus un API atļaujas. Failu atjauno ar
   `npm run migration:prepare`. Paredzēts vienreizējai izpildei tukšā projektā.
   Ja lietojat šo SQL Editor ceļu, papildus nepalaidiet `supabase db push`:
   migrāciju vēsture šajā ceļā netiek ierakstīta.
3. Authentication iestatījumos atspējojiet publisku reģistrēšanos, ja vajadzīgi tikai admini.
4. Authentication → Users izveidojiet veco lomu īpašniekus ar **tiem pašiem
   e-pastiem**, jaunu paroli un apstiprinātu e-pastu. Vecajā SQL Editor sarakstu iegūst ar:

```sql
select u.email, r.role
from public.user_roles r join auth.users u on u.id = r.user_id;
```

Ātrais ceļš nepārnes paroles, sesijas, MFA vai citus Auth profila datus.
Ja ir citi lietotāji vai jāsaglabā paroles/MFA, vispirms izmantojiet pilnu Auth
migrāciju pēc Supabase rezerves kopiju dokumentācijas. Jaunie lietotāju UUID
atšķirsies; imports pārnes lomas uz jaunajiem UUID.

## 2. Pārnest esošos datus

1. Saglabājiet vecās DB rezerves kopiju. Esošo vietni atstājiet darbībā.
2. Vecās DB SQL Editor izpildiet `migration/02-export-source.sql`. Ja Lovable
   Cloud skatā nav SQL Editor, izmantojiet administratīvu DB savienojumu vai
   lūdziet Lovable izpildīt tieši šo lasīšanas vaicājumu un atdot pilnu rezultātu.
   Publiskā frontend atslēga nedod tiesības eksportēt pieteikumus vai Auth lietotājus.
3. Nokopējiet **visu `migration_sql` lauka tekstu**, bez CSV ārējām pēdiņām,
   privātā failā, piemēram, `backups/data.sql`. Beigās jābūt `COMMIT;`, rezultāts
   nedrīkst būt saīsināts. Eksports satur personas datus; neievietojiet to GitHub.
4. Izpildiet šo tekstu jaunā projekta SQL Editor. Ja trūkst Auth lietotāja,
   imports apstāsies un transakcija netiks pabeigta. Izveidojiet lietotāju un atkārtojiet.
5. Abās DB palaidiet `migration/03-verify.sql`. Skaitiem un kontrolsummām jāsakrīt.
   Noklusējuma satura UUID var atšķirties; pārbaude salīdzina satura atslēgas un vērtības.

Imports ir atkārtojams: pieteikumus pievieno pēc ID, saturu atjauno pēc atslēgas,
lomas pievieno pēc e-pasta. Tas nedzēš mērķa rindas un nepārraksta jau esošus
pieteikumus. Izmantojiet pirms īstu lietotāju darba jaunajā vietnē. Tieši pirms
pārslēgšanas veiciet pēdējo eksportu/importu, lai pārnestu pa vidu saņemtos datus.
Lielai DB izmantojiet pilnu dump/restore, nevis vienu SQL Editor rezultāta lauku.

## 3. Pieslēgt Vercel

1. Vercel vajadzīgajā kontā izvēlieties Add New → Project un importējiet
   `animasgpt/izaugtmilestiba-new`. Citam GitHub kontam piešķiriet repo piekļuvi.
   Izvēlieties zaru ar šīm izmaiņām vai vispirms apvienojiet tās `main`.
2. Root Directory: repo sakne. `vercel.json` nosaka Vite, `npm ci`, `npm run build`,
   `dist` un SPA maršrutēšanu; `/studio`, `/admin` un `/admin/content` atver Sanity.
3. Vercel Environment Variables iestatiet:

| Mainīgais | Vērtība |
| --- | --- |
| `VITE_SUPABASE_URL` | Jaunā projekta URL no Supabase Connect/API skata |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Jaunā projekta publishable vai legacy anon key |
| `VITE_SANITY_PROJECT_ID` | `sxvw8jh8` vai jaunā Sanity projekta ID |
| `VITE_SANITY_DATASET` | `production` vai jaunais dataset |

Supabase mainīgie ir obligāti. **Nekad nelieciet `service_role`, DB paroli vai
Sanity rakstīšanas tokenu `VITE_*` mainīgajos:** tie nonāk pārlūkā.
Mainīgie tiek ievietoti build laikā; pēc maiņas veiciet Redeploy. Preview un
Production vidēm izvēlieties apzināti; formas testiem vēlams atsevišķs testa projekts.

4. Izvietojiet sākotnēji uz Vercel piešķirtā domēna.
5. Supabase Auth URL Configuration norādiet gala Site URL un vajadzīgos Redirect URLs.
   Sanity API/CORS iestatījumos pievienojiet Vercel un gala domēnu. Ja Sanity
   pieder citam cilvēkam, vajag viņa piekļuvi vai dataset eksportu/importu jaunā
   projektā; Vercel migrācija Sanity īpašumtiesības nemaina.

## 4. Pārbaudīt un pārslēgt domēnu

- Atveriet sākumlapu, pārbaudiet attēlus, tekstus un cenas no Sanity.
- Nosūtiet marķētu testa pieteikumu; pārbaudiet to jaunajā Supabase.
- Pieslēdzieties `/admin-login` ar jauno paroli, pārbaudiet pieteikumus un satura
  rediģēšanu. Daļa publiskās lapas tekstu jau pašlaik nāk no Sanity vai ir statiski kodā.
- Pārlādējiet tieši `/admin/pieteikumi`; jādarbojas aizsargātajam pieteikumu panelim. `/studio`, `/admin` un `/admin/content` jāatver Sanity redaktors.
- Izrakstieties; privātā logā administrācijai jāprasa pieslēgšanās.
- Pārbaudiet `03-verify.sql` RLS/piekļuves rezultātus un Supabase Security Advisor.
  Publiski nevar lasīt pieteikumus vai lomas.
- Network skatā nedrīkst būt pieprasījumu uz veco
  `skrrmbaewrhcfvevamwi.supabase.co` vai Lovable servisiem.
- Izvēlieties īsu pārslēgšanas logu, īslaicīgi apturiet vecās formas iesniegšanu,
  veiciet pēdējo importu un salīdziniet kontrolsummas.
- Vercel pievienojiet gala domēnu un DNS pārvaldniekā ievadiet tieši Vercel
  norādītos DNS ierakstus. Pārbaudiet arī `www`, HTTPS un galveno domēnu.
- DNS pārejas laikā daļa apmeklētāju vēl lietos veco vietni. Pārbaudiet vecajā DB
  jaunus pieteikumus un atlikušos pārnesiet pēc ID.

## Atgriešanās

Saglabājiet veco Lovable izvietojumu, DB un DNS ierakstus līdz pārbaudes beigām.
Ja vajag, atjaunojiet iepriekšējos DNS ierakstus. Pirms atgriešanās pārnesiet jaunās
vides pieteikumus atpakaļ vai eksportējiet tos atsevišķi: DNS nesinhronizē datus.
Lovable atslēgšanu/dzēšanu veiciet pēc datu saskaņošanas un rezerves kopijas.

## Avoti

- [Vercel: Vite un SPA](https://vercel.com/docs/frameworks/frontend/vite)
- [Lovable: ārējais hostings](https://docs.lovable.dev/tips-tricks/external-deployment-hosting)
- [Supabase: migrācija starp projektiem](https://supabase.com/docs/guides/platform/migrating-within-supabase)

## Sagatavošanas pārbaudes

- Produkcijas kompilācija izdevās ar pārbaudes URL/atslēgu; bez atslēgām build apstājas.
- TypeScript pārbaude un esošais Vitest tests izdevās (testu komplektā ir tikai viens parauga tests).
- PostgreSQL 17 izolētā testa DB: shēmas izveide, latviešu teksts/pēdiņas,
  neesoša Auth lietotāja izraisīta atcelšana, atšķirīgi Auth UUID, atkārtots imports,
  kontrolsummas, anonīmas piekļuves aizliegumi un admina piekļuve pārbaudīti.
  Auth shēma testā bija minimāla imitācija; reālā Supabase Auth un Vercel vēl jāpārbauda jaunajā kontā.
- Pārbaudes darbinātas ar Node 24 šajā datorā; Vercel konfigurācijai norādīts Node 22.
- Pilnā lint pārbaude iziet bez kļūdām. Paliek Fast Refresh brīdinājumi, kas pārbaudi nebloķē.
- `npm ci` ziņo par 28 esošo atkarību ievainojamībām (t.sk. 2 critical).
  Atkarību drošības atjaunināšana jāplāno atsevišķi; šī migrācija tās neatrisina.
