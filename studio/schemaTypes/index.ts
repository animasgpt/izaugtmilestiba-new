import { defineArrayMember, defineField, defineType, type FieldDefinition, type SchemaTypeDefinition } from 'sanity';
import { ColorInput } from '../components/ColorInput';
import { pagePath } from '../../cms/routing';
import type { CmsPage } from '../../cms/model';

const apiVersion = '2026-09-10';
const string = (name: string, title: string) => defineField({ name, title, type: 'string' });
const rich = (name = 'body', title = 'Teksts') => defineField({ name, title, type: 'richText' });
const image = (name = 'image', title = 'Attēls') => defineField({ name, title, type: 'siteImage' });
const links = (name = 'buttons', title = 'Pogas') => defineField({ name, title, type: 'array', of: [{ type: 'cmsLink' }] });
const color = (name: string, title: string) => defineField({ name, title, type: 'string', components: { input: ColorInput },
  description: 'Izvēlieties krāsu vai ierakstiet HEX kodu. Izdzēšot vērtību, atjaunosies sākotnējā krāsa.',
  validation: rule => rule.regex(/^#[\da-f]{6}$/i, { name: 'HEX krāsa (#RRGGBB)' }) });
const choices = (name: string, title: string, values: { title: string; value: string }[]) => defineField({ name, title, type: 'string', options: { list: values, layout: 'radio' } });
const groupFields = (fields: FieldDefinition[], group: string) => fields.map(field => ({ ...field, group }));
const columns = defineField({ name: 'columns', title: 'Kolonnu skaits datorā', type: 'number', initialValue: 3,
  options: { list: [{ title: 'Viena', value: 1 }, { title: 'Divas', value: 2 }, { title: 'Trīs', value: 3 }, { title: 'Četras', value: 4 }] },
  description: 'Telefonā izkārtojums pielāgojas automātiski.' });
const href = defineField({ name: 'href', title: 'Adrese', type: 'string', description: 'Piemēri: https://…, /kontakti, /#contact, mailto:…, tel:+371…',
  validation: rule => rule.custom(value => !value || /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i.test(value) && !/[\s\\]/.test(value) || 'Izmantojiet drošu tīmekļa, e-pasta, tālruņa vai iekšējo adresi.') });
const cmsLink = defineType({ name: 'cmsLink', title: 'Saite vai poga', type: 'object', fields: [
  defineField({ name: 'label', title: 'Redzamais nosaukums', type: 'string', validation: rule => rule.required() }),
  choices('kind', 'Kur ved saite?', [{ title: 'Uz vietnes lapu', value: 'page' }, { title: 'Uz adresi / ārēju vietni', value: 'url' }, { title: 'Uz sākumlapas sadaļu', value: 'anchor' }]),
  defineField({ name: 'page', title: 'Lapa', type: 'reference', to: [{ type: 'page' }], hidden: ({ parent }) => parent?.kind !== 'page',
    validation: rule => rule.custom((value, context) => (context.parent as { kind?: string })?.kind === 'page' && !value?._ref ? 'Izvēlieties lapu.' : true) }),
  { ...href, hidden: ({ parent }: { parent?: { kind?: string } }) => !!parent?.kind && parent.kind !== 'url',
    validation: rule => rule.custom((value, context) => {
      const kind = (context.parent as { kind?: string })?.kind;
      const text = typeof value === 'string' ? value : '';
      return kind === 'url' && !text ? 'Ievadiet adresi.' : !text || /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i.test(text) && !/[\s\\]/.test(text) || 'Nederīga adrese.';
    }) },
  defineField({ name: 'anchor', title: 'Sadaļas enkurs', type: 'string', description: 'Sadaļas iestatījumos ierakstītais enkurs, piemēram, contact. Bez #.', hidden: ({ parent }) => parent?.kind === 'url',
    validation: rule => rule.regex(/^[a-z][a-z0-9-]*$/, { name: 'enkurs bez atstarpēm' }) }),
  choices('variant', 'Pogas izskats', [{ title: 'Galvenā krāsa', value: 'primary' }, { title: 'Otrā krāsa', value: 'secondary' }, { title: 'Tikai kontūra', value: 'outline' }]),
  defineField({ name: 'newTab', title: 'Atvērt jaunā cilnē', type: 'boolean', initialValue: false }),
], initialValue: { kind: 'url', variant: 'primary' }, preview: { select: { title: 'label', subtitle: 'href' } } });
const navigationLink = defineType({ name: 'navigationLink', title: 'Izvēlnes saite', type: 'object', fields: [
  ...cmsLink.fields!, links('children', 'Apakšizvēlne'),
], preview: { select: { title: 'label', subtitle: 'href' } } });
const siteImage = defineType({ name: 'siteImage', title: 'Attēls', type: 'image', options: { hotspot: true }, fields: [
  defineField({ name: 'alt', title: 'Attēla apraksts', type: 'string', description: 'Īss apraksts cilvēkiem, kuri attēlu neredz, un meklētājiem.', validation: rule => rule.required().warning('Pievienojiet aprakstu pieejamībai.') }),
  string('caption', 'Paraksts zem attēla (galerijā)'),
], description: 'Augšupielādējiet jaunu attēlu vai izvēlieties jau augšupielādētu. Ar Crop / Hotspot nosakiet redzamo daļu.' });
const richText = defineType({ name: 'richText', title: 'Formatēts teksts', type: 'array', of: [defineArrayMember({ type: 'block',
  styles: [{ title: 'Paragrāfs', value: 'normal' }, { title: 'Apakšvirsraksts', value: 'h2' }, { title: 'Mazs virsraksts', value: 'h3' }, { title: 'Citāts', value: 'blockquote' }],
  lists: [{ title: 'Punkti', value: 'bullet' }, { title: 'Numurēts saraksts', value: 'number' }],
  marks: { decorators: [{ title: 'Treknraksts', value: 'strong' }, { title: 'Slīpraksts', value: 'em' }, { title: 'Pasvītrots', value: 'underline' }],
    annotations: [{ name: 'link', title: 'Saite', type: 'object', fields: [href] }] },
})] });
const sectionStyle = defineType({ name: 'sectionStyle', title: 'Sadaļas dizains', type: 'object', fields: [
  choices('background', 'Fons', [{ title: 'Lapas fons', value: 'background' }, { title: 'Gaišais fons', value: 'card' }, { title: 'Akcenta fons', value: 'accent' }, { title: 'Galvenā krāsa', value: 'primary' }, { title: 'Izvēlēties krāsu', value: 'custom' }]),
  { ...color('backgroundColor', 'Sadaļas fona krāsa'), hidden: ({ parent }) => parent?.background !== 'custom' },
  color('textColor', 'Sadaļas teksta krāsa'),
  choices('padding', 'Brīvā vieta virs un zem', [{ title: 'Mazāk', value: 'small' }, { title: 'Vidēji', value: 'medium' }, { title: 'Vairāk', value: 'large' }]),
  choices('width', 'Satura platums', [{ title: 'Šaurs — lasīšanai', value: 'narrow' }, { title: 'Standarta', value: 'normal' }, { title: 'Plašs', value: 'wide' }]),
  choices('align', 'Teksta līdzinājums', [{ title: 'Pa kreisi', value: 'left' }, { title: 'Centrā', value: 'center' }]),
] });
const contentCard = defineType({ name: 'contentCard', title: 'Kartīte', type: 'object', fields: [string('title', 'Nosaukums'), defineField({ name: 'text', title: 'Īss apraksts', type: 'text', rows: 3 }), rich(), image(), string('price', 'Cena vai papildu izcēlums'), defineField({ name: 'link', title: 'Poga', type: 'cmsLink' })], preview: { select: { title: 'title', media: 'image', subtitle: 'price' } } });
const galleryItem = defineType({ name: 'galleryItem', title: 'Galerijas attēls', type: 'object', fields: [image(), string('title', 'Attēla paraksts')], preview: { select: { title: 'title', media: 'image' } } });
const faqItem = defineType({ name: 'faqItem', title: 'Jautājums un atbilde', type: 'object', fields: [string('title', 'Jautājums'), rich('body', 'Atbilde')], preview: { select: { title: 'title' } } });
const testimonial = defineType({ name: 'testimonial', title: 'Atsauksme', type: 'object', fields: [defineField({ name: 'text', title: 'Atsauksmes teksts', type: 'text', rows: 4 }), string('author', 'Autors'), string('role', 'Papildu apraksts'), image()], preview: { select: { title: 'author', subtitle: 'text', media: 'image' } } });
const statistic = defineType({ name: 'statistic', title: 'Skaitlis', type: 'object', fields: [string('value', 'Skaitlis vai vērtība'), string('title', 'Paskaidrojums')], preview: { select: { title: 'value', subtitle: 'title' } } });
const contactSettings = defineType({ name: 'contactSettings', title: 'Kontaktformas iestatījumi', type: 'object', fields: [
  ...['name:Vārda lauka nosaukums', 'email:E-pasta lauka nosaukums', 'phone:Telefona lauka nosaukums', 'message:Ziņojuma lauka nosaukums', 'service:Pakalpojuma lauka nosaukums', 'submit:Pogas teksts'].map(item => { const [name, title] = item.split(':'); return string(name + 'Label', title); }),
  defineField({ name: 'successMessage', title: 'Paziņojums pēc veiksmīgas nosūtīšanas', type: 'text', rows: 2 }),
  defineField({ name: 'errorMessage', title: 'Paziņojums nosūtīšanas kļūdas gadījumā', type: 'text', rows: 2 }),
  defineField({ name: 'services', title: 'Pakalpojumi formas izvēlnē', type: 'array', of: [{ type: 'object', name: 'formService', title: 'Pakalpojums', fields: [string('title', 'Redzamais nosaukums'), defineField({ name: 'value', title: 'Identifikators', type: 'string', description: 'Piemēram, konsultacija. Nemainiet, ja šis pakalpojums jau lietots pieteikumos.', validation: rule => rule.required().regex(/^[a-z0-9-]+$/) })], preview: { select: { title: 'title' } } }] }),
  defineField({ name: 'consentText', title: 'Piekrišanas izvēles rūtiņas teksts', type: 'text', rows: 2 }),
  defineField({ name: 'requireConsent', title: 'Piekrišana obligāta', type: 'boolean', description: 'Ja ieslēgts, aizpildiet arī piekrišanas tekstu. Rūtiņa pārbauda formu pārlūkā; atsevišķs piekrišanas audita ieraksts netiek glabāts.' }),
  defineField({ name: 'privacyLink', title: 'Privātuma politikas saite', type: 'cmsLink' }),
], validation: rule => rule.custom(value => value?.requireConsent && !value.consentText ? 'Obligātai piekrišanai vajadzīgs redzamais teksts.' : true) });
const commonSectionFields: FieldDefinition[] = [
  defineField({ name: 'label', title: 'Sadaļas nosaukums redaktorā', type: 'string', group: 'content', description: 'Tikai Jūsu ērtībai. Nav redzams publiskajā lapā.' }),
  defineField({ name: 'anchor', title: 'Enkurs / sadaļas adrese', type: 'string', group: 'content', description: 'Piemēram, contact. Var izmantot izvēlnēs un pogās. Vienā lapā nedrīkst atkārtoties.', validation: rule => rule.regex(/^[a-z][a-z0-9-]*$/) }),
  defineField({ name: 'hidden', title: 'Paslēpt šo sadaļu', type: 'boolean', group: 'content', initialValue: false }),
  defineField({ name: 'style', title: 'Dizains un atstarpes', type: 'sectionStyle', group: 'layout' }),
];
const introFields = [string('eyebrow', 'Mazais ievadteksts'), string('title', 'Virsraksts'), defineField({ name: 'subtitle', title: 'Apakšvirsraksts', type: 'text', rows: 2 }), rich()];
function section(name: string, title: string, fields: FieldDefinition[]) {
  return defineType({ name, title, type: 'object', groups: [{ name: 'content', title: 'Saturs', default: true }, { name: 'layout', title: 'Izkārtojums un dizains' }],
    fields: [...commonSectionFields, ...groupFields(fields, 'content')],
    initialValue: { style: { background: 'background', padding: 'large', width: 'normal', align: 'left' } },
    preview: { select: { label: 'label', title: 'title', hidden: 'hidden', media: 'image' }, prepare: ({ label, title: heading, hidden, media }) => ({ title: `${hidden ? '🙈 ' : ''}${label || heading || title}`, subtitle: title, media }) },
  });
}
const itemArray = (type: string, title: string) => defineField({ name: 'items', title, type: 'array', of: [{ type }] });
const imagePosition = choices('imagePosition', 'Kur atrodas attēls?', [{ title: 'Pa kreisi', value: 'left' }, { title: 'Pa labi', value: 'right' }]);
const sections = [
  section('heroSection', 'Ievads / lielais virsraksts', [...introFields, image(), choices('layout', 'Izkārtojums', [{ title: 'Teksts un attēls blakus', value: 'split' }, { title: 'Viss centrā', value: 'center' }, { title: 'Attēls fonā', value: 'background' }]), imagePosition, links()]),
  section('textSection', 'Teksts', [...introFields, links()]),
  section('imageTextSection', 'Attēls un teksts', [...introFields, image(), imagePosition, choices('imageFit', 'Attēla aizpildījums', [{ title: 'Aizpildīt laukumu', value: 'cover' }, { title: 'Rādīt visu attēlu', value: 'contain' }]), links()]),
  section('cardsSection', 'Pakalpojumi / kartītes', [...introFields, itemArray('contentCard', 'Kartītes — pārvelciet, lai mainītu secību'), columns, links()]),
  section('gallerySection', 'Attēlu galerija', [...introFields, itemArray('galleryItem', 'Attēli — pārvelciet, lai mainītu secību'), columns, choices('imageRatio', 'Attēlu proporcijas', [{ title: 'Horizontāli', value: 'landscape' }, { title: 'Kvadrāti', value: 'square' }, { title: 'Vertikāli', value: 'portrait' }])]),
  section('faqSection', 'Jautājumi un atbildes', [...introFields, itemArray('faqItem', 'Jautājumi')]),
  section('testimonialsSection', 'Atsauksmes', [...introFields, itemArray('testimonial', 'Atsauksmes'), columns]),
  section('ctaSection', 'Aicinājums / pogas', [...introFields, links()]),
  section('contactSection', 'Kontaktforma', [...introFields, defineField({ name: 'contact', title: 'Tikai šīs formas iestatījumi', type: 'contactSettings', description: 'Ja neaizpildāt, lieto kopējos kontaktformas iestatījumus.' })]),
  section('statsSection', 'Skaitļi un sasniegumi', [...introFields, itemArray('statistic', 'Skaitļi'), columns]),
  section('articleListSection', 'Rakstu saraksts', [...introFields, columns, string('articleLinkLabel', 'Raksta pogas teksts')]),
  section('spacerSection', 'Brīva vieta', [defineField({ name: 'height', title: 'Augstums (pikseļos)', type: 'number', initialValue: 48, validation: rule => rule.min(0).max(240) })]),
];
const seo = defineType({ name: 'seoSettings', title: 'Meklētāji un kopīgošana', type: 'object', fields: [string('title', 'Virsraksts pārlūka cilnē / Google'), defineField({ name: 'description', title: 'Apraksts', type: 'text', rows: 3, validation: rule => rule.max(180).warning('Ieteicams līdz 180 zīmēm.') }), image('image', 'Attēls kopīgošanai'), defineField({ name: 'noIndex', title: 'Nerādīt lapu meklētājos', type: 'boolean', description: 'Lapa joprojām būs publiski pieejama pēc adreses. Šis iestatījums neierobežo piekļuvi.' })] });
const page = defineType({ name: 'page', title: 'Lapa', type: 'document', groups: [{ name: 'content', title: 'Saturs', default: true }, { name: 'address', title: 'Adrese un apakšlapa' }, { name: 'seo', title: 'Google un kopīgošana' }], fields: [
  defineField({ name: 'title', title: 'Lapas nosaukums', type: 'string', group: 'content', validation: rule => rule.required() }),
  defineField({ name: 'slug', title: 'Adreses pēdējā daļa', type: 'slug', group: 'address', description: 'Nospiediet Generate vai ierakstiet, piemēram, konsultacijas. Adresi veido no vecāklapas un šīs daļas.',
    hidden: ({ document }) => document?._id?.replace(/^drafts\./, '') === 'page-home',
    options: { isUnique: () => true, source: 'title', slugify: input => input.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') },
    validation: rule => rule.custom((value, context) => context.document?._id?.replace(/^drafts\./, '') === 'page-home' || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value?.current || '') || 'Ievadiet adresi vai nospiediet Generate.') }),
  defineField({ name: 'parent', title: 'Vecāklapa (apakšlapām)', type: 'reference', to: [{ type: 'page' }], group: 'address', description: 'Atstājiet tukšu galvenā līmeņa lapai. Piemērs: Konsultācijas → Attālināti dod /konsultacijas/attalinati.',
    hidden: ({ document }) => document?._id?.replace(/^drafts\./, '') === 'page-home', options: { filter: ({ document }) => ({ filter: '!(_id in [$id, $draft])', params: { id: document._id.replace(/^drafts\./, ''), draft: 'drafts.' + document._id.replace(/^drafts\./, '') } }) } }),
  defineField({ name: 'sections', title: 'Lapas sadaļas', description: 'Pievienojiet sadaļu, dublējiet to vai pārvelciet citā vietā. Katras sadaļas cilnē ir dizaina iestatījumi.', type: 'array', group: 'content', of: sections.map(s => ({ type: s.name })),
    options: { insertMenu: { filter: true, views: [{ name: 'grid', previewImageUrl: type => `/static/blocks/${type}.svg` }, { name: 'list' }] } },
    validation: rule => rule.custom(value => { const anchors = (value || []).map(s => (s as { anchor?: string }).anchor).filter(Boolean); return new Set(anchors).size === anchors.length || 'Divām sadaļām ir vienāds enkurs. Mainiet vienu no tiem.'; }) }),
  defineField({ name: 'seo', title: 'Google un kopīgošana', type: 'seoSettings', group: 'seo' }),
  defineField({ name: 'hideHeader', title: 'Paslēpt galveni šajā lapā', type: 'boolean', group: 'content' }),
  defineField({ name: 'hideFooter', title: 'Paslēpt kājeni šajā lapā', type: 'boolean', group: 'content' }),
], preview: { select: { title: 'title', slug: 'slug.current' }, prepare: ({ title, slug }) => ({ title, subtitle: slug ? '/' + slug : 'Sākumlapa' }) },
  validation: rule => rule.custom(async (document, context) => {
    if (!document || document._id?.replace(/^drafts\./, '') === 'page-home') return true;
    const current = { ...document, _id: document._id.replace(/^drafts\./, '') } as unknown as CmsPage;
    const pages = await context.getClient({ apiVersion }).fetch<CmsPage[]>('*[_type == "page"]{_id,title,slug,parent}', {}, { perspective: 'drafts' });
    const all = [...pages.map(p => ({ ...p, _id: p._id.replace(/^drafts\./, '') })).filter(p => p._id !== current._id), current];
    const path = pagePath(current, all);
    if (!path) return 'Lapas adrese nav derīga: pārbaudiet adreses daļu un vecāklapas. Lapas nedrīkst atsaukties viena uz otru aplī.';
    if (/^\/(admin|admin-login|studio|api)(\/|$)/.test(path)) return 'Šī adrese rezervēta administrācijai. Izvēlieties citu.';
    if (all.some(p => p._id !== current._id && pagePath(p, all) === path)) return 'Šāda pilnā adrese jau ir citai lapai.';
    return true;
  }),
});
const themeFields = [color('background', 'Lapas fons'), color('foreground', 'Pamatteksts'), color('primary', 'Galvenā krāsa / galvenās pogas'), color('primaryForeground', 'Teksts uz galvenās krāsas'), color('secondary', 'Otrā krāsa / otrās pogas'), color('secondaryForeground', 'Teksts uz otrās krāsas'), color('card', 'Kartīšu un gaišo sadaļu fons'), color('accent', 'Akcenta fons'), color('border', 'Līnijas un lauku apmales'),
  choices('headingFont', 'Virsrakstu fonts', ['Playfair Display','Lato','Georgia','Arial','Source Code Pro'].map(value => ({ title: value, value }))),
  choices('bodyFont', 'Teksta fonts', ['Lato','Playfair Display','Georgia','Arial','Source Code Pro'].map(value => ({ title: value, value }))),
  defineField({ name: 'radius', title: 'Stūru noapaļojums (px)', type: 'number', validation: rule => rule.min(0).max(40) }),
  defineField({ name: 'contentWidth', title: 'Satura maksimālais platums (px)', type: 'number', validation: rule => rule.min(720).max(1600) }),
  choices('buttonStyle', 'Pogu forma', [{ title: 'Noapaļota', value: 'rounded' }, { title: 'Ovāla', value: 'pill' }, { title: 'Taisni stūri', value: 'square' }]),
];
const siteSettings = defineType({ name: 'siteSettings', title: 'Vietnes iestatījumi', type: 'document', groups: [
  { name: 'brand', title: 'Nosaukums un attēli', default: true }, { name: 'header', title: 'Galvene / izvēlne' }, { name: 'footer', title: 'Kājene' }, { name: 'design', title: 'Krāsas un fonti' }, { name: 'contact', title: 'Kontakti un forma' }, { name: 'seo', title: 'Google un adreses' }, { name: 'legacy', title: 'Iepriekšējie dati' },
], fields: [
  { ...string('title', 'Vietnes nosaukums'), group: 'brand' }, { ...image('logo', 'Logo'), group: 'brand' }, { ...image('favicon', 'Mazā pārlūka ikona'), group: 'brand' },
  defineField({ name: 'logoWidth', title: 'Logo platums (px)', type: 'number', group: 'brand', validation: rule => rule.min(24).max(260) }),
  defineField({ name: 'showTitle', title: 'Rādīt nosaukumu blakus logo', type: 'boolean', group: 'brand', initialValue: true }),
  defineField({ name: 'header', title: 'Galvene un izvēlne', type: 'object', group: 'header', fields: [
    color('backgroundColor', 'Galvenes fons'), color('textColor', 'Galvenes teksta krāsa'),
    choices('layout', 'Izkārtojums', [{ title: 'Logo pa kreisi, izvēlne pa labi', value: 'left' }, { title: 'Logo un izvēlne centrā', value: 'center' }]),
    defineField({ name: 'sticky', title: 'Galvene paliek ekrāna augšā ritinot', type: 'boolean', initialValue: true }),
    defineField({ name: 'navigation', title: 'Izvēlnes saites', type: 'array', of: [{ type: 'navigationLink' }], description: 'Pārvelciet saites, lai mainītu secību. Apakšizvēlni pievieno pašā saitē.' }),
    defineField({ name: 'button', title: 'Izcelta poga galvenē', type: 'cmsLink' }),
  ] }),
  defineField({ name: 'footer', title: 'Kājene', type: 'object', group: 'footer', fields: [color('backgroundColor', 'Kājenes fons'), color('textColor', 'Kājenes teksta krāsa'), defineField({ name: 'showTitle', title: 'Rādīt virsrakstu kājenē', type: 'boolean', initialValue: true }), string('title', 'Virsraksts'), defineField({ name: 'text', title: 'Apraksts', type: 'text', rows: 3 }), image('logo', 'Cits logo kājenei'), defineField({ name: 'showLogo', title: 'Rādīt logo kājenē', type: 'boolean' }),
    defineField({ name: 'copyright', title: 'Autortiesību teksts', type: 'string', description: 'Lietojiet {year}, lai gads mainītos automātiski.' }),
    defineField({ name: 'columns', title: 'Saišu kolonnas', type: 'array', of: [{ type: 'object', name: 'footerColumn', title: 'Kolonna', fields: [string('title', 'Kolonnas virsraksts'), links('links', 'Saites')], preview: { select: { title: 'title' } } }] }), links('socialLinks', 'Sociālie tīkli un papildu saites'),
  ] }),
  defineField({ name: 'theme', title: 'Vietnes dizains', type: 'object', group: 'design', fields: themeFields }),
  { ...string('email', 'Publiskais e-pasts'), group: 'contact' }, { ...string('phone', 'Publiskais tālrunis'), group: 'contact' },
  defineField({ name: 'contact', title: 'Visu kontaktformu noklusētie teksti', type: 'contactSettings', group: 'contact' }),
  defineField({ name: 'siteUrl', title: 'Vietnes gala adrese', type: 'url', group: 'seo', description: 'Piemēram, https://www.izaugtmilestiba.lv. Vajadzīga kopīgošanai un meklētājiem.' }),
  defineField({ name: 'studioUrl', title: 'Redaktora adrese', type: 'url', group: 'seo', readOnly: true }),
  defineField({ name: 'seo', title: 'Noklusējuma Google un kopīgošanas dati', type: 'seoSettings', group: 'seo' }),
  defineField({ name: 'builderVersion', title: 'Redaktora versija', type: 'number', hidden: true, readOnly: true }),
  ...['heroTitle','intro','inPersonPrice','onlinePrice','journalPrice'].map(name => ({ ...string(name, name), group: 'legacy', readOnly: true, description: 'Saglabāts migrācijai. Jaunos tekstus un cenas mainiet attiecīgajā lapas sadaļā.' })),
], preview: { prepare: () => ({ title: 'Izaugt mīlestībā — kopējie iestatījumi' }) } });

const article = defineType({ name: 'article', title: 'Raksts', type: 'document', fields: [
  defineField({ name: 'title', title: 'Virsraksts', type: 'string', validation: rule => rule.required() }),
  defineField({ name: 'slug', title: 'Adrese', type: 'slug', options: { source: 'title', isUnique: () => true } }),
  defineField({ name: 'excerpt', title: 'Īsais apraksts', type: 'text', rows: 3 }),
  defineField({ name: 'body', title: 'Raksta teksts', type: 'array', of: [{ type: 'block' }] }),
  defineField({ name: 'coverImage', title: 'Vāka attēls', type: 'image', options: { hotspot: true }, fields: [string('alt', 'Attēla apraksts')] }),
  string('category', 'Kategorija'), defineField({ name: 'publishedAt', title: 'Publicēšanas datums', type: 'datetime' }),
  defineField({ name: 'sourceUrl', title: 'Sākotnējā avota saite', type: 'url' }), string('sourceLinkLabel', 'Sākotnējā avota pogas teksts'),
], preview: { select: { title: 'title', media: 'coverImage', subtitle: 'category' } } });
export const schemaTypes: SchemaTypeDefinition[] = [article, siteSettings, page, cmsLink, navigationLink, siteImage, richText, sectionStyle, contentCard, galleryItem, faqItem, testimonial, statistic, contactSettings, seo, ...sections];
