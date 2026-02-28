import { useState } from 'react';
import type { RACardData } from '../types';

interface Props {
  cards: RACardData[];
  onAdd: (card: RACardData) => void;
  onUpdate: (index: number, card: RACardData) => void;
  onRemove: (index: number) => void;
}

const blankCard: RACardData = {
  name: '',
  rating: 4.0,
  milesAway: 1.0,
  message: '',
  ctaLink: 'https://example.com/order',
  imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=480&h=320&fit=crop',
};

export function RACardEditor({ cards, onAdd, onUpdate, onRemove }: Props) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

  const updateField = (index: number, field: keyof RACardData, value: string | number) => {
    onUpdate(index, { ...cards[index], [field]: value });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          RA Cards ({cards.length})
        </h3>
        <button
          onClick={() => {
            onAdd({ ...blankCard });
            setExpandedIdx(cards.length);
          }}
          className="text-xs px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 cursor-pointer"
        >
          + Add Card
        </button>
      </div>

      <div className="space-y-2">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
            {/* Card header */}
            <button
              onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-left cursor-pointer hover:bg-gray-100"
            >
              <span className="text-xs text-purple-600 font-bold">#{idx + 1}</span>
              <span className="text-sm font-medium text-gray-800 flex-1 truncate">
                {card.name || 'Untitled Restaurant'}
              </span>
              <span className="text-xs text-gray-400">
                {'★'.repeat(Math.floor(card.rating))} {card.milesAway}mi
              </span>
              <span className="text-gray-400 text-xs">{expandedIdx === idx ? '▼' : '▶'}</span>
            </button>

            {/* Expanded form */}
            {expandedIdx === idx && (
              <div className="border-t border-gray-200 p-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Restaurant Name</label>
                  <input
                    type="text"
                    value={card.name}
                    onChange={e => updateField(idx, 'name', e.target.value)}
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
                      value={card.rating}
                      onChange={e => updateField(idx, 'rating', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Miles Away</label>
                    <input
                      type="number"
                      min={0}
                      step={0.1}
                      value={card.milesAway}
                      onChange={e => updateField(idx, 'milesAway', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Message</label>
                  <textarea
                    value={card.message}
                    onChange={e => updateField(idx, 'message', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">CTA Link</label>
                  <input
                    type="url"
                    value={card.ctaLink}
                    onChange={e => updateField(idx, 'ctaLink', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={card.imageUrl}
                    onChange={e => updateField(idx, 'imageUrl', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                  />
                </div>
                {cards.length > 1 && (
                  <button
                    onClick={() => {
                      onRemove(idx);
                      setExpandedIdx(null);
                    }}
                    className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    Remove this card
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
