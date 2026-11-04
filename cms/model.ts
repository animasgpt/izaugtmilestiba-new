export interface RichBlock {
  _type: 'block'; _key: string; style?: string; listItem?: string; level?: number;
  children: ({ _type: 'span'; _key: string; text: string; marks?: string[] } | InlineCtaButton)[];
  markDefs?: ({ _key: string; _type: string; href?: string; blank?: boolean } & CmsLink)[];
}
export interface InlineCtaButton extends CmsLink { _type: 'inlineCtaButton'; _key: string }
export type RichContent = (RichBlock | InlineCtaButton)[];
export interface CmsImage {
  _type?: string; asset?: { _ref: string }; alt?: string; caption?: string;
  crop?: { top: number; bottom: number; left: number; right: number };
  hotspot?: { x: number; y: number; width: number; height: number };
  fallback?: 'logo' | 'hero' | 'onsite' | 'online' | 'book';
}
export interface CmsLink {
  _key?: string; label?: string; kind?: 'page' | 'url' | 'anchor';
  page?: { _ref: string }; href?: string; anchor?: string; newTab?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'; children?: CmsLink[];
}
export interface SectionStyle {
  background?: 'background' | 'card' | 'accent' | 'primary' | 'dark' | 'custom';
  backgroundColor?: string; textColor?: string; padding?: 'small' | 'medium' | 'large';
  width?: 'narrow' | 'normal' | 'wide'; align?: 'left' | 'center';
}
export interface CmsItem {
  _key: string; title?: string; text?: string; body?: RichContent; image?: CmsImage; icon?: string;
  price?: string; link?: CmsLink; author?: string; role?: string; value?: string;
}
export type SectionType = 'heroSection' | 'textSection' | 'imageTextSection' | 'cardsSection'
  | 'gallerySection' | 'faqSection' | 'testimonialsSection' | 'ctaSection' | 'contactSection' | 'statsSection' | 'spacerSection' | 'articleListSection'
  | 'textAndMediaSection' | 'featuresSection' | 'quoteSection' | 'ctaBanner';
export interface CmsSection {
  _key: string; _type: SectionType; label?: string; anchor?: string; hidden?: boolean;
  style?: SectionStyle; eyebrow?: string; title?: string; subtitle?: string; body?: RichContent;
  columnRatio?: '50-50' | '60-40' | '40-60'; video?: { asset?: { _ref: string } };
  quote?: string; author?: string; role?: string;
  image?: CmsImage; imagePosition?: 'left' | 'right'; imageFit?: 'cover' | 'contain';
  layout?: 'split' | 'center' | 'background'; buttons?: CmsLink[]; items?: CmsItem[];
  columns?: 1 | 2 | 3 | 4; imageRatio?: 'landscape' | 'square' | 'portrait';
  contact?: ContactSettings; height?: number; articleLinkLabel?: string;
}
export interface ContactSettings {
  nameLabel?: string; emailLabel?: string; phoneLabel?: string; messageLabel?: string;
  serviceLabel?: string; submitLabel?: string; successMessage?: string; errorMessage?: string;
  services?: { _key: string; title: string; value: string }[];
  consentText?: string; privacyLink?: CmsLink; requireConsent?: boolean;
}
export interface SeoSettings { title?: string; description?: string; image?: CmsImage; noIndex?: boolean }
export interface CmsPage {
  sourceType?: 'article'; _id: string; _type: 'page'; title: string; slug?: { current: string }; parent?: { _ref: string };
  pageBuilder?: CmsSection[]; sections?: CmsSection[]; seo?: SeoSettings; hideHeader?: boolean; hideFooter?: boolean;
}
export interface SiteSettings {
  fontHeading?: string; fontBody?: string; primaryColor?: string; accentColor?: string; backgroundColor?: string; textColor?: string;
  buttonStyle?: 'rounded-full' | 'rounded-lg' | 'rounded-none' | 'rounded' | 'pill' | 'square';
  builderVersion?: number; _id?: string; _type?: 'siteSettings'; title?: string; logo?: CmsImage; favicon?: CmsImage;
  logoWidth?: number; showTitle?: boolean; studioUrl?: string; siteUrl?: string;
  header?: { layout?: 'left' | 'center'; backgroundColor?: string; textColor?: string; sticky?: boolean; navigation?: CmsLink[]; button?: CmsLink };
  footer?: { backgroundColor?: string; textColor?: string; title?: string; text?: string; logo?: CmsImage; showLogo?: boolean; showTitle?: boolean; copyright?: string;
    columns?: { _key: string; title?: string; links?: CmsLink[] }[]; socialLinks?: CmsLink[]; companyDetails?: string };
  theme?: { background?: string; foreground?: string; primary?: string; primaryForeground?: string;
    secondary?: string; secondaryForeground?: string; card?: string; accent?: string; border?: string;
    headingFont?: string; bodyFont?: string; radius?: number; contentWidth?: number; buttonStyle?: SiteSettings['buttonStyle'] };
  seo?: SeoSettings; email?: string; phone?: string; contact?: ContactSettings;
  // Legacy fields remain readable during the additive migration.
  heroTitle?: string; intro?: string; inPersonPrice?: string; onlinePrice?: string; journalPrice?: string;
}
export interface CmsArticle { _id: string; _type: 'article'; title: string; slug?: {current: string}; excerpt?: string; body?: RichContent; coverImage?: CmsImage; category?: string; publishedAt?: string; sourceUrl?: string; sourceLinkLabel?: string }
export interface SiteSnapshot { settings: SiteSettings | null; pages: CmsPage[]; articles?: CmsArticle[] }
