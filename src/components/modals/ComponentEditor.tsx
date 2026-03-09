import { useState, useEffect, lazy, Suspense } from 'react';
import type { EmailComponent } from '../../types';
import { extractVariables, classifyVariables } from '../../utils/templateEngine';
import { defaultPartners } from '../../data/defaultPartners';
import { Save, Trash2 } from 'lucide-react';

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
  const [name, setName] = useState(component?.name || '');
  const [type, setType] = useState(component?.type || 'custom');
  const [html, setHtml] = useState(component?.html || '');

  useEffect(() => {
    if (component) {
      setName(component.name);
      setType(component.type);
      setHtml(component.html);
    }
  }, [component]);

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
      <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'var(--border-primary)' }}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Component name"
          className="text-sm font-medium flex-1"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-primary)',
            color: 'var(--text-primary)',
            borderRadius: '6px',
            padding: '6px 10px',
          }}
        />
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="text-sm"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-primary)',
            color: 'var(--text-primary)',
            borderRadius: '6px',
            padding: '6px 10px',
          }}
        >
          {COMPONENT_TYPES.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md cursor-pointer"
          style={{ backgroundColor: 'var(--accent-primary)', color: '#fff' }}
        >
          <Save size={14} />
          {isNew ? 'Create' : 'Save'}
        </button>
        {isNew && onCancel && (
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-sm rounded-md cursor-pointer"
            style={{ color: 'var(--text-secondary)' }}
          >
            Cancel
          </button>
        )}
        {!isNew && onDelete && (
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md cursor-pointer"
            style={{ color: 'var(--accent-danger)' }}
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Variable chips */}
      <div className="flex flex-wrap gap-1.5 px-4 py-2 border-b" style={{ borderColor: 'var(--border-primary)' }}>
        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Variables:</span>
        {styleVars.map(v => (
          <span
            key={v}
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ backgroundColor: 'var(--accent-primary)', color: '#fff', opacity: 0.7 }}
          >
            {v} (style)
          </span>
        ))}
        {contentVars.map(v => (
          <span
            key={v}
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ backgroundColor: 'var(--accent-success)', color: '#fff', opacity: 0.8 }}
          >
            {v} (content)
          </span>
        ))}
        {detectedVars.length === 0 && (
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
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
            theme="vs-dark"
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
