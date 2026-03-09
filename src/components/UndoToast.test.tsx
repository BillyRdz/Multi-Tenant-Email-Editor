import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { UndoToast } from './shared/UndoToast';

describe('UndoToast', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const defaultProps = {
    message: 'Deleted "Header"',
    onUndo: vi.fn(),
    onDismiss: vi.fn(),
  };

  it('renders the message', () => {
    render(<UndoToast {...defaultProps} />);
    expect(screen.getByText('Deleted "Header"')).toBeInTheDocument();
  });

  it('renders an Undo button', () => {
    render(<UndoToast {...defaultProps} />);
    expect(screen.getByText('Undo')).toBeInTheDocument();
  });

  it('calls onUndo when Undo is clicked', async () => {
    const onUndo = vi.fn();
    render(<UndoToast {...defaultProps} onUndo={onUndo} />);
    await userEvent.click(screen.getByText('Undo'));
    expect(onUndo).toHaveBeenCalledOnce();
  });

  it('auto-dismisses after duration', () => {
    const onDismiss = vi.fn();
    render(<UndoToast {...defaultProps} onDismiss={onDismiss} duration={3000} />);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('has role="status" for accessibility', () => {
    render(<UndoToast {...defaultProps} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
