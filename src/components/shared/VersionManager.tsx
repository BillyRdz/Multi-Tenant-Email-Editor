import { useState } from 'react';
import type { EmailVersion } from '../../types';
import { Panel } from '../layout/Panel';
import { Save, Upload, Trash2 } from 'lucide-react';

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
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Summer Promo v2"
            value={versionName}
            onChange={e => setVersionName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            className="flex-1 text-sm"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
              borderRadius: '6px',
              padding: '6px 10px',
            }}
          />
          <button
            onClick={handleSave}
            disabled={!versionName.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md cursor-pointer disabled:opacity-40"
            style={{ backgroundColor: 'var(--accent-primary)', color: '#fff' }}
          >
            <Save size={14} />
            Save
          </button>
        </div>
        {versions.length > 0 && (
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {[...versions].reverse().map(v => (
              <div
                key={v.id}
                className="flex items-center gap-2 px-3 py-2 rounded-md"
                style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{v.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {new Date(v.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => onLoad(v.id)}
                  className="cursor-pointer p-1 rounded transition-colors"
                  style={{ color: 'var(--accent-primary)' }}
                  title="Load version"
                >
                  <Upload size={14} />
                </button>
                <button
                  onClick={() => onDelete(v.id)}
                  className="cursor-pointer p-1 rounded transition-colors"
                  style={{ color: 'var(--accent-danger)' }}
                  title="Delete version"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
}
