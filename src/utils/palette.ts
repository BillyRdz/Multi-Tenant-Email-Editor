import type { StyleToken } from '../types';
import { parseHexColor } from './contrast';

/** The color tokens the default components use, in the order a brand strip shows them. */
const PALETTE_KEYS = ['colorPrimary', 'colorSecondary', 'colorBackground', 'colorTextMain', 'colorTextMuted'];

const NO_COLORS = ['#b9bdc4'];

/**
 * The colors to draw for a partner's swatch strip.
 * Uses the standard color tokens when present, otherwise any hex-valued
 * tokens the partner has, and a neutral placeholder when there are none.
 */
export function partnerPalette(tokens: StyleToken[]): string[] {
  const isHex = (value: string | undefined): value is string => !!value && parseHexColor(value) !== null;

  const standard = PALETTE_KEYS.map(key => tokens.find(t => t.key === key)?.value).filter(isHex);
  if (standard.length > 0) return standard;

  const anyHex = tokens.map(t => t.value).filter(isHex).slice(0, PALETTE_KEYS.length);
  return anyHex.length > 0 ? anyHex : NO_COLORS;
}
