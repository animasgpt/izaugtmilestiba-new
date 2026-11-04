import { set, useFormValue, type StringInputProps } from 'sanity';
import { inheritedColor } from '../../cms/colors';
import type { SiteSettings } from '../../cms/model';
export function ColorInput(props: StringInputProps) {
  const document = useFormValue([]) as SiteSettings;
  const fallback = document?._type === 'siteSettings' ? inheritedColor(document, props.path) : undefined;
  const valid = /^#[\da-f]{6}$/i.test(props.value || '');
  return <div><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <input aria-label={props.schemaType.title || 'Izvēlēties krāsu'} type="color" value={valid ? props.value : fallback || '#ffffff'}
      disabled={props.readOnly} onChange={event => props.onChange(set(event.currentTarget.value))}
      style={{ width: 52, height: 42, padding: 2, border: '1px solid #b5b5b5', borderRadius: 6, cursor: 'pointer' }} />
    <div style={{ flex: 1 }}>{props.renderDefault({ ...props, elementProps: { ...props.elementProps, placeholder: fallback } })}</div>
  </div>{!props.value && fallback && <p style={{ margin: '8px 0 0', fontSize: 12, opacity: .75 }}>Pašlaik izmantota noklusējuma krāsa {fallback}. Izvēlieties citu, lai to mainītu.</p>}</div>;
}
