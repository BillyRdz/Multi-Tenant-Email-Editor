import { useEffect, useState } from 'react';
import { Undo2 } from 'lucide-react';

interface UndoToastProps {
  message: string;
  onUndo: () => void;
  duration?: number;
  onDismiss: () => void;
}

export function UndoToast({ message, onUndo, duration = 5000, onDismiss }: UndoToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  const handleUndo = () => {
    onUndo();
    setVisible(false);
    setTimeout(onDismiss, 300);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[110] flex justify-center pointer-events-none pb-6">
      <div
        className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm transition-all duration-300 ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
        style={{
          backgroundColor: 'var(--bg-elevated)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-secondary)',
        }}
        role="status"
        aria-live="polite"
      >
        <span>{message}</span>
        <button
          type="button"
          onClick={handleUndo}
          className="flex items-center gap-1 font-semibold shrink-0 cursor-pointer transition-colors"
          style={{ color: 'var(--accent-primary)' }}
        >
          <Undo2 size={14} />
          Undo
        </button>
      </div>
    </div>
  );
}
