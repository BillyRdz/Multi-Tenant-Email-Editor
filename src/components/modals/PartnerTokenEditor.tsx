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
        <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Key</span>
        <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Value</span>
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
            className="text-xs font-mono"
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: `1px solid ${duplicateIndices.has(idx) ? 'var(--accent-danger)' : 'var(--border-primary)'}`,
              color: 'var(--text-primary)',
              borderRadius: '4px',
              padding: '4px 8px',
            }}
          />
          <div className="flex items-center gap-1">
            {isColorValue(token.value) && (
              <input
                type="color"
                value={token.value}
                onChange={e => updateToken(idx, 'value', e.target.value)}
                className="w-6 h-6 rounded border cursor-pointer shrink-0"
                style={{ borderColor: 'var(--border-primary)' }}
              />
            )}
            <input
              type="text"
              value={token.value}
              onChange={e => updateToken(idx, 'value', e.target.value)}
              placeholder="value"
              className="flex-1 text-xs font-mono"
              style={{
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)',
                borderRadius: '4px',
                padding: '4px 8px',
              }}
            />
          </div>
          <span />
          <button
            onClick={() => setPendingDeleteIndex(idx)}
            className="cursor-pointer p-1 rounded"
            style={{ color: 'var(--accent-danger)' }}
          >
            <Trash2 size={12} />
          </button>
        </div>
      ))}

      {hasDuplicates && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-md text-xs"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid var(--accent-danger)',
            color: 'var(--accent-danger)',
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
          className="flex items-center gap-1 text-xs cursor-pointer"
          style={{ color: 'var(--accent-primary)' }}
        >
          <Plus size={12} />
          Add Token
        </button>

        <div className="flex-1" />

        {hasChanges && (
          <>
            <button
              onClick={handleDiscard}
              className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-md cursor-pointer transition-colors"
              style={{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-primary)',
              }}
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={!canSave}
              className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-md transition-colors"
              style={{
                backgroundColor: canSave ? 'var(--accent-success)' : 'var(--bg-tertiary)',
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
