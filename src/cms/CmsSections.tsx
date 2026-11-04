import type { CSSProperties } from 'react';
import ContactForm from '@/components/ContactForm';
import { useCms } from './CmsProvider';
import { CmsButtons, CmsPicture, CmsAnchor, RichText, imageUrl } from './content';
import type { CmsPage, CmsSection } from '../../cms/model';

function sectionStyle(section: CmsSection): CSSProperties {
  const style: CSSProperties = {};
  if (section.style?.background === 'custom' && /^#[\da-f]{6}$/i.test(section.style.backgroundColor || '')) style.backgroundColor = section.style.backgroundColor;
  if (/^#[\da-f]{6}$/i.test(section.style?.textColor || '')) style.color = section.style.textColor;
  return style;
}
function Intro({ section, hero }: { section: CmsSection; hero?: boolean }) {
  return <>
    {section.eyebrow && <p className="cms-eyebrow" data-cms-path="eyebrow">{section.eyebrow}</p>}
    {section.title && (hero ? <h1 data-cms-path="title">{section.title}</h1> : <h2 data-cms-path="title">{section.title}</h2>)}
    {section.subtitle && <p className="cms-subtitle" data-cms-path="subtitle">{section.subtitle}</p>}
    <div data-cms-path="body"><RichText value={section.body} /></div>
  </>;
}
function SectionContent({ section }: { section: CmsSection }) {
  const { snapshot: { settings, articles: snapshotArticles }, preview } = useCms();
  const intro = <Intro section={section} hero={section._type === 'heroSection'} />;
  switch (section._type) {
    case 'heroSection':
    case 'imageTextSection': {
      const hero = section._type === 'heroSection';
      const layout = hero ? section.layout || 'split' : 'split';
      return <div className={'cms-feature cms-feature--' + layout + ' cms-image--' + (section.imagePosition || 'right')}
        style={layout === 'background' ? { backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.62), rgba(0,0,0,.25)), url("${imageUrl(section.image) || ''}")` } : undefined}>
        <div className="cms-feature-copy">{intro}<CmsButtons buttons={section.buttons} /></div>
        {layout !== 'background' && <div className="cms-feature-image" data-cms-path="image"><CmsPicture image={section.image}
          eager={hero} className={section.imageFit === 'contain' ? 'cms-image-contain' : ''} /></div>}
      </div>;
    }
    case 'textSection':
    case 'ctaSection': return <div className="cms-copy">{intro}<CmsButtons buttons={section.buttons} /></div>;
    case 'cardsSection': return <>{intro}<div className={'cms-grid cms-grid--' + (section.columns || 3)}>
      {section.items?.map(item => <article className="cms-card" key={item._key} data-cms-item={item._key}>
        <div data-cms-path="image"><CmsPicture image={item.image} /></div>
        <div className="cms-card-copy"><h3 data-cms-path="title">{item.title}</h3><p className="cms-preline" data-cms-path="text">{item.text}</p>
          <RichText value={item.body} />{item.price && <p className="cms-price" data-cms-path="price">{item.price}</p>}
          {item.link && <CmsAnchor link={item.link} className="cms-button cms-button--secondary" />}
        </div></article>)}
    </div><CmsButtons buttons={section.buttons} /></>;
    case 'articleListSection': return <>{intro}<div className={'cms-grid cms-grid--' + (section.columns || 3)}>
      {snapshotArticles?.map(article => <article className="cms-card" key={article._id}>
        <CmsPicture image={article.coverImage} /><div className="cms-card-copy">{article.category && <p className="cms-eyebrow">{article.category}</p>}<h3>{article.title}</h3>
          <p>{article.excerpt}</p><CmsAnchor link={{ label: section.articleLinkLabel || 'Lasīt rakstu', kind: 'page', page: { _ref: article._id } }} className="cms-button cms-button--outline" />
        </div></article>)}
    </div></>;
    case 'gallerySection': return <>{intro}<div className={'cms-grid cms-grid--' + (section.columns || 3) + ' cms-gallery cms-ratio--' + (section.imageRatio || 'landscape')}>
      {section.items?.map(item => <figure key={item._key} data-cms-item={item._key}><div data-cms-path="image"><CmsPicture image={item.image} /></div>
        {(item.image?.caption || item.title) && <figcaption>{item.image?.caption || item.title}</figcaption>}</figure>)}
    </div></>;
    case 'faqSection': return <>{intro}<div className="cms-faq">{section.items?.map(item => <details key={item._key} data-cms-item={item._key}>
      <summary data-cms-path="title">{item.title}</summary><div data-cms-path="body"><RichText value={item.body} /></div>
    </details>)}</div></>;
    case 'testimonialsSection': return <>{intro}<div className={'cms-grid cms-grid--' + (section.columns || 2)}>
      {section.items?.map(item => <figure className="cms-card cms-quote" key={item._key} data-cms-item={item._key}>
        <blockquote data-cms-path="text">“{item.text}”</blockquote><figcaption><CmsPicture image={item.image} /><div><strong>{item.author}</strong>{item.role && <p>{item.role}</p>}</div></figcaption>
      </figure>)}
    </div></>;
    case 'statsSection': return <>{intro}<div className={'cms-grid cms-grid--' + (section.columns || 3)}>{section.items?.map(item =>
      <div className="cms-stat" key={item._key} data-cms-item={item._key}><strong data-cms-path="value">{item.value}</strong><p data-cms-path="title">{item.title}</p></div>)}</div></>;
    case 'contactSection': return <>{intro}<ContactForm settings={{ ...settings?.contact, ...section.contact }} formId={section._key} preview={preview} />
      {(settings?.email || settings?.phone) && <div className="cms-contact-details">
        {settings.email && <a href={'mailto:' + settings.email}>{settings.email}</a>}
        {settings.phone && <a href={'tel:' + settings.phone.replace(/[^+\d]/g, '')}>{settings.phone}</a>}
      </div>}</>;
    case 'spacerSection': return <div style={{ height: `${Math.max(0, Math.min(240, section.height ?? 48))}px` }} />;
    default: return null;
  }
}
export function CmsSections({ page }: { page: CmsPage }) {
  return <main>{page.sections?.filter(section => !section.hidden).map(section => <section key={section._key}
    id={section.anchor || undefined} data-cms-document={page._id} data-cms-source-type={page.sourceType} data-cms-section={section._key}
    className={['cms-section', 'cms-section--' + section._type, 'cms-bg--' + (section.style?.background || 'background'),
      'cms-padding--' + (section._type === 'spacerSection' ? 'none' : section.style?.padding || 'large'),
      'cms-align--' + (section.style?.align || 'left')].join(' ')} style={sectionStyle(section)}>
    <div className={'cms-container cms-width--' + (section.style?.width || 'normal')}><SectionContent section={section} /></div>
  </section>)}</main>;
}
