import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function StudioRedirect() {
  const location = useLocation();
  const destination = new URL(import.meta.env.VITE_SANITY_STUDIO_URL || 'https://izaugtmilestiba-sxvw8jh8.sanity.studio/');
  if (location.pathname.startsWith('/studio/')) {
    destination.pathname = destination.pathname.replace(/\/$/, '') + location.pathname.slice('/studio'.length);
  }
  destination.search = location.search;
  destination.hash = location.hash;
  const href = destination.href;
  useEffect(() => { window.location.replace(href); }, [href]);
  return <main className="p-8"><a href={href}>Atvērt Sanity redaktoru →</a></main>;
}
