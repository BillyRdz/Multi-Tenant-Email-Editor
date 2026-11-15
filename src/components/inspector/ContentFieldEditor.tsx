import { useId } from 'react';

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ContentFieldEditor({ label, value, onChange }: Props) {
  const fieldId = useId();
  const isLongText = value.length > 60 || label.toLowerCase().includes('text') || label.toLowerCase().includes('message');

  return (
    <div>
      <label
        htmlFor={fieldId}
        className="block text-xs font-medium mb-1"
        style={{ color: 'var(--text-secondary)' }}
      >
        {`%%=v(@${label})=%%`}
      </label>
      {isLongText ? (
        <textarea
          id={fieldId}
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={3}
          className="w-full text-sm"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-primary)',
            color: 'var(--text-primary)',
            borderRadius: '6px',
            padding: '8px',
          }}
        />
      ) : (
        <input
          id={fieldId}
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full text-sm"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-primary)',
            color: 'var(--text-primary)',
            borderRadius: '6px',
            padding: '8px',
          }}
        />
      )}
    </div>
  );
}
