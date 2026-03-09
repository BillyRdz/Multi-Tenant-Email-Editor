import type { EmailComponent } from '../../types';
import { ComponentCard } from './ComponentCard';
import { Panel } from '../layout/Panel';

interface Props {
  components: EmailComponent[];
  onDragStart: (componentId: string) => void;
}

const typeBadgeColors: Record<string, string> = {
  header: '#3b82f6',
  body: '#22c55e',
  'ra-card': '#a855f7',
  footer: '#6b7280',
  cta: '#f59e0b',
  custom: '#ec4899',
};

export function ComponentLibrary({ components, onDragStart }: Props) {
  return (
    <Panel title="Component Library">
      <div className="space-y-2">
        {components.map(comp => (
          <ComponentCard
            key={comp.id}
            component={comp}
            badgeColor={typeBadgeColors[comp.type] || typeBadgeColors.custom}
            onDragStart={() => onDragStart(comp.id)}
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
