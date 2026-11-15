import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { PartnerDropdown } from './PartnerDropdown';
import type { Partner } from '../../types';

const partners: Partner[] = ['Alpha', 'Bravo', 'Charlie'].map(name => ({
  id: `partner-${name.toLowerCase()}`,
  name,
  slug: name.toLowerCase(),
  tokens: [{ key: 'colorPrimary', value: '#123456' }],
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
}));

function setup(activePartnerId = 'partner-alpha') {
  const onSelect = vi.fn();
  render(<PartnerDropdown partners={partners} activePartnerId={activePartnerId} onSelect={onSelect} />);
  return { onSelect, user: userEvent.setup(), trigger: screen.getByRole('button', { name: /Partner:/ }) };
}

describe('PartnerDropdown', () => {
  it('tells assistive tech whether the list is open', async () => {
    const { user, trigger } = setup();
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('listbox', { name: 'Partner' })).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('opens with the arrow key and focuses the current partner', async () => {
    const { user, trigger } = setup('partner-bravo');
    trigger.focus();

    await user.keyboard('{ArrowDown}');

    const current = screen.getByRole('option', { name: /Bravo/ });
    expect(current).toHaveAttribute('aria-selected', 'true');
    expect(current).toHaveFocus();
  });

  it('moves with the arrow keys, Home, and End, and picks with Enter', async () => {
    const { user, trigger, onSelect } = setup();
    trigger.focus();
    await user.keyboard('{ArrowDown}');

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: /Bravo/ })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('option', { name: /Charlie/ })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('option', { name: /Alpha/ })).toHaveFocus();
    await user.keyboard('{ArrowDown}{Enter}');

    expect(onSelect).toHaveBeenCalledWith('partner-bravo');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes on Escape without changing the partner', async () => {
    const { user, trigger, onSelect } = setup();
    await user.click(trigger);

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(onSelect).not.toHaveBeenCalled();
    expect(trigger).toHaveFocus();
  });
});
