import type { EmailComponent } from '../../types';
import { GripVertical, Plus } from 'lucide-react';

interface Props {
  component: EmailComponent;
  onDragStart: () => void;
  onAdd: () => void;
}

/** One row of the component library. Drag it onto the canvas, or use its Add button. */
export function ComponentCard({ component, onDragStart, onAdd }: Props) {
  return (
    <li
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('componentId', component.id);
        e.dataTransfer.effectAllowed = 'copy';
        onDragStart();
      }}
      className="-mx-2 flex h-8 items-center gap-2 rounded px-2 cursor-grab active:cursor-grabbing hover:bg-[var(--bg-hover)]"
    >
      <GripVertical size={12} style={{ color: 'var(--text-tertiary)' }} className="shrink-0" />
      <span className="text-sm truncate flex-1" style={{ color: 'var(--text-primary)' }}>
        {component.name}
      </span>
      <span className="tabular text-xs shrink-0" style={{ color: 'var(--text-tertiary)' }}>
        {component.detectedVariables.length} vars
      </span>
      {/* Dragging needs a mouse. This button does the same thing from the keyboard or a touch screen. */}
      <button
        type="button"
        onClick={onAdd}
        aria-label={`Add ${component.name} to canvas`}
        title="Add to canvas"
        className="shrink-0 rounded p-1 hover:bg-[var(--border-primary)]"
        style={{ color: 'var(--text-secondary)' }}
      >
        <Plus size={14} />
      </button>
    </li>
  );
}
