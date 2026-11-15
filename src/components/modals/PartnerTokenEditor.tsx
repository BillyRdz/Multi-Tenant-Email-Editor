import { useState, useCallback, useMemo, useEffect } from 'react';
import type { StyleToken } from '../../types';
import { Plus, Trash2, AlertTriangle, Save } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';
import { UndoToast } from '../shared/UndoToast';

interface Props {
  tokens: StyleToken[];
  onSave: (tokens: StyleToken[]) => void;
}

function isColorValue(value: string): boolean {
  return /^#[0-9a-fA-F]{3,8}$/.test(value) || /^(rgb|hsl)/.test(value);
}

function tokensEqual(a: StyleToken[], b: StyleToken[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((t, i) => t.key === b[i].key && t.value === b[i].value);
}

export function PartnerTokenEditor({ tokens, onSave }: Props) {
  const [draft, setDraft] = useState<StyleToken[]>(tokens);
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(null);
  const [undoState, setUndoState] = useState<{ tokens: StyleToken[]; label: string } | null>(null);

  // Sync draft when parent tokens change (e.g. after undo at partner level)
  useEffect(() => {
    setDraft(tokens);
  }, [tokens]);

  const hasChanges = !tokensEqual(draft, tokens);

  // Track which indices have duplicate keys
  const duplicateIndices = useMemo(() => {
    const dupes = new Set<number>();
    const seen = new Map<string, number>();
    draft.forEach((t, i) => {
      if (t.key.trim() === '') return;
      const prev = seen.get(t.key);
      if (prev !== undefined) {
        dupes.add(prev);
        dupes.add(i);
      } else {
        seen.set(t.key, i);
      }
    });
    return dupes;
  }, [draft]);

  const hasDuplicates = duplicateIndices.size > 0;
  const canSave = hasChanges && !hasDuplicates;

  const updateToken = (index: number, field: 'key' | 'value', val: string) => {
    setDraft(prev => prev.map((t, i) =>
      i === index ? { ...t, [field]: val } : t
    ));
  };

  const addToken = () => {
    setDraft(prev => [...prev, { key: '', value: '' }]);
  };

  const handleSave = () => {
    if (canSave) onSave(draft);
  };

  const handleDiscard = () => {
    setDraft(tokens);
  };

  const confirmRemoveToken = () => {
    if (pendingDeleteIndex !== null) {
      const deletedToken = draft[pendingDeleteIndex];
      const prevDraft = [...draft];
      setDraft(draft.filter((_, i) => i !== pendingDeleteIndex));
      setUndoState({ tokens: prevDraft, label: deletedToken.key || '(empty)' });
      setPendingDeleteIndex(null);
    }
  };

  const handleUndo = useCallback(() => {
    if (undoState) {
      setDraft(undoState.tokens);
      setUndoState(null);
    }
  }, [undoState]);

  const pendingToken = pendingDeleteIndex !== null ? draft[pendingDeleteIndex] : null;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-center">
        <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Key</span>
        <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Value</span>
        <span />
        <span />
      </div>
      {draft.map((token, idx) => (
        <div key={idx} className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-center">
          <input
            type="text"
            value={token.key}
            onChange={e => updateToken(idx, 'key', e.target.value)}
            placeholder="tokenKey"
            aria-label={`Token ${idx + 1} key`}
            className="min-w-0 w-full font-mono"
            aria-invalid={duplicateIndices.has(idx) || undefined}
            style={duplicateIndices.has(idx) ? { borderColor: 'var(--accent-danger)', boxShadow: 'inset 0 0 0 1px var(--accent-danger)' } : undefined}
          />
          <div className="flex items-center gap-1 min-w-0">
            {isColorValue(token.value) && (
              <input
                type="color"
                value={token.value}
                onChange={e => updateToken(idx, 'value', e.target.value)}
                aria-label={`${token.key || `Token ${idx + 1}`} color picker`}
                className="h-7 w-7 shrink-0 cursor-pointer rounded border bg-transparent p-0"
                style={{ borderColor: 'var(--border-input)' }}
              />
            )}
            <input
              type="text"
              value={token.value}
              onChange={e => updateToken(idx, 'value', e.target.value)}
              placeholder="value"
              aria-label={`${token.key || `Token ${idx + 1}`} value`}
              className="flex-1 min-w-0 font-mono"
            />
          </div>
          <span />
          <button
            onClick={() => setPendingDeleteIndex(idx)}
            aria-label={`Delete token ${token.key || idx + 1}`}
            className="rounded p-1 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--accent-danger-text)]"
          >
            <Trash2 size={12} />
          </button>
        </div>
      ))}

      {hasDuplicates && (
        <div
          className="flex items-center gap-2 text-xs font-semibold"
          style={{
            color: 'var(--accent-danger-text)',
          }}
          role="alert"
        >
          <AlertTriangle size={12} />
          Duplicate token keys found. Each key must be unique.
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={addToken}
          className="flex items-center gap-1 rounded text-xs font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          <Plus size={12} />
          Add Token
        </button>

        <div className="flex-1" />

        {hasChanges && (
          <>
            <button
              onClick={handleDiscard}
              className="rounded px-3 py-1.5 text-xs hover:bg-[var(--bg-hover)]"
              style={{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-input)',
              }}
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={!canSave}
              className="flex items-center gap-1 rounded px-3 py-1.5 text-xs font-semibold"
              style={{
                backgroundColor: canSave ? 'var(--accent-primary)' : 'var(--bg-hover)',
                color: canSave ? '#fff' : 'var(--text-tertiary)',
                cursor: canSave ? 'pointer' : 'not-allowed',
                opacity: canSave ? 1 : 0.6,
              }}
            >
              <Save size={12} />
              Save Tokens
            </button>
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={pendingDeleteIndex !== null}
        title="Delete Token?"
        message={pendingToken ? `Remove token "${pendingToken.key || '(empty)'}"?` : ''}
        onConfirm={confirmRemoveToken}
        onCancel={() => setPendingDeleteIndex(null)}
      />

      {undoState && (
        <UndoToast
          message={`Token "${undoState.label}" deleted`}
          onUndo={handleUndo}
          onDismiss={() => setUndoState(null)}
        />
      )}
    </div>
  );
}
