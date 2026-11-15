import type { EmailComponent } from '../../types';
import { ComponentCard } from './ComponentCard';
import { Panel } from '../layout/Panel';

interface Props {
  components: EmailComponent[];
  onDragStart: (componentId: string) => void;
  onAdd: (componentId: string) => void;
}

// Badge text sits on a tint of its own color, so each color is light enough
// to keep 4.5:1 against that tint.
const typeBadgeColors: Record<string, string> = {
  header: '#60a5fa',
  body: '#22c55e',
  'ra-card': '#c084fc',
  footer: '#9ca3af',
  cta: '#f59e0b',
  custom: '#f472b6',
};

export function ComponentLibrary({ components, onDragStart, onAdd }: Props) {
  return (
    <Panel title="Component Library">
      <div className="space-y-2">
        {components.map(comp => (
          <ComponentCard
            key={comp.id}
            component={comp}
            badgeColor={typeBadgeColors[comp.type] || typeBadgeColors.custom}
            onDragStart={() => onDragStart(comp.id)}
            onAdd={() => onAdd(comp.id)}
          />
        ))}
      </div>
      {components.length === 0 && (
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
          No components yet. Use Developer Mode to create one.
        </p>
      )}
    </Panel>
  );
}
