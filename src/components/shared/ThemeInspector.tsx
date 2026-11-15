import type { Partner } from '../../types';
import { Panel } from '../layout/Panel';
import { PartnerSwatch } from './PartnerSwatch';
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

  const subheading = 'mb-1.5 text-xs font-semibold';
  const row = 'flex items-center gap-2 py-1';

  return (
    <Panel title={`Theme: ${partner.name}`}>
      <div className="space-y-4 text-xs">
        {/* The partner's palette as one strip, the way a brand sheet shows it. */}
        <PartnerSwatch partner={partner} className="h-7 w-full" />

        {/* Color tokens */}
        {colorTokens.length > 0 && (
          <div>
            <p className={subheading} style={{ color: 'var(--text-secondary)' }}>Colors</p>
            <ul>
              {colorTokens.map(t => (
                <li key={t.key} className={row}>
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 rounded-xs"
                    style={{ backgroundColor: t.value, border: '1px solid var(--border-input)' }}
                  />
                  <span className="min-w-0 flex-1 truncate" style={{ color: 'var(--text-primary)' }}>{t.key}</span>
                  <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>{t.value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Contrast: does this partner's palette keep email text readable? */}
        <div>
          <p className={subheading} style={{ color: 'var(--text-secondary)' }}>
            Contrast (WCAG AA, {AA_MIN_CONTRAST}:1)
          </p>
          <ul>
            {contrast.map(result => (
              <li key={result.label} className={row}>
                <span
                  aria-hidden="true"
                  className="flex h-5 w-7 shrink-0 items-center justify-center rounded-xs font-semibold"
                  style={{
                    color: result.foregroundColor,
                    backgroundColor: result.backgroundColor,
                    border: '1px solid var(--border-input)',
                  }}
                >
                  Aa
                </span>
                <span className="min-w-0 flex-1 truncate" style={{ color: 'var(--text-primary)' }}>{result.label}</span>
                <span className="tabular" style={{ color: 'var(--text-secondary)' }}>
                  {result.ratio === null ? 'n/a' : `${result.ratio.toFixed(2)}:1`}
                </span>
                {result.passes === null ? (
                  <span className="flex w-11 items-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
                    <Minus size={12} /> Skip
                  </span>
                ) : result.passes ? (
                  <span className="flex w-11 items-center gap-1 font-semibold" style={{ color: 'var(--accent-success)' }}>
                    <Check size={12} /> Pass
                  </span>
                ) : (
                  <span className="flex w-11 items-center gap-1 font-semibold" style={{ color: 'var(--accent-danger-text)' }}>
                    <X size={12} /> Fail
                  </span>
                )}
              </li>
            ))}
          </ul>
          <p
            className="mt-1.5"
            role="status"
            style={{ color: failing > 0 ? 'var(--accent-danger-text)' : 'var(--text-tertiary)' }}
          >
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
            <p className={subheading} style={{ color: 'var(--text-secondary)' }}>Style Tokens</p>
            <ul>
              {otherTokens.map(t => (
                <li key={t.key} className="flex justify-between gap-3 py-1">
                  <span style={{ color: 'var(--text-primary)' }}>{t.key}</span>
                  <span className="min-w-0 truncate font-mono" style={{ color: 'var(--text-secondary)' }}>{t.value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Panel>
  );
}
