import { defineConfig } from 'sanity';
import { structureTool, type DefaultDocumentNodeResolver } from 'sanity/structure';
import { schemaTypes } from './schemaTypes';
import { PreviewPane } from './components/PreviewPane';
import { HelpTool } from './components/HelpTool';

const views: DefaultDocumentNodeResolver = S => S.document().views([
  S.view.form().title('Rediģēt'), S.view.component(PreviewPane).title('Priekšskatījums'),
]);
export default defineConfig({
  name: 'default', title: 'Izaugt mīlestībā — lapas redaktors',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'sxvw8jh8',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [structureTool({ title: 'Lapas un dizains', defaultDocumentNode: views, structure: S => S.list().title('Vietnes redaktors').items([
    S.listItem().title('🏠 Sākumlapa').child(S.document().schemaType('page').documentId('page-home').views([S.view.form().title('Rediģēt'), S.view.component(PreviewPane).title('Priekšskatījums')])),
    S.listItem().title('📄 Lapas un apakšlapas').child(S.documentTypeList('page').title('Lapas — pievienojiet ar +').filter('_type == "page" && !(_id in ["page-home", "drafts.page-home"])')),
    S.listItem().title('📝 Raksti').child(S.documentTypeList('article').title('Raksti')),
    S.divider(),
    S.listItem().title('🎨 Dizains, logo, izvēlnes un kontakti').child(S.document().schemaType('siteSettings').documentId('siteSettings').views([S.view.form().title('Rediģēt'), S.view.component(PreviewPane).title('Priekšskatījums')])),
  ]) })],
  schema: { types: schemaTypes, templates: prev => prev.filter(template => template.schemaType !== 'siteSettings') },
  document: {
    newDocumentOptions: prev => prev.filter(item => item.templateId !== 'siteSettings'),
    actions: (prev, { schemaType, documentId }) => (schemaType === 'siteSettings' || documentId?.replace(/^drafts\./, '') === 'page-home')
      ? prev.filter(action => !['delete', 'duplicate'].includes(action.action || '')) : prev,
  },
  tools: prev => [...prev, { name: 'palidziba', title: 'Kā rediģēt?', component: HelpTool }],
});
