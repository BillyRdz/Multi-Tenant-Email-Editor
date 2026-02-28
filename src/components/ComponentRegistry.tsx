import { useState, useRef } from 'react';
import type { EmailComponent } from '../types';

interface Props {
  components: EmailComponent[];
  activeComponentIds: string[];
  onToggle: (id: string) => void;
  onCreate: (name: string, type: EmailComponent['type'], html: string) => void;
  onUpdate: (id: string, updates: Partial<Pick<EmailComponent, 'name' | 'type' | 'html'>>) => void;
  onDelete: (id: string) => void;
  onReorder: (ids: string[]) => void;
}

const COMPONENT_TYPES: EmailComponent['type'][] = ['header', 'body', 'ra-card', 'footer', 'cta', 'custom'];

export function ComponentRegistry({
  components,
  activeComponentIds,
  onToggle,
  onCreate,
  onUpdate,
  onDelete,
  onReorder,
}: Props) {
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<EmailComponent['type']>('custom');
  const [newHtml, setNewHtml] = useState('');
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const dragItemId = useRef<string | null>(null);

  const handleCreate = () => {
    if (!newName.trim() || !newHtml.trim()) return;
    onCreate(newName.trim(), newType, newHtml);
    setNewName('');
    setNewType('custom');
    setNewHtml('');
    setShowCreate(false);
  };

  const moveComponent = (id: string, direction: 'up' | 'down') => {
    const idx = activeComponentIds.indexOf(id);
    if (idx === -1) return;
    const newIds = [...activeComponentIds];
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= newIds.length) return;
    [newIds[idx], newIds[swapIdx]] = [newIds[swapIdx], newIds[idx]];
    onReorder(newIds);
  };

  const handleDragStart = (id: string) => {
    dragItemId.current = id;
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setDragOverId(id);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDragOverId(null);
    const sourceId = dragItemId.current;
    if (!sourceId || sourceId === targetId) return;
    const newIds = [...activeComponentIds];
    const sourceIdx = newIds.indexOf(sourceId);
    const targetIdx = newIds.indexOf(targetId);
    if (sourceIdx === -1 || targetIdx === -1) return;
    newIds.splice(sourceIdx, 1);
    newIds.splice(targetIdx, 0, sourceId);
    onReorder(newIds);
    dragItemId.current = null;
  };

  const handleDragEnd = () => {
    setDragOverId(null);
    dragItemId.current = null;
  };

  const orderedActive = activeComponentIds
    .map(id => components.find(c => c.id === id))
    .filter((c): c is EmailComponent => !!c);
  const inactive = components.filter(c => !activeComponentIds.includes(c.id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Components</h3>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer"
        >
          {showCreate ? 'Cancel' : '+ New'}
        </button>
      </div>

      {showCreate && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
          <input
            type="text"
            placeholder="Component Name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
          />
          <select
            value={newType}
            onChange={e => setNewType(e.target.value as EmailComponent['type'])}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
          >
            {COMPONENT_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <textarea
            placeholder="HTML template (use ${theme.colors.primary} etc.)"
            value={newHtml}
            onChange={e => setNewHtml(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md font-mono"
          />
          <button
            onClick={handleCreate}
            className="w-full py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 cursor-pointer"
          >
            Create Component
          </button>
        </div>
      )}

      {/* Active components (ordered, draggable) */}
      <div className="space-y-1">
        <p className="text-xs text-gray-500 font-medium">Active (drag to reorder)</p>
        {orderedActive.map((comp, idx) => (
          <div
            key={comp.id}
            draggable
            onDragStart={() => handleDragStart(comp.id)}
            onDragOver={e => handleDragOver(e, comp.id)}
            onDrop={e => handleDrop(e, comp.id)}
            onDragEnd={handleDragEnd}
            className={`transition-all ${dragOverId === comp.id ? 'ring-2 ring-indigo-400 ring-offset-1' : ''}`}
          >
            <ComponentItem
              comp={comp}
              isActive={true}
              isEditing={editingId === comp.id}
              canMoveUp={idx > 0}
              canMoveDown={idx < orderedActive.length - 1}
              onToggle={() => onToggle(comp.id)}
              onEdit={() => setEditingId(editingId === comp.id ? null : comp.id)}
              onUpdate={onUpdate}
              onDelete={() => onDelete(comp.id)}
              onMoveUp={() => moveComponent(comp.id, 'up')}
              onMoveDown={() => moveComponent(comp.id, 'down')}
            />
          </div>
        ))}
      </div>

      {/* Inactive components */}
      {inactive.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-gray-500 font-medium">Inactive</p>
          {inactive.map(comp => (
            <ComponentItem
              key={comp.id}
              comp={comp}
              isActive={false}
              isEditing={editingId === comp.id}
              canMoveUp={false}
              canMoveDown={false}
              onToggle={() => onToggle(comp.id)}
              onEdit={() => setEditingId(editingId === comp.id ? null : comp.id)}
              onUpdate={onUpdate}
              onDelete={() => onDelete(comp.id)}
              onMoveUp={() => {}}
              onMoveDown={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ComponentItemProps {
  comp: EmailComponent;
  isActive: boolean;
  isEditing: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onUpdate: (id: string, updates: Partial<Pick<EmailComponent, 'name' | 'type' | 'html'>>) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function ComponentItem({
  comp, isActive, isEditing, canMoveUp, canMoveDown,
  onToggle, onEdit, onUpdate, onDelete, onMoveUp, onMoveDown,
}: ComponentItemProps) {
  const [editHtml, setEditHtml] = useState(comp.html);
  const [editName, setEditName] = useState(comp.name);

  const handleSave = () => {
    onUpdate(comp.id, { name: editName, html: editHtml });
    onEdit(); // close
  };

  const typeColors: Record<string, string> = {
    header: 'bg-blue-100 text-blue-700',
    body: 'bg-green-100 text-green-700',
    'ra-card': 'bg-purple-100 text-purple-700',
    footer: 'bg-gray-200 text-gray-700',
    cta: 'bg-orange-100 text-orange-700',
    custom: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div className={`rounded-lg border ${isActive ? 'border-indigo-200 bg-white' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
      <div className="flex items-center gap-2 px-3 py-2">
        {isActive && (
          <span className="cursor-grab text-gray-400 hover:text-gray-600 select-none" title="Drag to reorder">⠿</span>
        )}
        <input
          type="checkbox"
          checked={isActive}
          onChange={onToggle}
          className="shrink-0"
        />
        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${typeColors[comp.type] || typeColors.custom}`}>
          {comp.type}
        </span>
        <span className="text-sm font-medium text-gray-800 flex-1 truncate">{comp.name}</span>
        {isActive && (
          <div className="flex gap-0.5">
            <button onClick={onMoveUp} disabled={!canMoveUp} className="text-gray-400 hover:text-gray-700 disabled:opacity-30 text-xs cursor-pointer">▲</button>
            <button onClick={onMoveDown} disabled={!canMoveDown} className="text-gray-400 hover:text-gray-700 disabled:opacity-30 text-xs cursor-pointer">▼</button>
          </div>
        )}
        <button onClick={onEdit} className="text-xs text-indigo-600 hover:text-indigo-800 cursor-pointer">
          {isEditing ? 'Close' : 'Edit'}
        </button>
        <button onClick={onDelete} className="text-xs text-red-500 hover:text-red-700 cursor-pointer">Del</button>
      </div>
      {isEditing && (
        <div className="border-t border-gray-200 p-3 space-y-2">
          <input
            type="text"
            value={editName}
            onChange={e => setEditName(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          />
          <textarea
            value={editHtml}
            onChange={e => setEditHtml(e.target.value)}
            rows={8}
            className="w-full px-2 py-1 text-xs font-mono border border-gray-300 rounded"
          />
          <button onClick={handleSave} className="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700 cursor-pointer">
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
