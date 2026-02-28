import { useState } from 'react';
import type { EmailVersion, PartnerTheme } from '../types';

interface Props {
  versions: EmailVersion[];
  partners: PartnerTheme[];
  onSave: (name: string) => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
}

export function VersionManager({ versions, partners, onSave, onLoad, onDelete }: Props) {
  const [versionName, setVersionName] = useState('');

  const handleSave = () => {
    if (!versionName.trim()) return;
    onSave(versionName.trim());
    setVersionName('');
  };

  const getPartnerName = (id: string) => partners.find(p => p.id === id)?.name || 'Unknown';

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Versions</h3>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="e.g. Summer Promo v2"
          value={versionName}
          onChange={e => setVersionName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md"
        />
        <button
          onClick={handleSave}
          disabled={!versionName.trim()}
          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 disabled:opacity-40 cursor-pointer"
        >
          Save
        </button>
      </div>
      {versions.length > 0 && (
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {[...versions].reverse().map(v => (
            <div key={v.id} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-md border border-gray-200">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{v.name}</p>
                <p className="text-xs text-gray-500">
                  {getPartnerName(v.partnerId)} — {new Date(v.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => onLoad(v.id)}
                className="text-xs text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                Load
              </button>
              <button
                onClick={() => onDelete(v.id)}
                className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
              >
                Del
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
