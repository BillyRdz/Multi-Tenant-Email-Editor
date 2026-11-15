import { useState, lazy, Suspense } from 'react';
import type { EmailComponent } from '../../types';
import { extractVariables, classifyVariables } from '../../utils/templateEngine';
import { defaultPartners } from '../../data/defaultPartners';
import { Trash2 } from 'lucide-react';

const MonacoEditor = lazy(() => import('@monaco-editor/react').then(m => ({ default: m.default })));

const COMPONENT_TYPES = ['header', 'body', 'ra-card', 'footer', 'cta', 'custom'];

interface EditorProps {
  component?: EmailComponent;
  onSave?: (updates: Partial<Pick<EmailComponent, 'name' | 'type' | 'html'>>) => void;
  onCreate?: (name: string, type: string, html: string) => void;
  onDelete?: () => void;
  onCancel?: () => void;
}

export function ComponentEditor({ component, onSave, onCreate, onDelete, onCancel }: EditorProps) {
  // Local draft of the component. DeveloperModeModal gives this editor a `key`
  // per component, so switching components remounts it with fresh state.
  const [name, setName] = useState(component?.name || '');
  const [type, setType] = useState(component?.type || 'custom');
  const [html, setHtml] = useState(component?.html || '');

  const detectedVars = extractVariables(html);
  const tokenKeys = defaultPartners[0]?.tokens.map(t => t.key) || [];
  const { styleVars, contentVars } = classifyVariables(detectedVars, tokenKeys);

  const handleSave = () => {
    if (component && onSave) {
      onSave({ name, type, html });
    } else if (onCreate) {
      if (!name.trim() || !html.trim()) return;
      onCreate(name.trim(), type, html);
    }
  };

  const isNew = !component;

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'var(--border-primary)' }}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Component name"
          aria-label="Component name"
          className="min-w-0 flex-1 font-semibold"
        />
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          aria-label="Component type"
        >
          {COMPONENT_TYPES.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <button
          onClick={handleSave}
          className="rounded px-3 py-1.5 text-sm font-semibold"
          style={{ backgroundColor: 'var(--accent-primary)', color: '#fff' }}
        >
          {isNew ? 'Create' : 'Save'}
        </button>
        {isNew && onCancel && (
          <button
            onClick={onCancel}
            className="rounded px-3 py-1.5 text-sm hover:bg-[var(--bg-hover)]"
            style={{ color: 'var(--text-primary)' }}
          >
            Cancel
          </button>
        )}
        {!isNew && onDelete && (
          <button
            onClick={onDelete}
            aria-label="Delete component"
            className="rounded p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--accent-danger-text)]"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Variable chips */}
      <div className="flex flex-wrap items-center gap-1.5 px-4 py-2 border-b" style={{ borderColor: 'var(--border-primary)' }}>
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Variables</span>
        {styleVars.map(v => (
          <span
            key={v}
            className="rounded-xs px-1.5 py-0.5 font-mono text-xs"
            style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-primary)' }}
          >
            {v} (style)
          </span>
        ))}
        {contentVars.map(v => (
          <span
            key={v}
            className="rounded-xs px-1.5 py-0.5 font-mono text-xs"
            style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-input)' }}
          >
            {v} (content)
          </span>
        ))}
        {detectedVars.length === 0 && (
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            No variables detected. Use {'%%=v(@variableName)=%%'} syntax.
          </span>
        )}
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 min-h-[400px]">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full" style={{ color: 'var(--text-tertiary)' }}>
            <p className="text-sm">Loading editor...</p>
          </div>
        }>
          <MonacoEditor
            height="100%"
            language="html"
            theme="vs"
            value={html}
            onChange={(value) => setHtml(value || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: 'on',
              wordWrap: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </Suspense>
      </div>
    </div>
  );
}
