import type { EmailComponent } from '../../types';
import { ComponentCard } from './ComponentCard';
import { Panel } from '../layout/Panel';

interface Props {
  components: EmailComponent[];
  onDragStart: (componentId: string) => void;
  onAdd: (componentId: string) => void;
}

export function ComponentLibrary({ components, onDragStart, onAdd }: Props) {
  return (
    <Panel title="Component Library">
      {components.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
          No components yet. Use Developer Mode to create one.
        </p>
      ) : (
        <ul>
          {components.map(comp => (
            <ComponentCard
              key={comp.id}
              component={comp}
              onDragStart={() => onDragStart(comp.id)}
              onAdd={() => onAdd(comp.id)}
            />
          ))}
        </ul>
      )}
    </Panel>
  );
}
