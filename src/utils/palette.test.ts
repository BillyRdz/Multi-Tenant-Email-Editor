import { describe, it, expect } from 'vitest';
import { partnerPalette } from './palette';

describe('partnerPalette', () => {
  it('returns the standard color tokens in strip order', () => {
    const tokens = [
      { key: 'colorTextMain', value: '#111111' },
      { key: 'fontFamily', value: 'Arial' },
      { key: 'colorPrimary', value: '#12284C' },
      { key: 'colorBackground', value: '#FFFFFF' },
    ];
    expect(partnerPalette(tokens)).toEqual(['#12284C', '#FFFFFF', '#111111']);
  });

  it('falls back to any hex tokens when the standard keys are missing', () => {
    const tokens = [
      { key: 'brand', value: '#ABCDEF' },
      { key: 'spacing', value: '8' },
      { key: 'ink', value: '#222' },
    ];
    expect(partnerPalette(tokens)).toEqual(['#ABCDEF', '#222']);
  });

  it('skips color values it cannot draw reliably and never returns an empty strip', () => {
    expect(partnerPalette([{ key: 'colorPrimary', value: 'tomato' }])).toHaveLength(1);
    expect(partnerPalette([])).toHaveLength(1);
  });
});
