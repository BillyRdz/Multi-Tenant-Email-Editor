import type { CanvasInstance, EmailComponent, Partner } from '../../types';
import { classifyVariables } from '../../utils/templateEngine';
import { ContentFieldEditor } from './ContentFieldEditor';
import { Panel } from '../layout/Panel';

interface Props {
  instance: CanvasInstance | null;
  component: EmailComponent | null;
  partner: Partner;
  onUpdateContent: (instanceId: string, key: string, value: string) => void;
}

export function Inspector({ instance, component, partner, onUpdateContent }: Props) {
  if (!instance || !component) {
    return (
      <Panel title="Inspector">
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
          Select a block in the canvas or the preview to edit its content.
        </p>
      </Panel>
    );
  }

  const tokenKeys = partner.tokens.map(t => t.key);
  const { contentVars } = classifyVariables(component.detectedVariables, tokenKeys);

  return (
    <Panel title={`Inspector: ${component.name}`}>
      {contentVars.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
          This block uses only style tokens, so it has no content to edit.
        </p>
      ) : (
        <div className="space-y-3">
          {contentVars.map(varName => (
            <ContentFieldEditor
              key={varName}
              label={varName}
              value={instance.contentValues[varName] || ''}
              onChange={(value) => onUpdateContent(instance.id, varName, value)}
            />
          ))}
        </div>
      )}
    </Panel>
  );
}
