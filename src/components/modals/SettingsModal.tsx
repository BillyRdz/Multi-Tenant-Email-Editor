import { useState, lazy, Suspense } from 'react';
import { X, Settings, RotateCcw } from 'lucide-react';
import { defaultPreviewWrapper } from '../../data/defaultPreviewWrapper';

const MonacoEditor = lazy(() => import('@monaco-editor/react').then(m => ({ default: m.default })));

interface Props {
  isOpen: boolean;
  onClose: () => void;
  previewWrapper: string;
  onUpdatePreviewWrapper: (html: string) => void;
}

export function SettingsModal({ isOpen, onClose, previewWrapper, onUpdatePreviewWrapper }: Props) {
  const [html, setHtml] = useState(previewWrapper);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdatePreviewWrapper(html);
    onClose();
  };

  const handleReset = () => {
    setHtml(defaultPreviewWrapper);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={onClose} />
      <div
        className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border-primary)' }}>
          <div className="flex items-center gap-2">
            <Settings size={18} style={{ color: 'var(--accent-primary)' }} />
            <span className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Settings</span>
          </div>
          <button onClick={onClose} className="cursor-pointer p-1" style={{ color: 'var(--text-tertiary)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Preview Wrapper HTML</h4>
            <p className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>
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
              theme="vs-dark"
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
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md cursor-pointer"
            style={{ color: 'var(--text-secondary)' }}
          >
            <RotateCcw size={14} />
            Reset to Default
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm rounded-md cursor-pointer"
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
