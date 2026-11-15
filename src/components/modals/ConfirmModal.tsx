import { useState } from 'react';
import { useModalDialog } from '../../hooks/useModalDialog';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function generateMathProblem(): { question: string; answer: number } {
  const ops = ['+', '-'] as const;
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number;

  if (op === '+') {
    a = Math.floor(Math.random() * 20) + 1;
    b = Math.floor(Math.random() * 20) + 1;
  } else {
    a = Math.floor(Math.random() * 20) + 5;
    b = Math.floor(Math.random() * a) + 1;
  }

  return {
    question: `${a} ${op} ${b}`,
    answer: op === '+' ? a + b : a - b,
  };
}

export function ConfirmModal({ isOpen, ...dialogProps }: ConfirmModalProps) {
  // The dialog mounts fresh each time it opens, which clears the answer and
  // picks a new math problem without resetting state in an effect.
  if (!isOpen) return null;
  return <ConfirmDialog {...dialogProps} />;
}

function ConfirmDialog({ title, message, onConfirm, onCancel }: Omit<ConfirmModalProps, 'isOpen'>) {
  const [userAnswer, setUserAnswer] = useState('');
  const [problem] = useState(generateMathProblem);
  const dialogRef = useModalDialog(true, onCancel);

  const isCorrect = userAnswer.trim() !== '' && parseInt(userAnswer.trim(), 10) === problem.answer;

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-message"
    >
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(23,25,29,0.45)' }}
        onClick={onCancel}
      />
      <div
        className="relative rounded-xl shadow-2xl max-w-sm w-full mx-4 p-5"
        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}
      >
        <h2
          id="confirm-modal-title"
          className="text-base font-semibold mb-1"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h2>
        <p
          id="confirm-modal-message"
          className="text-sm mb-4"
          style={{ color: 'var(--text-secondary)' }}
        >
          {message}
        </p>

        <div className="mb-4">
          <label
            htmlFor="math-answer"
            className="block text-xs mb-1.5"
            style={{ color: 'var(--text-secondary)' }}
          >
            Solve to confirm: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{problem.question} = ?</span>
          </label>
          <input
            id="math-answer"
            type="text"
            inputMode="numeric"
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && isCorrect) onConfirm();
            }}
            placeholder="Your answer"
            data-autofocus
            className="tabular block w-full"
            style={isCorrect ? { borderColor: 'var(--accent-success)', boxShadow: 'inset 0 0 0 1px var(--accent-success)' } : undefined}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded px-3 py-1.5 text-sm hover:bg-[var(--bg-hover)]"
            style={{
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-input)',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!isCorrect}
            className="rounded px-3 py-1.5 text-sm font-semibold"
            style={{
              backgroundColor: isCorrect ? 'var(--accent-danger)' : 'var(--bg-hover)',
              color: isCorrect ? '#fff' : 'var(--text-tertiary)',
              cursor: isCorrect ? 'pointer' : 'not-allowed',
              opacity: isCorrect ? 1 : 0.6,
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
