import type { EmailComponent } from '../../types';
import { GripVertical } from 'lucide-react';

interface Props {
  component: EmailComponent;
  badgeColor: string;
  onDragStart: () => void;
}

export function ComponentCard({ component, badgeColor, onDragStart }: Props) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('componentId', component.id);
        e.dataTransfer.effectAllowed = 'copy';
        onDragStart();
      }}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-grab active:cursor-grabbing transition-colors border"
      style={{
        backgroundColor: 'var(--bg-tertiary)',
        borderColor: 'var(--border-primary)',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-secondary)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-primary)')}
    >
      <GripVertical size={14} style={{ color: 'var(--text-tertiary)' }} className="shrink-0" />
      <span
        className="text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase shrink-0"
        style={{ backgroundColor: badgeColor + '20', color: badgeColor }}
      >
        {component.type}
      </span>
      <span className="text-sm font-medium truncate flex-1" style={{ color: 'var(--text-primary)' }}>
        {component.name}
      </span>
      <span className="text-xs shrink-0" style={{ color: 'var(--text-tertiary)' }}>
        {component.detectedVariables.length} vars
      </span>
    </div>
  );
}
