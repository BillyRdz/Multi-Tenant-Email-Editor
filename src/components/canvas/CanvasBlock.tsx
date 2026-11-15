import type { EmailComponent } from '../../types';
import { GripVertical, X, ArrowUp, ArrowDown } from 'lucide-react';

interface Props {
  component: EmailComponent;
  contentVarCount: number;
  isSelected: boolean;
  isDragging: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDragStart: (e: React.DragEvent) => void;
}

/**
 * One block of the email, as a row in the canvas outline.
 * The whole row is clickable and draggable for mouse users. The buttons do
 * the same jobs (select, reorder, remove) from the keyboard.
 */
export function CanvasBlock({
  component,
  contentVarCount,
  isSelected,
  isDragging,
  canMoveUp,
  canMoveDown,
  onSelect,
  onRemove,
  onMoveUp,
  onMoveDown,
  onDragStart,
}: Props) {
  const iconButton =
    'shrink-0 rounded p-1 hover:bg-[var(--border-primary)] disabled:opacity-35 disabled:hover:bg-transparent';

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onSelect}
      className={`-mx-2 flex h-8 items-center gap-1 rounded pl-1 pr-1 cursor-pointer ${
        isSelected ? '' : 'hover:bg-[var(--bg-hover)]'
      }`}
      style={{
        backgroundColor: isSelected ? 'var(--select-tint)' : undefined,
        // The bar marks the selected row without relying on the tint alone.
        boxShadow: isSelected ? 'inset 2px 0 0 var(--select)' : undefined,
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      <GripVertical
        size={12}
        className="shrink-0 cursor-grab active:cursor-grabbing"
        style={{ color: 'var(--text-tertiary)' }}
      />
      <button
        type="button"
        aria-pressed={isSelected}
        title="Select to edit its content"
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        className={`min-w-0 flex-1 truncate rounded px-1 text-left text-sm ${isSelected ? 'font-semibold' : ''}`}
        style={{ color: 'var(--text-primary)' }}
      >
        {component.name}
      </button>
      {contentVarCount > 0 && (
        <span
          className="tabular shrink-0 px-1 text-xs"
          style={{ color: 'var(--text-tertiary)' }}
          title={`${contentVarCount} content variables`}
        >
          {contentVarCount}
        </span>
      )}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
        disabled={!canMoveUp}
        aria-label={`Move ${component.name} up`}
        className={iconButton}
        style={{ color: 'var(--text-secondary)' }}
      >
        <ArrowUp size={14} />
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
        disabled={!canMoveDown}
        aria-label={`Move ${component.name} down`}
        className={iconButton}
        style={{ color: 'var(--text-secondary)' }}
      >
        <ArrowDown size={14} />
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        aria-label={`Remove ${component.name}`}
        className={`${iconButton} text-[var(--text-secondary)] hover:text-[var(--accent-danger-text)]`}
      >
        <X size={14} />
      </button>
    </div>
  );
}
