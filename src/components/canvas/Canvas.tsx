import { useState } from 'react';
import type { CanvasInstance, EmailComponent, Partner } from '../../types';
import { CanvasBlock } from './CanvasBlock';
import { classifyVariables } from '../../utils/templateEngine';

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

/**
 * The email's blocks in order, as an outline. The rendered email itself is
 * the preview in the middle of the screen; this list is where blocks are
 * added, reordered, selected, and removed.
 */
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
  // Read out by screen readers after a block is moved with the arrow buttons.
  const [announcement, setAnnouncement] = useState('');

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

  // Keyboard path for reordering: swap a block with its neighbor.
  const moveInstance = (index: number, direction: -1 | 1, name: string) => {
    const target = index + direction;
    if (target < 0 || target >= sortedInstances.length) return;
    const ids = sortedInstances.map(i => i.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    onReorder(ids);
    setAnnouncement(`${name} moved to position ${target + 1} of ${ids.length}`);
  };

  const tokenKeys = partner.tokens.map(t => t.key);

  return (
    <section className="border-b" style={{ borderColor: 'var(--border-primary)' }}>
      <div className="flex items-baseline gap-2 px-4 pt-3.5 pb-2">
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Canvas
        </h2>
        <span className="tabular text-xs" style={{ color: 'var(--text-tertiary)' }}>
          {instances.length} block{instances.length !== 1 ? 's' : ''}
        </span>
        <span className="sr-only" role="status" aria-live="polite">{announcement}</span>
      </div>

      <div
        className="min-h-40 px-4 pb-4"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={() => setDragOverIndex(null)}
      >
        {sortedInstances.length === 0 ? (
          <div
            className="rounded border border-dashed px-4 py-6 text-center"
            style={{ borderColor: 'var(--border-input)', color: 'var(--text-secondary)' }}
          >
            <p className="text-sm font-semibold">This email has no blocks yet</p>
            <p className="mt-1 text-xs">Drag one in from the Component Library, or use its Add button.</p>
          </div>
        ) : (
          <ol>
            {sortedInstances.map((instance, index) => {
              const comp = components.find(c => c.id === instance.componentId);
              if (!comp) return null;

              const { contentVars } = classifyVariables(comp.detectedVariables, tokenKeys);
              const showDropLine =
                dragOverIndex === index && draggedInstanceId !== null && draggedInstanceId !== instance.id;

              return (
                <li
                  key={instance.id}
                  onDragOver={(e) => handleInstanceDragOver(e, index)}
                  style={{ boxShadow: showDropLine ? '0 -2px 0 var(--select)' : undefined }}
                >
                  <CanvasBlock
                    component={comp}
                    contentVarCount={contentVars.length}
                    isSelected={selectedInstanceId === instance.id}
                    onSelect={() => onSelectInstance(instance.id === selectedInstanceId ? null : instance.id)}
                    onRemove={() => onRemoveInstance(instance.id)}
                    canMoveUp={index > 0}
                    canMoveDown={index < sortedInstances.length - 1}
                    onMoveUp={() => moveInstance(index, -1, comp.name)}
                    onMoveDown={() => moveInstance(index, 1, comp.name)}
                    onDragStart={(e) => handleInstanceDragStart(e, instance.id)}
                    isDragging={draggedInstanceId === instance.id}
                  />
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}
