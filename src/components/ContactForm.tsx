import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, Send } from 'lucide-react';
import { CmsAnchor } from '@/cms/content';
import { defaultSnapshot } from '../../cms/defaults';
import type { ContactSettings } from '../../cms/model';

const schema = z.object({
  name: z.string().trim().min(1, 'Lūdzu, ievadiet vārdu').max(100),
  email: z.string().trim().email('Lūdzu, ievadiet derīgu e-pastu').max(255),
  phone: z.string().trim().min(1, 'Lūdzu, ievadiet telefona numuru').max(20),
  message: z.string().trim().max(1000).optional(), service_type: z.string().optional(),
});
type Values = z.infer<typeof schema>;
export default function ContactForm({ settings, formId = 'contact', preview = false }: {
  settings?: ContactSettings; formId?: string; preview?: boolean;
}) {
  const config = { ...defaultSnapshot.settings?.contact, ...settings, services: settings?.services || [] };
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Values>({ resolver: zodResolver(schema) });
  const id = (name: string) => `${formId}-${name}`;
  const submit = async (values: Values) => {
    if (preview) return;
    setSubmitting(true);
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { error } = await supabase.from('contact_submissions').insert({
        name: values.name, email: values.email, phone: values.phone,
        message: values.message || null, service_type: values.service_type || null,
      });
      if (error) throw error;
      toast.success(config.successMessage || 'Paldies! Ziņojums nosūtīts.');
      reset();
    } catch {
      toast.error(config.errorMessage || 'Neizdevās nosūtīt. Lūdzu, mēģiniet vēlreiz.');
    } finally { setSubmitting(false); }
  };
  return <form className="cms-contact-form" onSubmit={handleSubmit(submit)}>
    {(['name', 'email', 'phone'] as const).map(name => <div className="cms-field" key={name}>
      <label htmlFor={id(name)}>{config[`${name}Label`] || name} *</label>
      <input id={id(name)} type={name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'text'}
        autoComplete={name === 'phone' ? 'tel' : name} {...register(name)} aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? id(name + '-error') : undefined} />
      {errors[name] && <p id={id(name + '-error')} role="alert" className="cms-field-error">{errors[name]?.message}</p>}
    </div>)}
    {!!config.services?.length && <div className="cms-field"><label htmlFor={id('service')}>{config.serviceLabel}</label>
      <select id={id('service')} {...register('service_type')}><option value="">—</option>
        {config.services.map(item => <option key={item._key} value={item.value}>{item.title}</option>)}
      </select></div>}
    <div className="cms-field"><label htmlFor={id('message')}>{config.messageLabel}</label>
      <textarea id={id('message')} rows={4} maxLength={1000} {...register('message')} aria-invalid={!!errors.message} />
      {errors.message && <p role="alert" className="cms-field-error">{errors.message.message}</p>}
    </div>
    {config.consentText && <label className="cms-consent"><input type="checkbox" required={config.requireConsent} />
      <span>{config.consentText} {config.privacyLink && <CmsAnchor link={config.privacyLink} />}</span></label>}
    {preview && <p className="cms-form-notice">Priekšskatījumā forma nesūta īstus pieteikumus.</p>}
    <button className="cms-button cms-button--primary" disabled={submitting || preview} type="submit">
      {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}{config.submitLabel || 'Nosūtīt'}
    </button>
  </form>;
}
