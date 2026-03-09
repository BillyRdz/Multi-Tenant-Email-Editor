import { useRef, useEffect, useState } from 'react';
import { Monitor, Smartphone } from 'lucide-react';

interface Props {
  html: string;
}

export function EmailPreview({ html }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(html);
    doc.close();
  }, [html]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Preview
        </span>
        <div className="flex gap-1 ml-auto">
          <button
            onClick={() => setViewMode('desktop')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md cursor-pointer transition-colors"
            style={{
              backgroundColor: viewMode === 'desktop' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
              color: viewMode === 'desktop' ? '#fff' : 'var(--text-secondary)',
            }}
          >
            <Monitor size={12} />
            Desktop
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md cursor-pointer transition-colors"
            style={{
              backgroundColor: viewMode === 'mobile' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
              color: viewMode === 'mobile' ? '#fff' : 'var(--text-secondary)',
            }}
          >
            <Smartphone size={12} />
            Mobile
          </button>
        </div>
      </div>
      <div
        className="flex-1 rounded-lg overflow-hidden flex justify-center p-4"
        style={{ backgroundColor: 'var(--bg-tertiary)' }}
      >
        <iframe
          ref={iframeRef}
          title="Email Preview"
          className="bg-white shadow-lg transition-all duration-300"
          style={{
            width: viewMode === 'desktop' ? '620px' : '375px',
            height: '100%',
            minHeight: '500px',
            border: 'none',
            borderRadius: '8px',
          }}
        />
      </div>
    </div>
  );
}
