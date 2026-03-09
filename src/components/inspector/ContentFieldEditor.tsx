interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ContentFieldEditor({ label, value, onChange }: Props) {
  const isLongText = value.length > 60 || label.toLowerCase().includes('text') || label.toLowerCase().includes('message');

  return (
    <div>
      <label
        className="block text-xs font-medium mb-1"
        style={{ color: 'var(--text-secondary)' }}
      >
        {`%%=v(@${label})=%%`}
      </label>
      {isLongText ? (
        <textarea
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
