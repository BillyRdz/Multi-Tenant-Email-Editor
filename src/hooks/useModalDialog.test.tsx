import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { useModalDialog } from './useModalDialog';

function Dialog({ label, onClose, children }: { label: string; onClose: () => void; children?: React.ReactNode }) {
  const ref = useModalDialog(true, onClose);
  return (
    <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={label}>
      <button>First in {label}</button>
      <button>Last in {label}</button>
      {children}
    </div>
  );
}

function Harness({ onClose = () => {}, nested = false }: { onClose?: () => void; nested?: boolean }) {
  const [open, setOpen] = useState(false);
  const [innerOpen, setInnerOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      {open && (
        <Dialog label="outer" onClose={() => { onClose(); setOpen(false); }}>
          {nested && <button onClick={() => setInnerOpen(true)}>Open inner</button>}
        </Dialog>
      )}
      {innerOpen && <Dialog label="inner" onClose={() => setInnerOpen(false)} />}
    </>
  );
}

describe('useModalDialog', () => {
  it('moves focus into the dialog when it opens', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByText('Open'));
    expect(screen.getByText('First in outer')).toHaveFocus();
  });

  it('starts on the element marked data-autofocus when there is one', () => {
    function WithPreferred() {
      const ref = useModalDialog(true, () => {});
      return (
        <div ref={ref} tabIndex={-1} role="dialog" aria-label="preferred">
          <button>Cancel</button>
          <input aria-label="Answer" data-autofocus />
        </div>
      );
    }
    render(<WithPreferred />);
    expect(screen.getByLabelText('Answer')).toHaveFocus();
  });

  it('keeps Tab and Shift+Tab inside the dialog', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByText('Open'));

    await user.tab();
    expect(screen.getByText('Last in outer')).toHaveFocus();
    await user.tab();
    expect(screen.getByText('First in outer')).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByText('Last in outer')).toHaveFocus();
  });

  it('closes on Escape and returns focus to the opener', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    await user.click(screen.getByText('Open'));

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText('Open')).toHaveFocus();
  });

  it('only the top dialog reacts to Escape when two are open', async () => {
    const user = userEvent.setup();
    const onOuterClose = vi.fn();
    render(<Harness onClose={onOuterClose} nested />);
    await user.click(screen.getByText('Open'));
    await user.click(screen.getByText('Open inner'));
    expect(screen.getByText('First in inner')).toHaveFocus();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog', { name: 'inner' })).not.toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'outer' })).toBeInTheDocument();
    expect(onOuterClose).not.toHaveBeenCalled();
    expect(screen.getByText('Open inner')).toHaveFocus();
  });
});
