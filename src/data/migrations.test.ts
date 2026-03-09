import { describe, it, expect } from 'vitest';
import { migrateLegacyPartner, migrateLegacyPartners } from './migrations';
import type { LegacyPartnerTheme } from '../types';

const mockLegacy: LegacyPartnerTheme = {
  id: 'partner-test',
  name: 'Test Brand',
  slug: 'test-brand',
  typography: { fontFamily: 'Arial', fontWeight: 400, fontWeightBold: 700, lineHeight: 1.5 },
  textDecoration: { textTransform: 'none', textDecoration: 'underline' },
  colors: { primary: '#FF0000', secondary: '#0000FF', backgroundSurface: '#FFFFFF', textMain: '#111', textMuted: '#999' },
  uiAccents: { borderRadius: 8, borderStrokeWeight: 2 },
};

describe('migrateLegacyPartner', () => {
  it('preserves id, name, and slug', () => {
    const result = migrateLegacyPartner(mockLegacy);
    expect(result.id).toBe('partner-test');
    expect(result.name).toBe('Test Brand');
    expect(result.slug).toBe('test-brand');
  });

  it('converts all theme properties to tokens', () => {
    const result = migrateLegacyPartner(mockLegacy);
    expect(result.tokens.length).toBe(14);
  });

  it('maps color properties to named tokens', () => {
    const result = migrateLegacyPartner(mockLegacy);
    const tokenMap = Object.fromEntries(result.tokens.map(t => [t.key, t.value]));
    expect(tokenMap.colorPrimary).toBe('#FF0000');
    expect(tokenMap.colorSecondary).toBe('#0000FF');
    expect(tokenMap.colorBackground).toBe('#FFFFFF');
    expect(tokenMap.colorTextMain).toBe('#111');
    expect(tokenMap.colorTextMuted).toBe('#999');
  });

  it('maps typography properties to tokens', () => {
    const result = migrateLegacyPartner(mockLegacy);
    const tokenMap = Object.fromEntries(result.tokens.map(t => [t.key, t.value]));
    expect(tokenMap.fontFamily).toBe('Arial');
    expect(tokenMap.fontWeight).toBe('400');
    expect(tokenMap.fontWeightBold).toBe('700');
    expect(tokenMap.lineHeight).toBe('1.5');
  });

  it('maps text decoration properties to tokens', () => {
    const result = migrateLegacyPartner(mockLegacy);
    const tokenMap = Object.fromEntries(result.tokens.map(t => [t.key, t.value]));
    expect(tokenMap.textTransform).toBe('none');
    expect(tokenMap.textDecoration).toBe('underline');
  });

  it('maps ui accent properties to tokens', () => {
    const result = migrateLegacyPartner(mockLegacy);
    const tokenMap = Object.fromEntries(result.tokens.map(t => [t.key, t.value]));
    expect(tokenMap.borderRadius).toBe('8');
    expect(tokenMap.borderStrokeWeight).toBe('2');
  });

  it('includes partnerName token', () => {
    const result = migrateLegacyPartner(mockLegacy);
    const tokenMap = Object.fromEntries(result.tokens.map(t => [t.key, t.value]));
    expect(tokenMap.partnerName).toBe('Test Brand');
  });

  it('sets timestamps', () => {
    const result = migrateLegacyPartner(mockLegacy);
    expect(result.createdAt).toBeTruthy();
    expect(result.updatedAt).toBeTruthy();
  });
});

describe('migrateLegacyPartners', () => {
  it('migrates an array of legacy partners', () => {
    const results = migrateLegacyPartners([mockLegacy, { ...mockLegacy, id: 'partner-2', name: 'Brand 2' }]);
    expect(results.length).toBe(2);
    expect(results[0].name).toBe('Test Brand');
    expect(results[1].name).toBe('Brand 2');
  });
});
