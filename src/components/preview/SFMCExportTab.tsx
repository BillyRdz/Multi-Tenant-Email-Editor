import { useState, useMemo } from 'react';
import type { CanvasInstance, EmailComponent, Partner } from '../../types';
import { renderForSFMC, minifyHtml } from '../../utils/templateEngine';
import { Panel } from '../layout/Panel';
import { Copy, Check, ChevronRight, ChevronDown } from 'lucide-react';

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
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Style tokens are replaced with {partner.name}'s values. Content variables stay as{' '}
          <span className="font-mono">{'%%=v(@variable)=%%'}</span> for SFMC personalization.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 rounded px-3 py-1.5 text-sm font-semibold"
            style={{ backgroundColor: 'var(--accent-primary)', color: '#fff' }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy HTML'}
          </button>
          <label className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-primary)' }}>
            <input
              type="checkbox"
              checked={minify}
              onChange={e => setMinify(e.target.checked)}
              style={{ accentColor: 'var(--accent-primary)' }}
            />
            Minify
          </label>
        </div>
        <button
          onClick={() => setShowSource(!showSource)}
          aria-expanded={showSource}
          className="flex items-center gap-1 rounded text-xs"
          style={{ color: 'var(--text-secondary)' }}
        >
          {showSource ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          {showSource ? 'Hide Source' : 'View Source'}
        </button>
        {showSource && (
          <pre
            tabIndex={0}
            role="region"
            aria-label="Export source"
            className="max-h-64 overflow-auto rounded p-3 font-mono text-xs"
            style={{
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-input)',
            }}
          >
            {exportHtml}
          </pre>
        )}
      </div>
    </Panel>
  );
}
