export function HelpTool() {
  return <main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px', fontFamily: 'system-ui', lineHeight: 1.8, overflow: 'auto', height: '100%', boxSizing: 'border-box' }}>
    <h1 style={{ fontSize: 32 }}>Jūsu vietnes redaktors</h1>
    <p>Ikdienas izmaiņām programmētājs nav vajadzīgs. Viss redzamais lapās nāk no šī redaktora. Publicētais saturs atjaunojas vietnē bez atkārtotas izvietošanas.</p>
    <h2>1. Mainīt tekstu vai attēlu</h2><p>“Lapas un dizains” → “Sākumlapa” → atveriet vajadzīgo sadaļu. Aizstājiet tekstu vai augšupielādējiet attēlu. Attēliem var mainīt izgriezumu un svarīgāko vietu (Hotspot).</p>
    <h2>2. Pievienot vai pārkārtot sadaļas</h2><p>Lauka “Lapas sadaļas” beigās spiediet Add item un izvēlieties vajadzīgo bloku. Pārvelciet sadaļas citā secībā. Sadaļas izvēlnē var dublēt un dzēst; “Paslēpt” ļauj to paturēt vēlākam laikam. Cilnē “Izkārtojums un dizains” mainiet fonu un atstarpes.</p>
    <h2>3. Izveidot lapu vai apakšlapu</h2><p>“Lapas un apakšlapas” → +. Ierakstiet nosaukumu un sadaļā “Adrese un apakšlapa” nospiediet Generate. Apakšlapai izvēlieties vecāklapu. Izvēlnes saite jāpievieno atsevišķi kopējos iestatījumos. Iekšējām saitēm izvēlieties “Uz vietnes lapu”, lai tās sekotu adreses maiņai.</p>
    <h2>Raksti</h2><p>Sadaļā “Raksti” saglabāti arī iepriekšējie raksti. To tekstus, attēlus un datumus var mainīt turpat. Publicētie raksti parādās lapā /raksti un tās apakšlapās. “Rakstu saraksts” ir pievienojams arī citās lapās kā sadaļa.</p>
    <h2>4. Mainīt logo, krāsas, galveni vai kājeni</h2><p>“Dizains, logo, izvēlnes un kontakti”. Iestatījumi sadalīti cilnēs. Krāsu var izvēlēties ar krāsu lodziņu. Mainot krāsas, pārbaudiet, vai tekstu joprojām viegli salasīt.</p>
    <h2>5. Pārbaudīt, tad publicēt</h2><p>Atveriet “Priekšskatījums”. Datora un telefona skats parāda arī melnrakstu. Režīmā “Klikšķināt, lai rediģētu” klikšķis uz teksta vai sadaļas atver atbilstošo lauku. Kad viss gatavs, spiediet Publish katram mainītajam dokumentam. Save saglabā melnrakstu, bet vēl nepublicē.</p>
    <h2>Kontaktformas pieteikumi</h2><p>Formas tekstus un pakalpojumus mainiet šeit. Iesniegtos pieteikumus skatiet vietnes /admin panelī; tie paliek Supabase un netiek glabāti publiskajā Sanity dataset. Priekšskatījumā forma nesūta pieteikumus.</p>
    <h2>Bezmaksas plāns</h2><p>Šeit nav maksas spraudņu vai obligātu AI funkciju. Sanity Free lietojuma kvotas jāpārrauga projekta Usage sadaļā. Jauns, līdz šim neparedzēts interaktīvs bloka veids var prasīt vienreizēju programmēšanu; jau pieejamo bloku saturs, secība un dizains ir Jūsu kontrolē.</p>
  </main>;
}
