import type { PartnerTheme } from '../types';

interface Props {
  partners: PartnerTheme[];
  activePartnerId: string;
  onSelect: (id: string) => void;
}

export function PartnerSwitcher({ partners, activePartnerId, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {partners.map(p => (
        <button
          key={p.id}
          onClick={() => onSelect(p.id)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            p.id === activePartnerId
              ? 'bg-white shadow-md ring-2 ring-indigo-500 text-gray-900'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: p.colors.primary }}
          />
          {p.name}
        </button>
      ))}
    </div>
  );
}
