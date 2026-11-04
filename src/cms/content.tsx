import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { urlFor } from '@/lib/sanity';
import logo from '@/assets/logo.png';
import hero from '@/assets/hero-madara.jpg';
import onsite from '@/assets/consultation-onsite.jpg';
import online from '@/assets/consultation-online.jpg';
import book from '@/assets/book-cover.jpg';
import type { CmsImage, CmsLink, RichContent } from '../../cms/model';
import { linkHref, safeHref } from '../../cms/routing';
import { useCms } from './CmsProvider';

const images = { logo, hero, onsite, online, book };
export function imageUrl(image?: CmsImage, width = 1600): string | undefined {
  if (image?.asset?._ref) {
    try { return urlFor(image).width(width).fit('max').auto('format').url(); } catch { return undefined; }
  }
  return image?.fallback ? images[image.fallback] : undefined;
}
export function CmsPicture({ image, className, eager = false }: { image?: CmsImage; className?: string; eager?: boolean }) {
  const src = imageUrl(image);
  if (!src) return null;
  return <img src={src} srcSet={image?.asset ? [320, 640, 960, 1600].map(w => `${imageUrl(image, w)} ${w}w`).join(', ') : undefined}
    sizes={className?.includes('cms-logo') ? '260px' : '(max-width: 760px) 100vw, 800px'}
    style={image?.hotspot ? { objectPosition: `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%` } : undefined} alt={image?.alt || ''} loading={eager ? 'eager' : 'lazy'} decoding="async" className={className} />;
}
export function CmsAnchor({ link, className, onClick, children }: { link: CmsLink; className?: string; onClick?: () => void; children?: ReactNode }) {
  const { snapshot, preview } = useCms();
  const location = useLocation();
  const href = linkHref(link, snapshot.pages);
  if (!href) return null;
  const internal = href.startsWith('/');
  const label = children ?? link.label ?? 'Lasīt vairāk';
  const previewHref = preview && internal ? href.replace(/(#|$)/, '?cms-preview=1$1') : href;
  if (internal && !link.newTab) return <Link to={previewHref} className={className} onClick={() => {
    onClick?.();
    const target = href.split('#');
    if (target[0] === location.pathname && target[1]) {
      document.getElementById(decodeURIComponent(target[1]))?.scrollIntoView({ behavior: 'smooth' });
    }
  }}>{label}</Link>;
  return <a href={previewHref} className={className} onClick={onClick} target={link.newTab ? '_blank' : undefined}
    rel={link.newTab ? 'noopener noreferrer' : undefined}>{label}</a>;
}
export function CmsButtons({ buttons }: { buttons?: CmsLink[] }) {
  if (!buttons?.length) return null;
  return <div className="cms-buttons">{buttons.map((link, i) => <CmsAnchor key={link._key || i} link={link}
    className={'cms-button cms-button--' + (link.variant || 'primary')} />)}</div>;
}
const richComponents: Partial<PortableTextComponents> = {
  block: {
    lead: ({ children }) => <p className="cms-lead">{children}</p>,
  },
  types: {
    inlineCtaButton: ({ value }) => <CmsAnchor link={value} className={'cms-button cms-inline-button cms-button--' + (value.variant || 'primary')} />,
  },
  marks: { link: ({ value, children }) => {
    const href = safeHref(value?.href);
    return href ? <a href={href} target={value?.blank ? '_blank' : undefined} rel={value?.blank ? 'noopener noreferrer' : undefined}>{children}</a> : <>{children}</>;
  },
    internalLink: ({ value, children }) => <CmsAnchor link={{ ...value, kind: 'page' }}>{children}</CmsAnchor>,
    buttonLink: ({ value, children }) => <CmsAnchor link={value} className={'cms-button cms-inline-button cms-button--' + (value?.variant || 'primary')}>{children}</CmsAnchor>,
    highlight: ({ children }) => <mark className="cms-text-highlight">{children}</mark>,
    'strike-through': ({ children }) => <s>{children}</s>,
  },
};
export function RichText({ value }: { value?: RichContent }) {
  return value?.length ? <div className="cms-richtext"><PortableText value={value} components={richComponents} /></div> : null;
}
