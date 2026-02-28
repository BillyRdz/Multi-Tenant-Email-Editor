import { useRef, useEffect, useState } from 'react';

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
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Preview</span>
        <div className="flex gap-1 ml-auto">
          <button
            onClick={() => setViewMode('desktop')}
            className={`px-3 py-1 text-xs rounded cursor-pointer ${
              viewMode === 'desktop' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600'
            }`}
          >
            Desktop
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`px-3 py-1 text-xs rounded cursor-pointer ${
              viewMode === 'mobile' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600'
            }`}
          >
            Mobile
          </button>
        </div>
      </div>
      <div className="flex-1 bg-gray-200 rounded-lg overflow-hidden flex justify-center p-4">
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
