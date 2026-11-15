import { useState, useRef, useEffect, useId } from 'react';
import type { KeyboardEvent } from 'react';
import type { Partner } from '../../types';
import { Check, ChevronDown } from 'lucide-react';
import { PartnerSwatch } from '../shared/PartnerSwatch';

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
        className="flex items-center gap-2.5 rounded py-1.5 pl-2 pr-1.5 text-sm font-semibold hover:bg-[var(--bg-hover)]"
        style={{
          backgroundColor: open ? 'var(--bg-hover)' : undefined,
          color: 'var(--text-primary)',
        }}
      >
        {active && <PartnerSwatch partner={active} className="w-11 h-4" />}
        <span className="truncate max-w-[11rem]">{active?.name || 'Select Partner'}</span>
        <ChevronDown size={14} style={{ color: 'var(--text-secondary)' }} />
      </button>

      {open && (
        <div
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="Partner"
          onKeyDown={handleListKeyDown}
          className="absolute top-full left-0 z-50 mt-1 max-h-[26rem] w-72 overflow-y-auto rounded-xl border py-1 shadow-xl"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-secondary)',
          }}
        >
          {partners.map(p => {
            const isCurrent = p.id === activePartnerId;
            return (
              <button
                key={p.id}
                type="button"
                role="option"
                aria-selected={isCurrent}
                tabIndex={-1}
                onClick={() => { onSelect(p.id); closeAndReturnFocus(); }}
                className={`flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-sm hover:bg-[var(--bg-hover)] ${
                  isCurrent ? 'font-semibold' : ''
                }`}
                style={{ color: 'var(--text-primary)' }}
              >
                <PartnerSwatch partner={p} className="w-11 h-4" />
                <span className="truncate flex-1">{p.name}</span>
                {isCurrent && <Check size={14} aria-hidden="true" style={{ color: 'var(--text-primary)' }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
