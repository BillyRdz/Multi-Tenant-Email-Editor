import { describe, it, expect } from 'vitest';
import { parseHexColor, relativeLuminance, contrastRatio, checkPartnerContrast, AA_MIN_CONTRAST } from './contrast';

describe('parseHexColor', () => {
  it('parses 6-digit and 3-digit hex, in either case', () => {
    expect(parseHexColor('#FF8000')).toEqual([255, 128, 0]);
    expect(parseHexColor('#ff8000')).toEqual([255, 128, 0]);
    expect(parseHexColor('#fa0')).toEqual([255, 170, 0]);
  });

  it('returns null for values it cannot read', () => {
    expect(parseHexColor('red')).toBeNull();
    expect(parseHexColor('rgb(0, 0, 0)')).toBeNull();
    expect(parseHexColor('#12345')).toBeNull();
    expect(parseHexColor('')).toBeNull();
  });
});

describe('relativeLuminance', () => {
  it('is 0 for black and 1 for white', () => {
    expect(relativeLuminance([0, 0, 0])).toBe(0);
    expect(relativeLuminance([255, 255, 255])).toBeCloseTo(1, 5);
  });
});

describe('contrastRatio', () => {
  it('is 21 for black on white and 1 for identical colors', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contrastRatio('#336699', '#336699')).toBeCloseTo(1, 5);
  });

  it('does not depend on which color is the text', () => {
    expect(contrastRatio('#12284C', '#FFFFFF')).toBe(contrastRatio('#FFFFFF', '#12284C'));
  });

  it('matches known WCAG reference values', () => {
    // #767676 is the lightest gray that passes AA on white.
    expect(contrastRatio('#767676', '#FFFFFF')).toBeCloseTo(4.54, 2);
    expect(contrastRatio('#777777', '#FFFFFF')!).toBeLessThan(AA_MIN_CONTRAST);
  });

  it('returns null when a color is not hex', () => {
    expect(contrastRatio('white', '#000000')).toBeNull();
  });
});

describe('checkPartnerContrast', () => {
  const tokens = [
    { key: 'colorPrimary', value: '#FF8000' },
    { key: 'colorSecondary', value: '#2D2D2D' },
    { key: 'colorBackground', value: '#FFFFFF' },
    { key: 'colorTextMain', value: '#1A1A1A' },
    { key: 'colorTextMuted', value: '#999999' },
  ];

  it('flags the pairs that fall below 4.5:1', () => {
    const byLabel = Object.fromEntries(checkPartnerContrast(tokens).map(r => [r.label, r.passes]));
    expect(byLabel).toEqual({
      'Button and header text': false, // white on bright orange
      'Body text': true,
      'Muted text': false, // light gray on white
      'Footer text': true,
    });
  });

  it('reports the ratio and the colors it compared', () => {
    const button = checkPartnerContrast(tokens)[0];
    expect(button.foregroundColor).toBe('#FFFFFF');
    expect(button.backgroundColor).toBe('#FF8000');
    expect(button.ratio).toBeCloseTo(2.52, 2);
  });

  it('marks a pair as not checked when a token is missing or not a hex color', () => {
    const results = checkPartnerContrast([
      { key: 'colorPrimary', value: 'tomato' },
      { key: 'colorBackground', value: '#FFFFFF' },
    ]);
    expect(results.every(r => r.ratio === null && r.passes === null)).toBe(true);
  });
});
