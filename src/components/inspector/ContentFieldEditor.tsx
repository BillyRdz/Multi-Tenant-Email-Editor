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
      {/* The label is the AMPscript variable exactly as it appears in the template. */}
      <label
        htmlFor={fieldId}
        className="mb-1 block font-mono text-xs"
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
          className="block w-full"
        />
      ) : (
        <input
          id={fieldId}
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="block w-full"
        />
      )}
    </div>
  );
}
