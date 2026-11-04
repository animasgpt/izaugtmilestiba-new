import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemaTypes';
import { deskStructure, documentViews } from './deskStructure';
import { HelpTool } from './components/HelpTool';

export default defineConfig({
  name: 'default', title: 'Izaugt mīlestībā — lapas redaktors',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'sxvw8jh8',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [structureTool({ title: 'Lapas un dizains', defaultDocumentNode: documentViews, structure: deskStructure })],
  schema: { types: schemaTypes, templates: prev => prev.filter(template => template.schemaType !== 'siteSettings') },
  document: {
    newDocumentOptions: prev => prev.filter(item => item.templateId !== 'siteSettings'),
    actions: (prev, { schemaType, documentId }) => (schemaType === 'siteSettings' || documentId?.replace(/^drafts\./, '') === 'page-home')
      ? prev.filter(action => !['delete', 'duplicate'].includes(action.action || '')) : prev,
  },
  tools: prev => [...prev, { name: 'palidziba', title: 'Kā rediģēt?', component: HelpTool }],
});
