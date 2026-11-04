import { getCliClient } from 'sanity/cli';
async function main() {
  const client = getCliClient({ apiVersion: '2026-09-10' });
  const project = await client.projects.getById(client.config().projectId!);
  const docs = await client.fetch<{_id:string;_type:string;title?:string;heroTitle?:string}[]>('*[_type in ["siteSettings","page"]]{_id,_type,title,heroTitle}', {}, { perspective: 'raw' });
  const inventory = await client.fetch<Record<string, unknown>[]>('*[!(_type match "sanity.*") && !(_type match "system.*")]', {}, { perspective: 'raw' });
  const types = [...new Set(inventory.map(doc => String(doc._type)))];
  const documentShapes = types.map(type => { const docs = inventory.filter(doc => doc._type === type); return { type, count: docs.length, fields: [...new Set(docs.flatMap(doc => Object.keys(doc).filter(key => !key.startsWith('_'))))] }; });
  const articles = inventory.filter(doc => doc._type === 'article');
  const articleShape = { bodyTypes: [...new Set(articles.flatMap(doc => Array.isArray(doc.body) ? doc.body.map((b: {_type?:string}) => b._type) : [typeof doc.body]))], categoryTypes: [...new Set(articles.map(doc => typeof doc.category))], sampleCategory: articles[0]?.category };
  console.log(JSON.stringify({ documentShapes, articleShape, projectId: project.id, projectName: project.displayName, studioHost: project.studioHost, documents: docs }, null, 2));
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
