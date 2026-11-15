import { useState, useRef, useEffect, useId } from 'react';
import type { KeyboardEvent } from 'react';
import type { Partner } from '../../types';
import { ChevronDown } from 'lucide-react';

interface Props {
  partners: Partner[];
  activePartnerId: string;
  onSelect: (id: string) => void;
}

/**
 * Partner picker, built as a listbox:
 * - Enter, Space, or an arrow key on the button opens the list
 * - Up, Down, Home, and End move between partners
 * - Enter or Space picks one, Escape closes and returns focus to the button
 */
export function PartnerDropdown({ partners, activePartnerId, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const active = partners.find(p => p.id === activePartnerId);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // When the list opens, put focus on the current partner.
  useEffect(() => {
    if (!open) return;
    const list = listRef.current;
    const current = list?.querySelector<HTMLElement>('[aria-selected="true"]');
    (current ?? list?.querySelector<HTMLElement>('[role="option"]'))?.focus();
  }, [open]);

  const closeAndReturnFocus = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
    }
  };

  const handleListKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const options = Array.from(listRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);
    const index = options.indexOf(document.activeElement as HTMLElement);

    let next: number;
    switch (e.key) {
      case 'ArrowDown':
        next = Math.min(index + 1, options.length - 1);
        break;
      case 'ArrowUp':
        next = Math.max(index - 1, 0);
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = options.length - 1;
        break;
      case 'Escape':
        e.preventDefault();
        closeAndReturnFocus();
        return;
      case 'Tab':
        // Let focus move on, and close the list behind it.
        setOpen(false);
        return;
      default:
        return;
    }
    e.preventDefault();
    options[next]?.focus();
  };

  const getColorToken = (partner: Partner) =>
    partner.tokens.find(t => t.key === 'colorPrimary')?.value || '#6366f1';

  return (
    <div ref={ref} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={`Partner: ${active?.name || 'none selected'}`}
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
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="Partner"
          onKeyDown={handleListKeyDown}
          className="absolute top-full left-0 mt-1 w-56 rounded-lg border shadow-xl z-50 overflow-hidden max-h-80 overflow-y-auto"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-secondary)',
          }}
        >
          {partners.map(p => (
            <button
              key={p.id}
              type="button"
              role="option"
              aria-selected={p.id === activePartnerId}
              tabIndex={-1}
              onClick={() => { onSelect(p.id); closeAndReturnFocus(); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left cursor-pointer transition-colors"
              style={{
                color: p.id === activePartnerId ? 'var(--accent-text)' : 'var(--text-primary)',
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
