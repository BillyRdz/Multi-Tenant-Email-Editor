import { useState, useId } from 'react';
import type { Partner, StyleToken } from '../../types';
import { PartnerTokenEditor } from './PartnerTokenEditor';
import { PartnerSwatch } from '../shared/PartnerSwatch';
import { useModalDialog } from '../../hooks/useModalDialog';
import { X, Plus, ChevronRight, ChevronDown } from 'lucide-react';

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
  const dialogRef = useModalDialog(isOpen, onClose);
  const titleId = useId();

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!newName.trim()) return;
    const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    onCreatePartner({ name: newName.trim(), slug, tokens: newTokens });
    setNewName('');
    setNewTokens([]);
    setCreating(false);
  };

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(23,25,29,0.45)' }} onClick={onClose} />
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'var(--border-primary)' }}>
          <div className="flex items-baseline gap-2">
            <h2 id={titleId} className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Manage Partners</h2>
            <span className="tabular text-xs" style={{ color: 'var(--text-tertiary)' }}>{partners.length} partners</span>
          </div>
          <button onClick={onClose} aria-label="Close manage partners" className="rounded p-1 hover:bg-[var(--bg-hover)]" style={{ color: 'var(--text-secondary)' }}>
            <X size={18} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          <ul>
            {partners.map(partner => {
              const isExpanded = expandedId === partner.id;
              return (
                <li
                  key={partner.id}
                  className="border-b last:border-b-0"
                  style={{ borderColor: 'var(--border-primary)' }}
                >
                  {/* Partner header row */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : partner.id)}
                    aria-expanded={isExpanded}
                    className={`flex w-full items-center gap-3 rounded px-2 py-2 text-left hover:bg-[var(--bg-hover)] ${
                      isExpanded ? 'font-semibold' : ''
                    }`}
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {isExpanded
                      ? <ChevronDown size={14} aria-hidden="true" style={{ color: 'var(--text-secondary)' }} />
                      : <ChevronRight size={14} aria-hidden="true" style={{ color: 'var(--text-secondary)' }} />}
                    <PartnerSwatch partner={partner} className="w-14 h-4" />
                    <span className="text-sm flex-1">{partner.name}</span>
                    <span className="tabular text-xs font-normal" style={{ color: 'var(--text-tertiary)' }}>
                      {partner.tokens.length} tokens
                    </span>
                  </button>

                  {/* Expanded: Token editor */}
                  {isExpanded && (
                    <div className="space-y-3 pb-4 pl-9 pr-2 pt-1">
                      <PartnerTokenEditor
                        tokens={partner.tokens}
                        onSave={(tokens) => onUpdatePartner(partner.id, { tokens })}
                      />
                      {partner.id !== activePartnerId && (
                        <button
                          onClick={() => { onDeletePartner(partner.id); setExpandedId(null); }}
                          className="rounded text-xs underline"
                          style={{ color: 'var(--accent-danger-text)' }}
                        >
                          Delete Partner
                        </button>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Create new partner */}
          {creating ? (
            <div
              className="mt-2 space-y-3 rounded p-3"
              style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-input)' }}
            >
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="New partner name"
                aria-label="New partner name"
                className="w-full"
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
                  className="rounded px-3 py-1.5 text-sm font-semibold"
                  style={
                    newName.trim()
                      ? { backgroundColor: 'var(--accent-primary)', color: '#fff' }
                      : { backgroundColor: 'var(--bg-hover)', color: 'var(--text-tertiary)' }
                  }
                >
                  Create Partner
                </button>
                <button
                  onClick={() => { setCreating(false); setNewName(''); setNewTokens([]); }}
                  className="rounded px-3 py-1.5 text-sm hover:bg-[var(--bg-hover)]"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setCreating(true)}
              className="mt-2 flex items-center gap-1.5 rounded px-2 py-1.5 text-sm font-semibold hover:bg-[var(--bg-hover)]"
              style={{ color: 'var(--text-primary)' }}
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
