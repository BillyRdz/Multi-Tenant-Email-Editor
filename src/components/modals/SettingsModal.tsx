import { useState, useId, lazy, Suspense } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { defaultPreviewWrapper } from '../../data/defaultPreviewWrapper';
import { useModalDialog } from '../../hooks/useModalDialog';

const MonacoEditor = lazy(() => import('@monaco-editor/react').then(m => ({ default: m.default })));

interface Props {
  isOpen: boolean;
  onClose: () => void;
  previewWrapper: string;
  onUpdatePreviewWrapper: (html: string) => void;
}

export function SettingsModal({ isOpen, onClose, previewWrapper, onUpdatePreviewWrapper }: Props) {
  const [html, setHtml] = useState(previewWrapper);
  const dialogRef = useModalDialog(isOpen, onClose);
  const titleId = useId();

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdatePreviewWrapper(html);
    onClose();
  };

  const handleReset = () => {
    setHtml(defaultPreviewWrapper);
  };

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(23,25,29,0.45)' }} onClick={onClose} />
      <div
        className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border-primary)' }}>
          <h2 id={titleId} className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Settings</h2>
          <button onClick={onClose} aria-label="Close settings" className="rounded p-1 hover:bg-[var(--bg-hover)]" style={{ color: 'var(--text-secondary)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Preview Wrapper HTML</h3>
            <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
              The HTML document wrapper for preview and export. Use {'%%CANVAS_CONTENT%%'} as the placeholder for canvas blocks.
            </p>
          </div>
        </div>

        <div className="flex-1 min-h-[300px] px-6">
          <Suspense fallback={
            <div className="flex items-center justify-center h-full" style={{ color: 'var(--text-tertiary)' }}>
              Loading editor...
            </div>
          }>
            <MonacoEditor
              height="300px"
              language="html"
              theme="vs"
              value={html}
              onChange={(value) => setHtml(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </Suspense>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded px-3 py-1.5 text-sm hover:bg-[var(--bg-hover)]"
            style={{ color: 'var(--text-primary)' }}
          >
            <RotateCcw size={14} />
            Reset to Default
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded px-3 py-1.5 text-sm hover:bg-[var(--bg-hover)]"
              style={{ color: 'var(--text-primary)' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="rounded px-3 py-1.5 text-sm font-semibold"
              style={{ backgroundColor: 'var(--accent-primary)', color: '#fff' }}
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
