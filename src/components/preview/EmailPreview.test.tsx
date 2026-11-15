import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { EmailPreview } from './EmailPreview';
import { wrapBlockForPreview } from '../../utils/templateEngine';

const html = `<html><head></head><body>
  ${wrapBlockForPreview('inst-a', '<p>Header block</p>')}
  ${wrapBlockForPreview('inst-b', '<p>Body block <a href="https://example.com/offer">Offer</a></p>')}
</body></html>`;

const previewDocument = () => screen.getByTitle<HTMLIFrameElement>('Email Preview').contentDocument!;

describe('EmailPreview', () => {
  it('writes the email into the frame', () => {
    render(<EmailPreview html={html} />);
    expect(previewDocument().body.textContent).toContain('Header block');
    expect(previewDocument().querySelectorAll('[data-instance]')).toHaveLength(2);
  });

  it('marks the selected block and moves the mark when the selection changes', () => {
    const { rerender } = render(<EmailPreview html={html} selectedInstanceId="inst-a" />);
    const selected = () =>
      Array.from(previewDocument().querySelectorAll('[data-selected]')).map(el => el.getAttribute('data-instance'));
    expect(selected()).toEqual(['inst-a']);

    rerender(<EmailPreview html={html} selectedInstanceId="inst-b" />);
    expect(selected()).toEqual(['inst-b']);

    rerender(<EmailPreview html={html} selectedInstanceId={null} />);
    expect(selected()).toEqual([]);
  });

  it('keeps the mark when the email is rewritten after a content edit', () => {
    const { rerender } = render(<EmailPreview html={html} selectedInstanceId="inst-b" />);
    rerender(<EmailPreview html={html.replace('Body block', 'Edited body')} selectedInstanceId="inst-b" />);

    const marked = previewDocument().querySelector('[data-selected]');
    expect(marked?.getAttribute('data-instance')).toBe('inst-b');
    expect(marked?.textContent).toContain('Edited body');
  });

  it('selects a block when it is clicked in the email', () => {
    const onSelectInstance = vi.fn();
    render(<EmailPreview html={html} onSelectInstance={onSelectInstance} />);

    previewDocument().querySelector<HTMLElement>('[data-instance="inst-b"] p')!.click();

    expect(onSelectInstance).toHaveBeenCalledWith('inst-b');
  });

  it('does not follow links inside the preview', () => {
    render(<EmailPreview html={html} onSelectInstance={() => {}} />);
    const doc = previewDocument();
    const click = new (doc.defaultView!.MouseEvent)('click', { bubbles: true, cancelable: true });

    doc.querySelector('a')!.dispatchEvent(click);

    expect(click.defaultPrevented).toBe(true);
  });

  it('switches between desktop and mobile widths', async () => {
    const user = userEvent.setup();
    render(<EmailPreview html={html} />);
    const frame = screen.getByTitle('Email Preview');
    expect(frame).toHaveStyle({ width: '620px' });
    expect(screen.getByRole('button', { name: 'Desktop' })).toHaveAttribute('aria-pressed', 'true');

    await user.click(screen.getByRole('button', { name: 'Mobile' }));

    expect(frame).toHaveStyle({ width: '375px' });
    expect(screen.getByRole('button', { name: 'Mobile' })).toHaveAttribute('aria-pressed', 'true');
  });
});
