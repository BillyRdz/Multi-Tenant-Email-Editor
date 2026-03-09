import { useState, useEffect, useMemo } from 'react';

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

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
  const [userAnswer, setUserAnswer] = useState('');

  const problem = useMemo(() => {
    if (isOpen) return generateMathProblem();
    return { question: '', answer: 0 };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) setUserAnswer('');
  }, [isOpen]);

  if (!isOpen) return null;

  const isCorrect = userAnswer.trim() !== '' && parseInt(userAnswer.trim(), 10) === problem.answer;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-message"
    >
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onClick={onCancel}
      />
      <div
        className="relative rounded-lg shadow-xl max-w-sm w-full mx-4 p-6"
        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}
      >
        <h2
          id="confirm-modal-title"
          className="text-lg font-semibold mb-2"
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

        <div
          className="rounded-md p-3 mb-4"
          style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}
        >
          <label
            htmlFor="math-answer"
            className="block text-xs font-medium mb-2"
            style={{ color: 'var(--text-tertiary)' }}
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
            autoFocus
            className="w-full text-sm rounded-md px-3 py-2"
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: `1px solid ${isCorrect ? 'var(--accent-success)' : 'var(--border-primary)'}`,
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!isCorrect}
            className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors"
            style={{
              backgroundColor: isCorrect ? 'var(--accent-danger)' : 'var(--bg-tertiary)',
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
