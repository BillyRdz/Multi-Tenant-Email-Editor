import { useRef, useEffect } from 'react';
import type { CanvasInstance, EmailComponent } from '../../types';
import { GripVertical, X, Variable } from 'lucide-react';

interface Props {
  instance: CanvasInstance;
  component: EmailComponent;
  renderedHtml: string;
  contentVarCount: number;
  isSelected: boolean;
  isDragging: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onDragStart: (e: React.DragEvent) => void;
}

export function CanvasBlock({
  component,
  renderedHtml,
  contentVarCount,
  isSelected,
  isDragging,
  onSelect,
  onRemove,
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

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onSelect}
      className="rounded-lg border cursor-pointer transition-all group"
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
        <span className="text-xs font-medium truncate flex-1" style={{ color: 'var(--text-secondary)' }}>
          {component.name}
        </span>
        {contentVarCount > 0 && (
          <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
            <Variable size={12} />
            {contentVarCount}
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-0.5 rounded"
          style={{ color: 'var(--accent-danger)' }}
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
