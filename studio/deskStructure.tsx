import type { DefaultDocumentNodeResolver, StructureResolver } from 'sanity/structure';
import { PreviewPane } from './components/PreviewPane';
import { SettingsIcon, HomeIcon, PagesIcon } from './components/EditorIcons';
export const documentViews: DefaultDocumentNodeResolver = S => S.document().views([
  S.view.form().title('Rediģēt'), S.view.component(PreviewPane).title('Priekšskatījums'),
]);
export const deskStructure: StructureResolver = S => S.list().title('Vietnes vadības centrs').items([
  S.listItem().title('Vispārīgie iestatījumi').icon(SettingsIcon).child(S.document().schemaType('siteSettings').documentId('siteSettings').views([
    S.view.form().title('Rediģēt'), S.view.component(PreviewPane).title('Priekšskatījums'),
  ])),
  S.listItem().title('Galvenā lapa').icon(HomeIcon).child(S.document().schemaType('page').documentId('page-home').views([
    S.view.form().title('Rediģēt'), S.view.component(PreviewPane).title('Priekšskatījums'),
  ])),
  S.divider(),
  S.listItem().title('Sadaļas / Lapas').icon(PagesIcon).child(S.documentTypeList('page').title('Lapas un apakšlapas — pievienojiet ar +').filter('_type == "page" && !(_id in ["page-home", "drafts.page-home"])')),
  S.listItem().title('Raksti').child(S.documentTypeList('article').title('Raksti')),
]);
