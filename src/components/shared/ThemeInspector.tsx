import type { Partner } from '../../types';
import { Panel } from '../layout/Panel';

interface Props {
  partner: Partner;
}

function isColorValue(value: string): boolean {
  return /^#[0-9a-fA-F]{3,8}$/.test(value) || /^(rgb|hsl)/.test(value);
}

export function ThemeInspector({ partner }: Props) {
  const colorTokens = partner.tokens.filter(t => isColorValue(t.value));
  const otherTokens = partner.tokens.filter(t => !isColorValue(t.value));

  return (
    <Panel title={`Theme: ${partner.name}`}>
      <div className="space-y-4 text-xs">
        {/* Color tokens */}
        {colorTokens.length > 0 && (
          <div>
            <p className="font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Colors</p>
            <div className="grid grid-cols-2 gap-2">
              {colorTokens.map(t => (
                <div key={t.key} className="flex items-center gap-2">
                  <span
                    className="w-5 h-5 rounded shrink-0"
                    style={{ backgroundColor: t.value, border: '1px solid var(--border-secondary)' }}
                  />
                  <div className="min-w-0">
                    <p style={{ color: 'var(--text-tertiary)' }} className="truncate">{t.key}</p>
                    <p className="font-mono" style={{ color: 'var(--text-primary)' }}>{t.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other tokens */}
        {otherTokens.length > 0 && (
          <div>
            <p className="font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Style Tokens</p>
            <div className="space-y-1">
              {otherTokens.map(t => (
                <div key={t.key} className="flex justify-between">
                  <span style={{ color: 'var(--text-tertiary)' }}>{t.key}</span>
                  <span className="font-mono truncate max-w-[150px]" style={{ color: 'var(--text-primary)' }}>{t.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
}
