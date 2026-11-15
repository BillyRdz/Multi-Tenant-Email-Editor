import { useState } from 'react';
import type { EmailVersion } from '../../types';
import { Panel } from '../layout/Panel';
import { Upload, Trash2 } from 'lucide-react';

interface Props {
  versions: EmailVersion[];
  onSave: (name: string) => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
}

export function VersionManager({ versions, onSave, onLoad, onDelete }: Props) {
  const [versionName, setVersionName] = useState('');

  const handleSave = () => {
    if (!versionName.trim()) return;
    onSave(versionName.trim());
    setVersionName('');
  };

  return (
    <Panel title="Versions">
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Summer Promo v2"
            aria-label="Version name"
            value={versionName}
            onChange={e => setVersionName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            className="min-w-0 flex-1"
          />
          <button
            onClick={handleSave}
            disabled={!versionName.trim()}
            className="shrink-0 rounded px-3 py-1.5 text-sm font-semibold"
            style={
              versionName.trim()
                ? { backgroundColor: 'var(--accent-primary)', color: '#fff' }
                : { backgroundColor: 'var(--bg-hover)', color: 'var(--text-tertiary)' }
            }
          >
            Save
          </button>
        </div>
        {versions.length > 0 && (
          <ul className="max-h-48 overflow-y-auto">
            {[...versions].reverse().map(v => (
              <li key={v.id} className="flex items-center gap-1 py-1">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm" style={{ color: 'var(--text-primary)' }}>{v.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {new Date(v.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => onLoad(v.id)}
                  className="rounded p-1 hover:bg-[var(--bg-hover)]"
                  style={{ color: 'var(--text-secondary)' }}
                  title="Load version"
                  aria-label={`Load version ${v.name}`}
                >
                  <Upload size={14} />
                </button>
                <button
                  onClick={() => onDelete(v.id)}
                  className="rounded p-1 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--accent-danger-text)]"
                  title="Delete version"
                  aria-label={`Delete version ${v.name}`}
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Panel>
  );
}
