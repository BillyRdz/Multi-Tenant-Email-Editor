import { useState, useMemo } from 'react';
import type { CanvasInstance, EmailComponent, Partner } from '../../types';
import { renderForSFMC, minifyHtml } from '../../utils/templateEngine';
import { Panel } from '../layout/Panel';
import { Copy, Check, Code, FileCode } from 'lucide-react';

interface Props {
  instances: CanvasInstance[];
  components: EmailComponent[];
  partner: Partner;
  previewWrapper: string;
}

export function SFMCExportTab({ instances, components, partner, previewWrapper }: Props) {
  const [copied, setCopied] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const [minify, setMinify] = useState(false);

  const exportHtml = useMemo(() => {
    const sortedInstances = [...instances].sort((a, b) => a.order - b.order);
    const bodyHtml = sortedInstances
      .map(inst => {
        const comp = components.find(c => c.id === inst.componentId);
        if (!comp) return '';
        // For SFMC: replace only style tokens, keep content vars as %%=v(@var)=%%
        return renderForSFMC(comp.html, partner);
      })
      .filter(Boolean)
      .join('\n');

    const fullHtml = previewWrapper.replace('%%CANVAS_CONTENT%%', bodyHtml);
    return minify ? minifyHtml(fullHtml) : fullHtml;
  }, [instances, components, partner, previewWrapper, minify]);

  const handleCopy = () => {
    navigator.clipboard.writeText(exportHtml).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Panel title="SFMC Export">
      <div className="space-y-3">
        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          Style tokens are replaced. Content variables remain as {'%%=v(@variable)=%%'} for SFMC personalization.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm rounded-md cursor-pointer transition-colors"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: '#fff',
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy HTML'}
          </button>
          <button
            onClick={() => setMinify(!minify)}
            className="flex items-center gap-2 py-2 px-3 text-sm rounded-md cursor-pointer transition-colors"
            style={{
              backgroundColor: minify ? 'var(--accent-warning)' : 'var(--bg-tertiary)',
              color: minify ? '#000' : 'var(--text-secondary)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <FileCode size={14} />
            {minify ? 'Minified' : 'Minify'}
          </button>
        </div>
        <button
          onClick={() => setShowSource(!showSource)}
          className="flex items-center gap-2 w-full py-1.5 text-xs cursor-pointer"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <Code size={12} />
          {showSource ? 'Hide Source' : 'View Source'}
        </button>
        {showSource && (
          <pre
            className="p-4 rounded-lg text-xs overflow-auto max-h-64 font-mono"
            style={{
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--accent-success)',
              border: '1px solid var(--border-primary)',
            }}
          >
            {exportHtml}
          </pre>
        )}
      </div>
    </Panel>
  );
}
