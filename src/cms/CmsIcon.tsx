import { Heart, Star, Leaf, Sun, Users, MessageCircle, BookOpen, Check, Sparkles, House, ShieldCheck } from 'lucide-react';
const icons = { heart: Heart, star: Star, leaf: Leaf, sun: Sun, users: Users, message: MessageCircle, book: BookOpen, check: Check, sparkles: Sparkles, home: House, shield: ShieldCheck };
export function CmsIcon({ name }: { name?: string }) {
  const Icon = name && Object.prototype.hasOwnProperty.call(icons, name) ? icons[name as keyof typeof icons] : undefined;
  return Icon ? <Icon className="cms-card-icon" aria-hidden="true" strokeWidth={1.6} /> : null;
}
