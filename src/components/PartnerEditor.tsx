import { useState } from 'react';
import type { PartnerTheme } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  partners: PartnerTheme[];
  activePartnerId: string;
  onUpdatePartner: (id: string, updates: Partial<PartnerTheme>) => void;
  onCreatePartner: (partner: PartnerTheme) => void;
  onDeletePartner: (id: string) => void;
}

const blankPartner: Omit<PartnerTheme, 'id'> = {
  name: '',
  slug: '',
  typography: {
    fontFamily: "'Arial', Helvetica, sans-serif",
    fontWeight: 400,
    fontWeightBold: 700,
    lineHeight: 1.5,
  },
  textDecoration: {
    textTransform: 'none',
    textDecoration: 'none',
  },
  colors: {
    primary: '#4F46E5',
    secondary: '#1E1B4B',
    backgroundSurface: '#FFFFFF',
    textMain: '#1F2937',
    textMuted: '#6B7280',
  },
  uiAccents: {
    borderRadius: 8,
    borderStrokeWeight: 1,
  },
};

export function PartnerEditor({
  partners,
  activePartnerId,
  onUpdatePartner,
  onCreatePartner,
  onDeletePartner,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'edit' | 'create'>('edit');
  const [draft, setDraft] = useState<PartnerTheme | null>(null);

  const activePartner = partners.find(p => p.id === activePartnerId);

  const openEdit = () => {
    if (!activePartner) return;
    setDraft({ ...activePartner });
    setMode('edit');
    setIsOpen(true);
  };

  const openCreate = () => {
    setDraft({ ...blankPartner, id: `partner-${uuidv4()}` } as PartnerTheme);
    setMode('create');
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!draft || !draft.name.trim()) return;
    if (mode === 'create') {
      const slug = draft.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      onCreatePartner({ ...draft, slug });
    } else {
      onUpdatePartner(draft.id, draft);
    }
    setIsOpen(false);
    setDraft(null);
  };

  const updateDraft = (path: string, value: string | number) => {
    if (!draft) return;
    const keys = path.split('.');
    const newDraft = { ...draft };
    /* eslint-disable @typescript-eslint/no-explicit-any */
    let obj: any = newDraft;
    for (let i = 0; i < keys.length - 1; i++) {
      obj[keys[i]] = { ...obj[keys[i]] };
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    /* eslint-enable @typescript-eslint/no-explicit-any */
    setDraft(newDraft);
  };

  if (!isOpen) {
    return (
      <div className="flex gap-2">
        <button
          onClick={openEdit}
          className="text-xs px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer"
        >
          Edit Partner
        </button>
        <button
          onClick={openCreate}
          className="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer"
        >
          + New Partner
        </button>
      </div>
    );
  }

  if (!draft) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {mode === 'create' ? 'New Partner' : `Edit: ${activePartner?.name}`}
          </h2>
          <button
            onClick={() => { setIsOpen(false); setDraft(null); }}
            className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer"
          >
            x
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Partner Name</label>
            <input
              type="text"
              value={draft.name}
              onChange={e => updateDraft('name', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              placeholder="e.g. Grubhub"
            />
          </div>

          {/* Typography */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Typography</legend>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Font Family</label>
              <input
                type="text"
                value={draft.typography.fontFamily}
                onChange={e => updateDraft('typography.fontFamily', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md font-mono"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Weight</label>
                <input
                  type="number"
                  value={draft.typography.fontWeight}
                  onChange={e => updateDraft('typography.fontWeight', Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Bold Weight</label>
                <input
                  type="number"
                  value={draft.typography.fontWeightBold}
                  onChange={e => updateDraft('typography.fontWeightBold', Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Line Height</label>
                <input
                  type="number"
                  step="0.1"
                  value={draft.typography.lineHeight}
                  onChange={e => updateDraft('typography.lineHeight', Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </fieldset>

          {/* Text Decoration */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Text Decoration</legend>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Text Transform</label>
                <select
                  value={draft.textDecoration.textTransform}
                  onChange={e => updateDraft('textDecoration.textTransform', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                >
                  <option value="none">None</option>
                  <option value="uppercase">Uppercase</option>
                  <option value="lowercase">Lowercase</option>
                  <option value="capitalize">Proper Case</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Text Decoration</label>
                <select
                  value={draft.textDecoration.textDecoration}
                  onChange={e => updateDraft('textDecoration.textDecoration', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                >
                  <option value="none">None</option>
                  <option value="underline">Underline</option>
                </select>
              </div>
            </div>
          </fieldset>

          {/* Colors */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Color Palette</legend>
            <div className="grid grid-cols-2 gap-3">
              {([
                ['colors.primary', 'Primary', draft.colors.primary],
                ['colors.secondary', 'Secondary', draft.colors.secondary],
                ['colors.backgroundSurface', 'Background', draft.colors.backgroundSurface],
                ['colors.textMain', 'Text Main', draft.colors.textMain],
                ['colors.textMuted', 'Text Muted', draft.colors.textMuted],
              ] as const).map(([path, label, value]) => (
                <div key={path} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={value}
                    onChange={e => updateDraft(path, e.target.value)}
                    className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">{label}</p>
                    <input
                      type="text"
                      value={value}
                      onChange={e => updateDraft(path, e.target.value)}
                      className="w-full px-2 py-1 text-xs font-mono border border-gray-300 rounded"
                    />
                  </div>
                </div>
              ))}
            </div>
          </fieldset>

          {/* UI Accents */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-semibold text-gray-600 uppercase tracking-wide">UI Accents</legend>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Border Radius (px)</label>
                <input
                  type="number"
                  min={0}
                  value={draft.uiAccents.borderRadius}
                  onChange={e => updateDraft('uiAccents.borderRadius', Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Border Width (px)</label>
                <input
                  type="number"
                  min={0}
                  value={draft.uiAccents.borderStrokeWeight}
                  onChange={e => updateDraft('uiAccents.borderStrokeWeight', Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </fieldset>

          {/* Preview swatch */}
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Preview</p>
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: draft.colors.backgroundSurface,
                borderColor: draft.colors.textMuted,
                borderWidth: draft.uiAccents.borderStrokeWeight,
                borderRadius: draft.uiAccents.borderRadius,
                fontFamily: draft.typography.fontFamily,
              }}
            >
              <p style={{
                color: draft.colors.textMain,
                fontWeight: draft.typography.fontWeightBold,
                textTransform: draft.textDecoration.textTransform,
                fontSize: '16px',
                marginBottom: '4px',
              }}>
                {draft.name || 'Partner Name'}
              </p>
              <p style={{
                color: draft.colors.textMuted,
                fontSize: '13px',
                lineHeight: draft.typography.lineHeight,
                marginBottom: '8px',
              }}>
                Sample body text showing how this theme looks.
              </p>
              <span style={{
                backgroundColor: draft.colors.primary,
                color: draft.colors.backgroundSurface,
                padding: '6px 16px',
                borderRadius: draft.uiAccents.borderRadius,
                fontSize: '13px',
                fontWeight: draft.typography.fontWeightBold,
                textTransform: draft.textDecoration.textTransform,
                display: 'inline-block',
              }}>
                Button Preview
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            {mode === 'edit' && (
              <button
                onClick={() => {
                  onDeletePartner(draft.id);
                  setIsOpen(false);
                  setDraft(null);
                }}
                className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
              >
                Delete Partner
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setIsOpen(false); setDraft(null); }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!draft.name.trim()}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-40 cursor-pointer"
            >
              {mode === 'create' ? 'Create Partner' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
