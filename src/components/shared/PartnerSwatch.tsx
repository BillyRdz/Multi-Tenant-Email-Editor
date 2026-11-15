import type { Partner } from '../../types';
import { partnerPalette } from '../../utils/palette';

interface Props {
  partner: Pick<Partner, 'tokens'>;
  /** Size utilities for the strip, for example "w-10 h-3.5". */
  className?: string;
}

/**
 * A partner's palette as a strip of color bands, like a paint chip.
 * The first band (the primary color) is drawn wider. Decorative: the
 * partner's name always sits next to it as text.
 */
export function PartnerSwatch({ partner, className = 'w-10 h-3.5' }: Props) {
  const colors = partnerPalette(partner.tokens);

  return (
    <span
      aria-hidden="true"
      data-testid="partner-swatch"
      className={`inline-flex shrink-0 overflow-hidden rounded-xs ${className}`}
      style={{ border: '1px solid var(--border-input)' }}
    >
      {colors.map((color, index) => (
        <span key={index} style={{ backgroundColor: color, flex: index === 0 ? 2 : 1 }} />
      ))}
    </span>
  );
}
