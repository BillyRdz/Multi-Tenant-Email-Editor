import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ConfirmModal } from './modals/ConfirmModal';

describe('ConfirmModal', () => {
  const defaultProps = {
    isOpen: true,
    title: 'Delete Item?',
    message: 'Are you sure you want to delete this?',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  it('renders nothing when closed', () => {
    const { container } = render(<ConfirmModal {...defaultProps} isOpen={false} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders title and message when open', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByText('Delete Item?')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this?')).toBeInTheDocument();
  });

  it('shows a math problem', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByText(/Solve to confirm:/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your answer')).toBeInTheDocument();
  });

  it('Delete button is disabled until correct answer is entered', () => {
    render(<ConfirmModal {...defaultProps} />);
    const deleteBtn = screen.getByText('Delete');
    expect(deleteBtn).toBeDisabled();
  });

  it('enables Delete button when correct answer is entered', async () => {
    const user = userEvent.setup();
    render(<ConfirmModal {...defaultProps} />);

    // Extract the math problem from the label
    const label = screen.getByText(/Solve to confirm:/).textContent!;
    const match = label.match(/(\d+)\s*([+-])\s*(\d+)/);
    expect(match).toBeTruthy();

    const a = parseInt(match![1], 10);
    const op = match![2];
    const b = parseInt(match![3], 10);
    const answer = op === '+' ? a + b : a - b;

    const input = screen.getByPlaceholderText('Your answer');
    await user.type(input, String(answer));

    const deleteBtn = screen.getByText('Delete');
    expect(deleteBtn).not.toBeDisabled();
  });

  it('calls onConfirm when correct answer entered and Delete clicked', async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(<ConfirmModal {...defaultProps} onConfirm={onConfirm} />);

    const label = screen.getByText(/Solve to confirm:/).textContent!;
    const match = label.match(/(\d+)\s*([+-])\s*(\d+)/);
    const a = parseInt(match![1], 10);
    const op = match![2];
    const b = parseInt(match![3], 10);
    const answer = op === '+' ? a + b : a - b;

    await user.type(screen.getByPlaceholderText('Your answer'), String(answer));
    await user.click(screen.getByText('Delete'));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('does not call onConfirm when wrong answer entered and Delete clicked', async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(<ConfirmModal {...defaultProps} onConfirm={onConfirm} />);

    await user.type(screen.getByPlaceholderText('Your answer'), '99999');
    const deleteBtn = screen.getByText('Delete');
    expect(deleteBtn).toBeDisabled();
  });

  it('calls onCancel when Cancel button is clicked', async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(<ConfirmModal {...defaultProps} onCancel={onCancel} />);
    await user.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('calls onConfirm on Enter key when answer is correct', async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(<ConfirmModal {...defaultProps} onConfirm={onConfirm} />);

    const label = screen.getByText(/Solve to confirm:/).textContent!;
    const match = label.match(/(\d+)\s*([+-])\s*(\d+)/);
    const a = parseInt(match![1], 10);
    const op = match![2];
    const b = parseInt(match![3], 10);
    const answer = op === '+' ? a + b : a - b;

    const input = screen.getByPlaceholderText('Your answer');
    await user.type(input, String(answer));
    await user.keyboard('{Enter}');
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('has correct aria attributes', () => {
    render(<ConfirmModal {...defaultProps} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'confirm-modal-title');
    expect(dialog).toHaveAttribute('aria-describedby', 'confirm-modal-message');
  });
});
