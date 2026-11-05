import { Link } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
export default function AdminContent() {
  const { isLoading, isAuthorized } = useAdminAuth();
  if (isLoading) return <p className="p-8">Ielādē…</p>;
  if (!isAuthorized) return null;
  const studioUrl = import.meta.env.VITE_SANITY_STUDIO_URL;
  return <main className="container max-w-2xl py-16 space-y-6">
    <Link to="/admin/pieteikumi">← Atpakaļ pie pieteikumiem</Link>
    <h1 className="text-3xl font-serif">Vietnes rediģēšana Sanity</h1>
    <p>Lapas, sadaļas, izvēlnes, attēlus un dizainu tagad rediģē Sanity. Vecā datubāzes satura rediģēšana ir aizstāta, lai izmaiņas vienmēr nonāktu publiskajā lapā.</p>
    {studioUrl ? <a href={studioUrl} target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 bg-primary rounded-lg">Atvērt Sanity redaktoru</a> :
      <p>Sanity redaktora adrese vēl nav pieslēgta. Pabeidziet iestatīšanu pēc SANITY.md instrukcijas.</p>}
  </main>;
}
