import { getCliClient } from 'sanity/cli';
async function main() {
  const client = getCliClient({ apiVersion: '2026-09-10' });
  const project = await client.projects.getById(client.config().projectId!);
  const docs = await client.fetch<{_id:string;_type:string;title?:string;heroTitle?:string}[]>('*[_type in ["siteSettings","page"]]{_id,_type,title,heroTitle}', {}, { perspective: 'raw' });
  console.log(JSON.stringify({ projectId: project.id, projectName: project.displayName, studioHost: project.studioHost, documents: docs }, null, 2));
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
