import type { RACardData } from '../types';

interface Props {
  data: RACardData;
  onChange: (data: RACardData) => void;
}

export function RACardEditor({ data, onChange }: Props) {
  const update = (field: keyof RACardData, value: string | number) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">RA Card Data</h3>
      <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Restaurant Name</label>
          <input
            type="text"
            value={data.name}
            onChange={e => update('name', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Rating (0-5)</label>
            <input
              type="number"
              min={0}
              max={5}
              step={0.5}
              value={data.rating}
              onChange={e => update('rating', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Miles Away</label>
            <input
              type="number"
              min={0}
              step={0.1}
              value={data.milesAway}
              onChange={e => update('milesAway', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Message</label>
          <textarea
            value={data.message}
            onChange={e => update('message', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">CTA Link</label>
          <input
            type="url"
            value={data.ctaLink}
            onChange={e => update('ctaLink', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Image URL</label>
          <input
            type="url"
            value={data.imageUrl}
            onChange={e => update('imageUrl', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
          />
        </div>
      </div>
    </div>
  );
}
