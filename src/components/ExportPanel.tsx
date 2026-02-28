import { useState } from 'react';
import { minifyHtml } from '../utils/renderEmail';

interface Props {
  html: string;
}

export function ExportPanel({ html }: Props) {
  const [copied, setCopied] = useState(false);
  const [showSource, setShowSource] = useState(false);

  const handleCopy = (minify: boolean) => {
    const output = minify ? minifyHtml(html) : html;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Export</h3>
      <div className="flex gap-2">
        <button
          onClick={() => handleCopy(false)}
          className="flex-1 py-2 px-3 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-900 cursor-pointer"
        >
          {copied ? 'Copied!' : 'Copy HTML'}
        </button>
        <button
          onClick={() => handleCopy(true)}
          className="flex-1 py-2 px-3 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 cursor-pointer"
        >
          Copy Minified (SFMC)
        </button>
      </div>
      <button
        onClick={() => setShowSource(!showSource)}
        className="w-full py-1.5 text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
      >
        {showSource ? 'Hide Source' : 'View Source'}
      </button>
      {showSource && (
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-auto max-h-64 font-mono">
          {html}
        </pre>
      )}
    </div>
  );
}
