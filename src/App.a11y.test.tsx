import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { describe, it, expect } from 'vitest';
import App from './App';

// jsdom has no layout engine, so axe cannot measure color contrast here.
// Contrast is covered by the token values in index.css and by the partner
// contrast tests. This suite guards names, roles, labels, and structure.
async function violations(container: Element) {
  const results = await axe.run(container, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
    rules: { 'color-contrast': { enabled: false } },
    // The email previews render in iframes. They are partner content, not editor UI.
    iframes: false,
  });
  return results.violations.map(v => `${v.id}: ${v.nodes.map(n => n.html).join(' | ')}`);
}

describe('App accessibility (WCAG 2.1 A and AA rules)', () => {
  it('main view has no violations', async () => {
    const { container } = render(<App />);
    expect(await violations(container)).toEqual([]);
  });

  it('manage partners dialog has no violations and is labelled', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    await user.click(screen.getByRole('button', { name: 'Partners' }));
    const dialog = screen.getByRole('dialog', { name: 'Manage Partners' });
    await user.click(dialog.querySelector('button[aria-expanded]')!);

    expect(await violations(container)).toEqual([]);
  });

  it('every block control has a name', () => {
    render(<App />);
    for (const button of screen.getAllByRole('button')) {
      expect(button).toHaveAccessibleName();
    }
  });
});
