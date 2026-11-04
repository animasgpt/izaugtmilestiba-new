# Vietnes rediģēšana Sanity

**Redaktors:** https://izaugtmilestiba-redaktors.sanity.studio/

Izmantojiet to pašu Sanity pieslēgšanos, kurai ir pieeja projektam **Izaugt Mīlestībā** (`vl2g5s69`). Redaktors un izmantotās iespējas neprasa maksas Sanity spraudņus.

## Ikdienas darbs bez koda

| Ko mainīt | Kur redaktorā |
| --- | --- |
| Sākumlapas teksti, attēli un sadaļas | Lapas un dizains → Sākumlapa → Lapas sadaļas |
| Sadaļu secība | Pārvelciet sadaļas citā vietā |
| Jauna sadaļa | Add item → izvēlieties vizuālo sagatavi |
| Dublēt / dzēst sadaļu | Sadaļas izvēlne ar trim punktiem |
| Uz laiku paslēpt sadaļu | Atveriet sadaļu → Paslēpt šo sadaļu |
| Sadaļas fons, atstarpes, platums, līdzinājums | Sadaļā → Izkārtojums un dizains |
| Jauna lapa | Lapas un apakšlapas → + → Lapa |
| Apakšlapa | Lapā → Adrese un apakšlapa → izvēlieties vecāklapu |
| Logo un mazā pārlūka ikona | Dizains, logo, izvēlnes un kontakti → Nosaukums un attēli |
| Izvēlne / apakšizvēlne / galvenes poga | Kopējie iestatījumi → Galvene / izvēlne |
| Kājenes teksts, saites, sociālie tīkli | Kopējie iestatījumi → Kājene |
| Visas vietnes krāsas, fonti, pogu forma | Kopējie iestatījumi → Krāsas un fonti |
| E-pasts, telefons, formas teksti un pakalpojumi | Kopējie iestatījumi → Kontakti un forma |
| Pārlūka cilnes nosaukums, apraksts, kopīgošanas attēls | Katrā lapā → Google un kopīgošana |

Sadaļu katalogā ir **11 veidi**: ievads, teksts, attēls ar tekstu, kartītes/pakalpojumi, galerija, jautājumi un atbildes, atsauksmes, aicinājums/pogas, kontaktforma, skaitļi un brīva vieta. Katru var izmantot vairākas reizes. Telefonam izkārtojums pielāgojas automātiski.

### Jauna lapa un tās adrese

1. Izveidojiet lapu un ierakstiet nosaukumu.
2. Cilnē “Adrese un apakšlapa” spiediet **Generate** adreses laukā.
3. Ja tā ir apakšlapa, izvēlieties vecāklapu. Piemēram: `Konsultācijas` + `Attālināti` veido `/konsultacijas/attalinati`.
4. Pievienojiet sadaļas un spiediet **Publish**.
5. Ja lapai jābūt izvēlnē, pievienojiet saiti kopējos galvenes vai kājenes iestatījumos. Publicējiet arī šos iestatījumus.

Iekšējām saitēm izvēlieties **Uz vietnes lapu**. Tās automātiski sekos vecāklapas vai adreses maiņai. Rakstot pilnu adresi pašrocīgi, šādas izmaiņas saiti automātiski nepārraksta. Dublētas adreses, nederīgi enkuri un vecāklapu cikli tiek pārbaudīti pirms publicēšanas. `/admin`, `/admin-login`, `/studio` un `/api` ir rezervēti.

### Attēli un logo

Izvēlieties attēla lauku → augšupielādējiet failu vai izmantojiet jau augšupielādētu. **Crop** maina izgriezumu, **Hotspot** norāda svarīgāko attēla daļu. Ierakstiet īsu attēla aprakstu. Logo izmērs maināms atsevišķi.

Nav vajadzīga maksas “Media Library” lietotne: tiek lietoti Sanity iebūvētie attēlu lauki un dataset attēlu izvēle.

### Priekšskatījums un publicēšana

Atveriet dokumenta cilni **Priekšskatījums**. Var pārslēgt datoru/telefonu. Režīmā **Klikšķināt, lai rediģētu** klikšķis uz satura atver attiecīgo lauku. Ar Sanity paneļu izvēlnes “Split pane” rediģēšanu un priekšskatījumu var turēt blakus.

Sanity automātiski saglabā melnrakstu. Publiskajā vietnē tas nonāk tikai pēc **Publish**. Ja mainīti vairāki dokumenti, publicējiet katru no tiem. Atvērtā vietne saņem publicētās izmaiņas reāllaikā; koda kompilācija vai hostinga pārlikšana ikdienas saturam nav nepieciešama.

Priekšskatījumā kontaktforma nesūta īstus pieteikumus. Publiskie pieteikumi paliek Supabase un ir apskatāmi `/admin`. Tie netiek kopēti publiskajā Sanity dataset.

## Vienreizējā jaunās vietnes pieslēgšana

**Sanity redaktors jau ir publicēts; publiskajā vietnē jāizvieto šīs repozitorija izmaiņas.** Vecais frontend nepazīst jauno lapu un sadaļu modeli.

Cloudflare Pages izmantojiet:

- Zars: `codex/independent-vercel-migration` (vai `main` pēc PR apvienošanas).
- Build command: `npm run build`.
- Output directory: `dist`.
- Root directory: repo sakne.
- Node: 22.12 vai jaunāks Node 22 izlaidums.
- Mainīgie: jaunā projekta `VITE_SUPABASE_URL` un `VITE_SUPABASE_PUBLISHABLE_KEY`.
- Sanity: `VITE_SANITY_PROJECT_ID=vl2g5s69`, `VITE_SANITY_DATASET=production` un `VITE_SANITY_STUDIO_URL=https://izaugtmilestiba-redaktors.sanity.studio`.

Sanity redaktorā “Google un adreses” laukā **Vietnes gala adrese** ievadiet jaunās vietnes HTTPS adresi un publicējiet. Priekšskatījums to izmantos automātiski; Studio nav jāpārkompilē.

Sanity projekta Manage → API → CORS origins pievienojiet precīzu jaunās vietnes adresi. Publiskajai vietnei credentials nav vajadzīgi; Studio domēnam tie ir vajadzīgi. Nelietojiet vispārīgu `*`. Cloudflare Pages un Vercel esošā konfigurācija nodrošina SPA maršrutēšanu; jāpārbauda arī apakšlapas tieša atvēršana un pārlāde.

Ja vietnes hostings uzstāda `X-Frame-Options: DENY` vai pārāk stingru `frame-ancestors`, atļaujiet Sanity Studio adresi priekšskatījumam. Šī repo konfigurācija šādus aizliegumus neuzstāda.

### Ko jau izdarīju projektā

- Publicēts jaunais Studio redaktors un tā shēmas.
- Pievienota rediģējama sākumlapa un pilna “Par mani” lapa.
- Esošie iestatījumi un cenas saglabāti; trūkstošie lauki papildināti.
- Esošie pieci vietnes attēli ievietoti Sanity, lai tos var aizvietot redaktorā.
- Pirms datu papildināšanas izveidotas lokālas kopijas ignorētajā `backups/` mapē.
- Vecie Supabase satura dati un pieteikumi nav dzēsti. Satura rediģēšanas ceļš tagad ir Sanity.

## Bezmaksas plāna robežas

Tiek izmantoti parastie dokumenti, attēli, Studio shēmas un pielāgots melnrakstu priekšskatījums. Netiek ieslēgti maksas AI rīki, plānota publicēšana, Content Releases vai maksas Media Library. Lietojuma kvotas jāpārrauga Sanity projekta **Usage** sadaļā; bezmaksas plāns nenozīmē neierobežotu trafiku un attēlu apjomu.

Tas ir sadaļu redaktors ar gatavu bloku katalogu. Patvaļīga elementu vilkšana uz jebkuru pikseļa koordinātu vai jauns interaktīvs bloka veids joprojām prasa vienreizēju izstrādi. Esošos blokus, lapas, apakšlapas, attēlus un dizaina iestatījumus var pārvaldīt bez programmēšanas.

Vietne paliek Vite SPA. Lapu SEO metadati mainās pārlūkā; sociālo tīklu roboti, kas neizpilda JavaScript, var izmantot sākotnējos `index.html` datus. Pilnai dinamiskai sociālo saišu priekšskatījumu/SEO servera attēlošanai būtu vajadzīgs atsevišķs hostinga paplašinājums.

## Izstrādātājam / cita Sanity projekta pieslēgšanai

```powershell
npm ci
npm --prefix studio ci
Copy-Item .env.example .env.local
Copy-Item studio/.env.example studio/.env.local
# Aizpildiet savus projekta ID, publiskās Supabase atslēgas un priekšskatījuma adresi.
npm run dev
# Otrā terminālī:
npm run studio:dev
```

Vienreizējā satura ievietošana citā projektā:

```powershell
cd studio
npx sanity login
npm run seed
npm run deploy -- --url JAUNS-REDAKTORA-NOSAUKUMS --yes
```

Mainiet `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`, `SANITY_STUDIO_HOST` un atbilstošos frontend `VITE_*` mainīgos. Cita projekta gadījumā noklusējuma deploy appId netiek izmantots; jaunās izvietošanas ID var norādīt `SANITY_STUDIO_APP_ID`. `SANITY_STUDIO_PREVIEW_URL` ir lokāls rezerves priekšskatījuma URL; publiskajā Studio prioritāte ir dokumenta `siteUrl`.

`seed` saglabā esošos lapu/iestatījumu dokumentus lokālā rezerves failā, izmanto `createIfNotExists` un `setIfMissing`, saglabā esošos melnrakstus un nedzēš dokumentus. Atkārtota palaišana nepārraksta redaktora izmaiņas. Tas nav pilns dataset arhīvs ar visu iepriekšējo attēlu binārajiem failiem; pilnam backup lietojiet Sanity dataset export.

Melnrakstus nolasa tikai autentificētais Studio. Uz iframe tiek nosūtīts priekšskatījuma saturs, nevis Sanity tokens. Frontend pieņem ziņojumus tikai no konfigurētā Studio origin un tā vecāklodziņa. Publiskā datu plūsma izmanto `published` perspektīvu.

Pārbaudes: `npm test`, `npm run typecheck`, `npm run build`, `npm --prefix studio run typecheck`, `npm run studio:build`, `cd studio; npx sanity schemas validate`.

Avoti: [Sanity Free](https://www.sanity.io/pricing), [Studio shēmas](https://www.sanity.io/docs/studio/project-structure), [Sadaļu masīvi](https://www.sanity.io/docs/studio/array-type), [Pielāgoti dokumentu skati](https://www.sanity.io/docs/studio/structure-builder-reference).

## Veiktās pārbaudes

Frontend un Studio produkcijas kompilācija, abas TypeScript pārbaudes un 23 Vitest testi. Sanity shēmu validācijā un trīs ievietoto dokumentu validācijā nav kļūdu vai brīdinājumu. Pārlūkā pārbaudīts reālais publicētais Sanity saturs, mobilā izvēlne un izkārtojums bez horizontālas ritināšanas. Atsevišķā iframe pārbaudīti melnrakstu atjauninājumi, jaunas apakšlapas navigācija, klikšķa avota lauks, sveša origin noraidīšana un formas sūtīšanas bloķēšana priekšskatījumā.

Pilnajā repozitorija lint pārbaudē paliek iepriekšējās 4 kļūdas nemainītajos failos. Jaunajam CMS kodam lint kļūdu nav; ir divi Fast Refresh organizācijas brīdinājumi. Dzīvā kontaktforma ar jaunā Supabase konta atslēgām jāpārbauda pēc hostinga pieslēgšanas.
