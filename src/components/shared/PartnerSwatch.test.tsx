import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PartnerSwatch } from './PartnerSwatch';
import { defaultPartners } from '../../data/defaultPartners';

describe('PartnerSwatch', () => {
  it('draws one band per palette color, with the primary color first', () => {
    render(<PartnerSwatch partner={defaultPartners[0]} />);
    const bands = Array.from(screen.getByTestId('partner-swatch').children) as HTMLElement[];
    const primary = defaultPartners[0].tokens.find(t => t.key === 'colorPrimary')!.value;

    expect(bands).toHaveLength(5);
    expect(bands[0]).toHaveStyle({ backgroundColor: primary });
  });

  it('is hidden from assistive tech, since the partner name is always shown as text', () => {
    render(<PartnerSwatch partner={defaultPartners[0]} />);
    expect(screen.getByTestId('partner-swatch')).toHaveAttribute('aria-hidden', 'true');
  });

  it('still draws a strip for a partner with no color tokens', () => {
    render(<PartnerSwatch partner={{ tokens: [{ key: 'fontFamily', value: 'Arial' }] }} />);
    expect(screen.getByTestId('partner-swatch').children).toHaveLength(1);
  });
});
