import { useRef, useEffect } from 'react';
import type { CanvasInstance, EmailComponent } from '../../types';
import { GripVertical, X, Variable, ArrowUp, ArrowDown } from 'lucide-react';

interface Props {
  instance: CanvasInstance;
  component: EmailComponent;
  renderedHtml: string;
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

export function CanvasBlock({
  component,
  renderedHtml,
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
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(`
      <html><head><style>
        body { margin: 0; padding: 0; overflow: hidden; pointer-events: none; }
        table { max-width: 100% !important; }
      </style></head>
      <body>${renderedHtml}</body></html>
    `);
    doc.close();
  }, [renderedHtml]);

  // The whole block is clickable and draggable for mouse users. The buttons in
  // the header do the same jobs (select, reorder, remove) from the keyboard.
  const iconButton = 'shrink-0 p-0.5 rounded cursor-pointer disabled:cursor-not-allowed disabled:opacity-30';

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onSelect}
      className="rounded-lg border cursor-pointer transition-all"
      style={{
        backgroundColor: 'var(--bg-tertiary)',
        borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-primary)',
        opacity: isDragging ? 0.4 : 1,
        boxShadow: isSelected ? '0 0 0 1px var(--accent-primary)' : 'none',
      }}
    >
      {/* Block header */}
      <div
        className="flex items-center gap-2 px-3 py-2 border-b"
        style={{ borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-primary)' }}
      >
        <GripVertical
          size={14}
          className="shrink-0 cursor-grab active:cursor-grabbing"
          style={{ color: 'var(--text-tertiary)' }}
        />
        <button
          type="button"
          aria-pressed={isSelected}
          title="Select to edit its content"
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          className="text-xs font-medium truncate flex-1 text-left cursor-pointer"
          style={{ color: 'var(--text-secondary)' }}
        >
          {component.name}
        </button>
        {contentVarCount > 0 && (
          <span
            className="flex items-center gap-1 text-xs"
            style={{ color: 'var(--text-tertiary)' }}
            title={`${contentVarCount} content variables`}
          >
            <Variable size={12} />
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
          className={iconButton}
          style={{ color: 'var(--accent-danger-text)' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <X size={14} />
        </button>
      </div>

      {/* Preview iframe */}
      <div className="p-2">
        <iframe
          ref={iframeRef}
          title={`Preview: ${component.name}`}
          className="w-full rounded border-0"
          style={{
            height: '120px',
            pointerEvents: 'none',
            backgroundColor: '#fff',
            borderRadius: '4px',
          }}
        />
      </div>
    </div>
  );
}
