import type { StyleToken } from '../types';

/** WCAG 2.1 level AA minimum contrast for normal-size text (success criterion 1.4.3). */
export const AA_MIN_CONTRAST = 4.5;

type Rgb = [number, number, number];

/** Parses #RGB or #RRGGBB. Returns null for anything else (named colors, rgb(), alpha). */
export function parseHexColor(value: string): Rgb | null {
  const hex = value.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)?.[1];
  if (!hex) return null;
  const full = hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex;
  return [0, 2, 4].map(i => parseInt(full.slice(i, i + 2), 16)) as Rgb;
}

/** Relative luminance as defined by WCAG 2.1: 0 is black, 1 is white. */
export function relativeLuminance([r, g, b]: Rgb): number {
  const [lr, lg, lb] = [r, g, b].map(channel => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

/** Contrast ratio between two hex colors, from 1 (identical) to 21 (black on white). */
export function contrastRatio(a: string, b: string): number | null {
  const colorA = parseHexColor(a);
  const colorB = parseHexColor(b);
  if (!colorA || !colorB) return null;
  const [lighter, darker] = [relativeLuminance(colorA), relativeLuminance(colorB)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
}

interface ContrastPair {
  label: string;
  /** Token key used as the text color. */
  foreground: string;
  /** Token key used as the color behind the text. */
  background: string;
}

/**
 * The text/background combinations the default email components produce.
 * For example, the header and CTA button print colorBackground text on a
 * colorPrimary fill.
 */
export const PARTNER_CONTRAST_PAIRS: ContrastPair[] = [
  { label: 'Button and header text', foreground: 'colorBackground', background: 'colorPrimary' },
  { label: 'Body text', foreground: 'colorTextMain', background: 'colorBackground' },
  { label: 'Muted text', foreground: 'colorTextMuted', background: 'colorBackground' },
  { label: 'Footer text', foreground: 'colorBackground', background: 'colorSecondary' },
];

export interface ContrastResult extends ContrastPair {
  foregroundColor: string | undefined;
  backgroundColor: string | undefined;
  /** null when either token is missing or is not a hex color. */
  ratio: number | null;
  /** null when the ratio could not be computed. */
  passes: boolean | null;
}

/** Checks a partner's tokens against WCAG AA for each pair above. */
export function checkPartnerContrast(tokens: StyleToken[]): ContrastResult[] {
  const valueOf = (key: string) => tokens.find(t => t.key === key)?.value;

  return PARTNER_CONTRAST_PAIRS.map(pair => {
    const foregroundColor = valueOf(pair.foreground);
    const backgroundColor = valueOf(pair.background);
    const ratio = foregroundColor && backgroundColor ? contrastRatio(foregroundColor, backgroundColor) : null;
    return {
      ...pair,
      foregroundColor,
      backgroundColor,
      ratio,
      passes: ratio === null ? null : ratio >= AA_MIN_CONTRAST,
    };
  });
}
