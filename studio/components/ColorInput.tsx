import { set, type StringInputProps } from 'sanity';
export function ColorInput(props: StringInputProps) {
  const valid = /^#[\da-f]{6}$/i.test(props.value || '');
  return <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <input aria-label={props.schemaType.title || 'Izvēlēties krāsu'} type="color" value={valid ? props.value : '#ffffff'}
      disabled={props.readOnly} onChange={event => props.onChange(set(event.currentTarget.value))}
      style={{ width: 52, height: 42, padding: 2, border: '1px solid #b5b5b5', borderRadius: 6, cursor: 'pointer' }} />
    <div style={{ flex: 1 }}>{props.renderDefault(props)}</div>
  </div>;
}
