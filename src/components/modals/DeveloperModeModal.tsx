import { useState, useId } from 'react';
import type { EmailComponent } from '../../types';
import { ComponentEditor } from './ComponentEditor';
import { useModalDialog } from '../../hooks/useModalDialog';
import { X, Plus, Variable } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  components: EmailComponent[];
  onCreate: (name: string, type: string, html: string) => void;
  onUpdate: (id: string, updates: Partial<Pick<EmailComponent, 'name' | 'type' | 'html'>>) => void;
  onDelete: (id: string) => void;
}

export function DeveloperModeModal({ isOpen, onClose, components, onCreate, onUpdate, onDelete }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const dialogRef = useModalDialog(isOpen, onClose);
  const titleId = useId();

  if (!isOpen) return null;

  const editingComp = editingId ? components.find(c => c.id === editingId) : null;

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
        className="relative w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row rounded-xl shadow-2xl overflow-y-auto md:overflow-hidden"
        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}
      >
        {/* Sidebar: Component list */}
        <div
          className="w-full md:w-72 shrink-0 border-b md:border-b-0 md:border-r flex flex-col"
          style={{ borderColor: 'var(--border-primary)' }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border-primary)' }}>
            <h2 id={titleId} className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Developer Mode</h2>
            <button onClick={onClose} aria-label="Close developer mode" className="rounded p-1 hover:bg-[var(--bg-hover)]" style={{ color: 'var(--text-secondary)' }}>
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {components.map(comp => (
              <button
                key={comp.id}
                onClick={() => { setEditingId(comp.id); setCreating(false); }}
                aria-current={editingId === comp.id ? 'true' : undefined}
                className={`flex h-8 w-full items-center gap-2 rounded px-2 text-left ${
                  editingId === comp.id ? 'font-semibold' : 'hover:bg-[var(--bg-hover)]'
                }`}
                style={{
                  backgroundColor: editingId === comp.id ? 'var(--select-tint)' : undefined,
                  boxShadow: editingId === comp.id ? 'inset 2px 0 0 var(--select)' : undefined,
                  color: 'var(--text-primary)',
                }}
              >
                <span className="text-sm truncate flex-1">{comp.name}</span>
                <span
                  className="tabular flex items-center gap-1 text-xs font-normal shrink-0"
                  style={{ color: 'var(--text-tertiary)' }}
                  title={`${comp.detectedVariables.length} variables`}
                >
                  <Variable size={10} />
                  {comp.detectedVariables.length}
                </span>
              </button>
            ))}
          </div>

          <div className="p-2 border-t" style={{ borderColor: 'var(--border-primary)' }}>
            <button
              onClick={() => { setCreating(true); setEditingId(null); }}
              className="flex w-full items-center justify-center gap-2 rounded py-1.5 text-sm font-semibold"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: '#fff',
              }}
            >
              <Plus size={14} />
              New Component
            </button>
          </div>
        </div>

        {/* Main: Editor */}
        <div className="flex-1 min-w-0 md:overflow-y-auto">
          {creating ? (
            <ComponentEditor
              key="new"
              onCreate={(name, type, html) => {
                onCreate(name, type, html);
                setCreating(false);
              }}
              onCancel={() => setCreating(false)}
            />
          ) : editingComp ? (
            <ComponentEditor
              key={editingComp.id}
              component={editingComp}
              onSave={(updates) => {
                onUpdate(editingComp.id, updates);
              }}
              onDelete={() => {
                onDelete(editingComp.id);
                setEditingId(null);
              }}
            />
          ) : (
            <p className="p-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Pick a component on the left to edit its HTML, or create a new one.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
