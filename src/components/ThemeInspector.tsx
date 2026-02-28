import type { PartnerTheme } from '../types';

interface Props {
  theme: PartnerTheme;
}

export function ThemeInspector({ theme }: Props) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
        Theme: {theme.name}
      </h3>
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-4 text-xs">
        {/* Colors */}
        <div>
          <p className="font-semibold text-gray-600 mb-2">Colors</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(theme.colors).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span
                  className="w-5 h-5 rounded border border-gray-300 shrink-0"
                  style={{ backgroundColor: value }}
                />
                <div>
                  <p className="text-gray-500">{key}</p>
                  <p className="font-mono text-gray-800">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Typography */}
        <div>
          <p className="font-semibold text-gray-600 mb-2">Typography</p>
          <p className="text-gray-500">Font: <span className="text-gray-800">{theme.typography.fontFamily.split(',')[0]}</span></p>
          <p className="text-gray-500">Weight: <span className="text-gray-800">{theme.typography.fontWeight} / {theme.typography.fontWeightBold}</span></p>
          <p className="text-gray-500">Line Height: <span className="text-gray-800">{theme.typography.lineHeight}</span></p>
        </div>
        {/* Text Decoration */}
        <div>
          <p className="font-semibold text-gray-600 mb-2">Text Style</p>
          <p className="text-gray-500">Transform: <span className="text-gray-800">{theme.textDecoration.textTransform}</span></p>
          <p className="text-gray-500">Decoration: <span className="text-gray-800">{theme.textDecoration.textDecoration}</span></p>
        </div>
        {/* UI Accents */}
        <div>
          <p className="font-semibold text-gray-600 mb-2">UI Accents</p>
          <p className="text-gray-500">Border Radius: <span className="text-gray-800">{theme.uiAccents.borderRadius}px</span></p>
          <p className="text-gray-500">Border Width: <span className="text-gray-800">{theme.uiAccents.borderStrokeWeight}px</span></p>
        </div>
      </div>
    </div>
  );
}
