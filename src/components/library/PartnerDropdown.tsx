import { useState, useRef, useEffect } from 'react';
import type { Partner } from '../../types';
import { ChevronDown } from 'lucide-react';

interface Props {
  partners: Partner[];
  activePartnerId: string;
  onSelect: (id: string) => void;
}

export function PartnerDropdown({ partners, activePartnerId, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = partners.find(p => p.id === activePartnerId);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getColorToken = (partner: Partner) =>
    partner.tokens.find(t => t.key === 'colorPrimary')?.value || '#6366f1';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors"
        style={{
          backgroundColor: 'var(--bg-tertiary)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-primary)',
        }}
      >
        <span
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: active ? getColorToken(active) : '#666' }}
        />
        <span className="truncate max-w-[140px]">{active?.name || 'Select Partner'}</span>
        <ChevronDown size={14} style={{ color: 'var(--text-tertiary)' }} />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-1 w-56 rounded-lg border shadow-xl z-50 overflow-hidden max-h-80 overflow-y-auto"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-secondary)',
          }}
        >
          {partners.map(p => (
            <button
              key={p.id}
              onClick={() => { onSelect(p.id); setOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left cursor-pointer transition-colors"
              style={{
                color: p.id === activePartnerId ? 'var(--accent-primary)' : 'var(--text-primary)',
                backgroundColor: p.id === activePartnerId ? 'var(--bg-hover)' : 'transparent',
              }}
              onMouseEnter={e => { if (p.id !== activePartnerId) (e.currentTarget.style.backgroundColor = 'var(--bg-hover)'); }}
              onMouseLeave={e => { if (p.id !== activePartnerId) (e.currentTarget.style.backgroundColor = 'transparent'); }}
            >
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: getColorToken(p) }}
              />
              <span className="truncate">{p.name}</span>
              <span className="ml-auto text-xs" style={{ color: 'var(--text-tertiary)' }}>
                {p.tokens.length} tokens
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
