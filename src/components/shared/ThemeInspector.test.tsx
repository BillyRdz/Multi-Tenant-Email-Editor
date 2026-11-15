import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeInspector } from './ThemeInspector';
import { defaultPartners } from '../../data/defaultPartners';
import type { Partner } from '../../types';

const withToken = (partner: Partner, key: string, value: string): Partner => ({
  ...partner,
  tokens: partner.tokens.map(t => (t.key === key ? { ...t, value } : t)),
});

describe('ThemeInspector contrast check', () => {
  it('shows every pair passing for a sample partner', () => {
    render(<ThemeInspector partner={defaultPartners[0]} />);
    expect(screen.getAllByText('Pass')).toHaveLength(4);
    expect(screen.queryByText('Fail')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('All 4 checked pairs meet AA.');
  });

  it('flags a primary color that is too light for white button text', () => {
    render(<ThemeInspector partner={withToken(defaultPartners[0], 'colorPrimary', '#FF8000')} />);

    const row = screen.getByText('Button and header text').closest('li')!;
    expect(within(row).getByText('Fail')).toBeInTheDocument();
    expect(within(row).getByText('2.52:1')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('1 of 4 pairs fall below 4.5:1');
  });

  it('skips a pair when a token is not a hex color', () => {
    render(<ThemeInspector partner={withToken(defaultPartners[0], 'colorSecondary', 'navy')} />);

    const row = screen.getByText('Footer text').closest('li')!;
    expect(within(row).getByText('Skip')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('All 3 checked pairs meet AA.');
  });
});
