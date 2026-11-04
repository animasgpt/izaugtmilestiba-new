import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useCms } from './CmsProvider';
import { CmsAnchor, CmsPicture } from './content';
import type { CmsLink } from '../../cms/model';

function chromeStyle(value?: { backgroundColor?: string; textColor?: string }) {
  return { backgroundColor: /^#[\da-f]{6}$/i.test(value?.backgroundColor || '') ? value?.backgroundColor : undefined, color: /^#[\da-f]{6}$/i.test(value?.textColor || '') ? value?.textColor : undefined };
}
function NavItem({ link, close }: { link: CmsLink; close: () => void }) {
  if (!link.children?.length) return <CmsAnchor link={link} onClick={close} />;
  return <details className="cms-nav-group"><summary>{link.label}</summary><div>
    {(link.href || link.page) && <CmsAnchor link={link} onClick={close} />}
    {link.children.map((child, i) => <CmsAnchor key={child._key || i} link={child} onClick={close} />)}
  </div></details>;
}
export function CmsHeader() {
  const { snapshot: { settings }, preview } = useCms();
  const [open, setOpen] = useState(false);
  if (!settings) return null;
  return <header style={chromeStyle(settings.header)} className={'cms-header ' + (settings.header?.sticky !== false ? 'cms-header--sticky ' : '') +
    (settings.header?.layout === 'center' ? 'cms-header--center' : '')} data-cms-document="siteSettings" data-cms-path="header">
    <div className="cms-container cms-header-inner">
      <Link className="cms-brand" to={preview ? '/?cms-preview=1' : '/'} onClick={() => setOpen(false)} data-cms-path="logo" aria-label={settings.title || 'Sākumlapa'}>
        <CmsPicture image={settings.logo} className="cms-logo" eager />
        {settings.showTitle !== false && <span>{settings.title}</span>}
      </Link>
      <button className="cms-mobile-toggle" aria-label={open ? 'Aizvērt izvēlni' : 'Atvērt izvēlni'} aria-expanded={open}
        aria-controls="site-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      <nav id="site-navigation" className={'cms-navigation ' + (open ? 'is-open' : '')} aria-label="Galvenā izvēlne">
        {settings.header?.navigation?.map((link, i) => <NavItem key={link._key || i} link={link} close={() => setOpen(false)} />)}
        {settings.header?.button?.label && <CmsAnchor link={settings.header.button} className="cms-button cms-button--primary" onClick={() => setOpen(false)} />}
      </nav>
    </div>
  </header>;
}
export function CmsFooter() {
  const { snapshot: { settings } } = useCms();
  if (!settings) return null;
  const footer = settings.footer;
  return <footer style={chromeStyle(footer)} className="cms-footer" data-cms-document="siteSettings" data-cms-path="footer"><div className="cms-container">
    <div className="cms-footer-top"><div className="cms-footer-brand">
      {footer?.showLogo && <CmsPicture image={footer.logo || settings.logo} className="cms-logo" />}
      {footer?.showTitle !== false && <p className="cms-footer-title">{footer?.title ?? settings.title}</p>}
      {footer?.text && <p className="cms-preline">{footer.text}</p>}
      {footer?.companyDetails && <p className="cms-preline cms-company-details" data-cms-path="footer.companyDetails">{footer.companyDetails}</p>}
    </div>
    {footer?.columns?.map(column => <div key={column._key}><h2>{column.title}</h2><ul>{column.links?.map((link, i) =>
      <li key={link._key || i}><CmsAnchor link={link} /></li>)}</ul></div>)}
    </div>
    <div className="cms-footer-bottom"><p>{(footer?.copyright ?? '').split('{year}').join(String(new Date().getFullYear()))}</p>
      <div className="cms-social-links">{footer?.socialLinks?.map((link, i) => <CmsAnchor key={link._key || i} link={link} />)}</div>
    </div>
  </div></footer>;
}
