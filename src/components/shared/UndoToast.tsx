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
      {/* Ink on the light desk, so it reads as a message and not as another panel. */}
      <div
        className={`pointer-events-auto flex items-center gap-4 rounded-xl py-2.5 pl-4 pr-2.5 text-sm shadow-xl transition-all duration-300 ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
        style={{ backgroundColor: 'var(--accent-primary)', color: '#fff' }}
        role="status"
        aria-live="polite"
      >
        <span>{message}</span>
        <button
          type="button"
          onClick={handleUndo}
          className="flex shrink-0 items-center gap-1 rounded px-2 py-1 font-semibold hover:bg-[var(--accent-primary-hover)]"
          style={{ color: '#fff', outlineColor: '#fff' }}
        >
          <Undo2 size={14} />
          Undo
        </button>
      </div>
    </div>
  );
}
