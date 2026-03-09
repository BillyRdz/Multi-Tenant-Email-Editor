import { useState } from 'react';
import type { Partner, StyleToken } from '../../types';
import { PartnerTokenEditor } from './PartnerTokenEditor';
import { X, Plus, Users } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  partners: Partner[];
  activePartnerId: string;
  onCreatePartner: (data: Omit<Partner, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdatePartner: (id: string, updates: Partial<Partner>) => void;
  onDeletePartner: (id: string) => void;
}

export function ManagePartnersModal({
  isOpen,
  onClose,
  partners,
  activePartnerId,
  onCreatePartner,
  onUpdatePartner,
  onDeletePartner,
}: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTokens, setNewTokens] = useState<StyleToken[]>([]);

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!newName.trim()) return;
    const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    onCreatePartner({ name: newName.trim(), slug, tokens: newTokens });
    setNewName('');
    setNewTokens([]);
    setCreating(false);
  };

  const getColorToken = (partner: Partner) =>
    partner.tokens.find(t => t.key === 'colorPrimary')?.value || '#6366f1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={onClose} />
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border-primary)' }}>
          <div className="flex items-center gap-2">
            <Users size={18} style={{ color: 'var(--accent-primary)' }} />
            <span className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Manage Partners</span>
            <span className="text-xs ml-2" style={{ color: 'var(--text-tertiary)' }}>{partners.length} partners</span>
          </div>
          <button onClick={onClose} className="cursor-pointer p-1 rounded" style={{ color: 'var(--text-tertiary)' }}>
            <X size={18} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {partners.map(partner => (
            <div
              key={partner.id}
              className="rounded-lg border overflow-hidden"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                borderColor: expandedId === partner.id ? 'var(--accent-primary)' : 'var(--border-primary)',
              }}
            >
              {/* Partner header row */}
              <button
                onClick={() => setExpandedId(expandedId === partner.id ? null : partner.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer transition-colors"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span
                  className="w-4 h-4 rounded-full shrink-0"
                  style={{ backgroundColor: getColorToken(partner) }}
                />
                <span className="text-sm font-medium flex-1">{partner.name}</span>
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  {partner.tokens.length} tokens
                </span>
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  {expandedId === partner.id ? '▼' : '▶'}
                </span>
              </button>

              {/* Expanded: Token editor */}
              {expandedId === partner.id && (
                <div className="border-t px-4 py-3 space-y-3" style={{ borderColor: 'var(--border-primary)' }}>
                  <PartnerTokenEditor
                    tokens={partner.tokens}
                    onSave={(tokens) => onUpdatePartner(partner.id, { tokens })}
                  />
                  {partner.id !== activePartnerId && (
                    <button
                      onClick={() => { onDeletePartner(partner.id); setExpandedId(null); }}
                      className="text-xs cursor-pointer"
                      style={{ color: 'var(--accent-danger)' }}
                    >
                      Delete Partner
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Create new partner */}
          {creating ? (
            <div
              className="rounded-lg border p-4 space-y-3"
              style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--accent-primary)' }}
            >
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="New partner name"
                className="w-full text-sm"
                autoFocus
              />
              <PartnerTokenEditor
                tokens={newTokens}
                onSave={setNewTokens}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreate}
                  disabled={!newName.trim()}
                  className="px-3 py-1.5 text-sm rounded-md cursor-pointer disabled:opacity-40"
                  style={{ backgroundColor: 'var(--accent-primary)', color: '#fff' }}
                >
                  Create Partner
                </button>
                <button
                  onClick={() => { setCreating(false); setNewName(''); setNewTokens([]); }}
                  className="px-3 py-1.5 text-sm rounded-md cursor-pointer"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setCreating(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border-2 border-dashed text-sm cursor-pointer transition-colors"
              style={{
                borderColor: 'var(--border-secondary)',
                color: 'var(--text-tertiary)',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-secondary)')}
            >
              <Plus size={14} />
              Add Partner
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
