import { useState } from 'react';
import type { EmailComponent } from '../../types';
import { ComponentEditor } from './ComponentEditor';
import { X, Plus, Code, Variable } from 'lucide-react';

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

  if (!isOpen) return null;

  const editingComp = editingId ? components.find(c => c.id === editingId) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={onClose} />
      <div
        className="relative w-full max-w-5xl max-h-[90vh] flex rounded-xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}
      >
        {/* Sidebar: Component list */}
        <div
          className="w-72 shrink-0 border-r flex flex-col"
          style={{ borderColor: 'var(--border-primary)' }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border-primary)' }}>
            <div className="flex items-center gap-2">
              <Code size={16} style={{ color: 'var(--accent-primary)' }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Developer Mode</span>
            </div>
            <button onClick={onClose} className="cursor-pointer p-1 rounded" style={{ color: 'var(--text-tertiary)' }}>
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {components.map(comp => (
              <button
                key={comp.id}
                onClick={() => { setEditingId(comp.id); setCreating(false); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left cursor-pointer transition-colors"
                style={{
                  backgroundColor: editingId === comp.id ? 'var(--bg-hover)' : 'transparent',
                  color: editingId === comp.id ? 'var(--accent-primary)' : 'var(--text-primary)',
                }}
                onMouseEnter={e => { if (editingId !== comp.id) e.currentTarget.style.backgroundColor = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (editingId !== comp.id) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <span className="text-sm font-medium truncate flex-1">{comp.name}</span>
                <span className="flex items-center gap-1 text-xs shrink-0" style={{ color: 'var(--text-tertiary)' }}>
                  <Variable size={10} />
                  {comp.detectedVariables.length}
                </span>
              </button>
            ))}
          </div>

          <div className="p-2 border-t" style={{ borderColor: 'var(--border-primary)' }}>
            <button
              onClick={() => { setCreating(true); setEditingId(null); }}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm rounded-lg cursor-pointer"
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
        <div className="flex-1 overflow-y-auto">
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
            <div className="flex items-center justify-center h-full" style={{ color: 'var(--text-tertiary)' }}>
              <div className="text-center">
                <Code size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-sm">Select a component to edit or create a new one.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
