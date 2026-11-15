import type { Partner } from '../../types';
import { Panel } from '../layout/Panel';
import { checkPartnerContrast, AA_MIN_CONTRAST } from '../../utils/contrast';
import { Check, X, Minus } from 'lucide-react';

interface Props {
  partner: Partner;
}

function isColorValue(value: string): boolean {
  return /^#[0-9a-fA-F]{3,8}$/.test(value) || /^(rgb|hsl)/.test(value);
}

export function ThemeInspector({ partner }: Props) {
  const colorTokens = partner.tokens.filter(t => isColorValue(t.value));
  const otherTokens = partner.tokens.filter(t => !isColorValue(t.value));
  const contrast = checkPartnerContrast(partner.tokens);
  const failing = contrast.filter(r => r.passes === false).length;
  const checked = contrast.filter(r => r.passes !== null).length;

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

        {/* Contrast: does this partner's palette keep email text readable? */}
        <div>
          <p className="font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
            Contrast (WCAG AA, {AA_MIN_CONTRAST}:1)
          </p>
          <ul className="space-y-1.5">
            {contrast.map(result => (
              <li key={result.label} className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="w-7 h-5 rounded shrink-0 flex items-center justify-center font-semibold"
                  style={{
                    color: result.foregroundColor,
                    backgroundColor: result.backgroundColor,
                    border: '1px solid var(--border-secondary)',
                  }}
                >
                  Aa
                </span>
                <span className="flex-1 min-w-0 truncate" style={{ color: 'var(--text-primary)' }}>{result.label}</span>
                <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>
                  {result.ratio === null ? 'n/a' : `${result.ratio.toFixed(2)}:1`}
                </span>
                {result.passes === null ? (
                  <span className="flex items-center gap-1 w-12" style={{ color: 'var(--text-tertiary)' }}>
                    <Minus size={12} /> Skip
                  </span>
                ) : result.passes ? (
                  <span className="flex items-center gap-1 w-12" style={{ color: 'var(--accent-success)' }}>
                    <Check size={12} /> Pass
                  </span>
                ) : (
                  <span className="flex items-center gap-1 w-12" style={{ color: 'var(--accent-danger-text)' }}>
                    <X size={12} /> Fail
                  </span>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-2" role="status" style={{ color: failing > 0 ? 'var(--accent-danger-text)' : 'var(--text-tertiary)' }}>
            {checked === 0
              ? 'No hex color tokens to check.'
              : failing === 0
                ? `All ${checked} checked pairs meet AA.`
                : `${failing} of ${checked} pairs fall below ${AA_MIN_CONTRAST}:1. Adjust the tokens in Partners.`}
          </p>
        </div>

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
