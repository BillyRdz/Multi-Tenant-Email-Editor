import { useState } from 'react';
import type { CanvasInstance, EmailComponent, Partner } from '../../types';
import { CanvasBlock } from './CanvasBlock';
import { renderForPreview, classifyVariables } from '../../utils/templateEngine';

interface Props {
  instances: CanvasInstance[];
  components: EmailComponent[];
  partner: Partner;
  selectedInstanceId: string | null;
  onSelectInstance: (id: string | null) => void;
  onDropComponent: (componentId: string) => void;
  onReorder: (instanceIds: string[]) => void;
  onRemoveInstance: (id: string) => void;
}

export function Canvas({
  instances,
  components,
  partner,
  selectedInstanceId,
  onSelectInstance,
  onDropComponent,
  onReorder,
  onRemoveInstance,
}: Props) {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggedInstanceId, setDraggedInstanceId] = useState<string | null>(null);

  const sortedInstances = [...instances].sort((a, b) => a.order - b.order);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = e.dataTransfer.types.includes('componentid') ? 'copy' : 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverIndex(null);

    const componentId = e.dataTransfer.getData('componentId');
    if (componentId) {
      onDropComponent(componentId);
      return;
    }

    const sourceInstanceId = e.dataTransfer.getData('instanceId');
    if (sourceInstanceId && dragOverIndex !== null) {
      const ids = sortedInstances.map(i => i.id);
      const sourceIdx = ids.indexOf(sourceInstanceId);
      if (sourceIdx !== -1) {
        ids.splice(sourceIdx, 1);
        ids.splice(dragOverIndex, 0, sourceInstanceId);
        onReorder(ids);
      }
    }
    setDraggedInstanceId(null);
  };

  const handleInstanceDragStart = (e: React.DragEvent, instanceId: string) => {
    e.dataTransfer.setData('instanceId', instanceId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedInstanceId(instanceId);
  };

  const handleInstanceDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const tokenKeys = partner.tokens.map(t => t.key);

  return (
    <div
      className="flex flex-col h-full rounded-lg border"
      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}
    >
      <div
        className="flex items-center px-4 py-3 border-b"
        style={{ borderColor: 'var(--border-primary)' }}
      >
        <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Canvas
        </h3>
        <span className="ml-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
          {instances.length} block{instances.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div
        className="flex-1 p-4 overflow-y-auto min-h-[400px]"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={() => setDragOverIndex(null)}
      >
        {sortedInstances.length === 0 ? (
          <div
            className="flex items-center justify-center h-full rounded-lg border-2 border-dashed"
            style={{ borderColor: 'var(--border-secondary)', color: 'var(--text-tertiary)' }}
          >
            <div className="text-center p-8">
              <p className="text-sm font-medium mb-1">Drop components here</p>
              <p className="text-xs">Drag from the Component Library on the left</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedInstances.map((instance, index) => {
              const comp = components.find(c => c.id === instance.componentId);
              if (!comp) return null;

              const { contentVars } = classifyVariables(comp.detectedVariables, tokenKeys);
              const renderedHtml = renderForPreview(comp.html, partner, instance.contentValues);

              return (
                <div
                  key={instance.id}
                  onDragOver={(e) => handleInstanceDragOver(e, index)}
                >
                  {dragOverIndex === index && draggedInstanceId && draggedInstanceId !== instance.id && (
                    <div
                      className="h-1 rounded-full mb-2"
                      style={{ backgroundColor: 'var(--accent-primary)' }}
                    />
                  )}
                  <CanvasBlock
                    instance={instance}
                    component={comp}
                    renderedHtml={renderedHtml}
                    contentVarCount={contentVars.length}
                    isSelected={selectedInstanceId === instance.id}
                    onSelect={() => onSelectInstance(instance.id === selectedInstanceId ? null : instance.id)}
                    onRemove={() => onRemoveInstance(instance.id)}
                    onDragStart={(e) => handleInstanceDragStart(e, instance.id)}
                    isDragging={draggedInstanceId === instance.id}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
