import type { Partner } from '../types';
import type { LegacyPartnerTheme } from '../types';
import { migrateLegacyPartners } from './migrations';

// Sample partners. Every brand here is made up for the demo: loyalty programs
// of the kind a dining rewards network works with (airlines, hotels, cards,
// retailers). Any resemblance to a real brand is unintended.
//
// Each palette meets WCAG AA (4.5:1) for the color pairs the default
// components use. See utils/contrast.ts, and the test in defaultData.test.ts
// that fails if a sample palette drops below that.
const legacyPartners: LegacyPartnerTheme[] = [
  {
    id: 'partner-kestrel-air', name: 'Kestrel Air', slug: 'kestrel-air',
    typography: { fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 400, fontWeightBold: 700, lineHeight: 1.5 },
    textDecoration: { textTransform: 'none', textDecoration: 'none' },
    colors: { primary: '#12284C', secondary: '#0B1A33', backgroundSurface: '#FFFFFF', textMain: '#17202E', textMuted: '#56617A' },
    uiAccents: { borderRadius: 8, borderStrokeWeight: 1 },
  },
  {
    id: 'partner-harborlight-hotels', name: 'Harborlight Hotels', slug: 'harborlight-hotels',
    typography: { fontFamily: "'Georgia', 'Times New Roman', Times, serif", fontWeight: 400, fontWeightBold: 700, lineHeight: 1.6 },
    textDecoration: { textTransform: 'capitalize', textDecoration: 'none' },
    colors: { primary: '#0E5257', secondary: '#083638', backgroundSurface: '#FBF8F3', textMain: '#1E2A2B', textMuted: '#566364' },
    uiAccents: { borderRadius: 4, borderStrokeWeight: 1 },
  },
  {
    id: 'partner-summit-trail', name: 'Summit Trail Outfitters', slug: 'summit-trail',
    typography: { fontFamily: "'Trebuchet MS', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif", fontWeight: 400, fontWeightBold: 700, lineHeight: 1.4 },
    textDecoration: { textTransform: 'uppercase', textDecoration: 'none' },
    colors: { primary: '#B4420B', secondary: '#2B2B2B', backgroundSurface: '#FFFFFF', textMain: '#222222', textMuted: '#666666' },
    uiAccents: { borderRadius: 12, borderStrokeWeight: 2 },
  },
  {
    id: 'partner-marigold-market', name: 'Marigold Market', slug: 'marigold-market',
    typography: { fontFamily: "'Verdana', Geneva, Tahoma, sans-serif", fontWeight: 400, fontWeightBold: 700, lineHeight: 1.5 },
    textDecoration: { textTransform: 'none', textDecoration: 'none' },
    colors: { primary: '#8A2B0E', secondary: '#3D1C02', backgroundSurface: '#FFFAEB', textMain: '#2A2118', textMuted: '#6A5B47' },
    uiAccents: { borderRadius: 6, borderStrokeWeight: 1 },
  },
  {
    id: 'partner-tidewater', name: 'Tidewater Credit Union', slug: 'tidewater',
    typography: { fontFamily: "'Arial', Helvetica, sans-serif", fontWeight: 400, fontWeightBold: 700, lineHeight: 1.5 },
    textDecoration: { textTransform: 'none', textDecoration: 'underline' },
    colors: { primary: '#0B5CAD', secondary: '#06315C', backgroundSurface: '#FFFFFF', textMain: '#1C2B3A', textMuted: '#586778' },
    uiAccents: { borderRadius: 24, borderStrokeWeight: 2 },
  },
  {
    id: 'partner-heron-regional', name: 'Heron Regional', slug: 'heron-regional',
    typography: { fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 400, fontWeightBold: 700, lineHeight: 1.5 },
    textDecoration: { textTransform: 'none', textDecoration: 'none' },
    colors: { primary: '#C8102E', secondary: '#1A1A2E', backgroundSurface: '#FFFFFF', textMain: '#1A1A2E', textMuted: '#5E5E6E' },
    uiAccents: { borderRadius: 16, borderStrokeWeight: 1 },
  },
  {
    id: 'partner-willowbrook', name: 'Willowbrook Grocers', slug: 'willowbrook',
    typography: { fontFamily: "'Arial', Helvetica, sans-serif", fontWeight: 400, fontWeightBold: 700, lineHeight: 1.4 },
    textDecoration: { textTransform: 'none', textDecoration: 'none' },
    colors: { primary: '#2E7D32', secondary: '#1B4D1E', backgroundSurface: '#FFFFFF', textMain: '#24302A', textMuted: '#5B6B60' },
    uiAccents: { borderRadius: 8, borderStrokeWeight: 0 },
  },
  {
    id: 'partner-northgate-card', name: 'Northgate Card', slug: 'northgate-card',
    typography: { fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 300, fontWeightBold: 700, lineHeight: 1.6 },
    textDecoration: { textTransform: 'none', textDecoration: 'none' },
    colors: { primary: '#111111', secondary: '#1F2933', backgroundSurface: '#FFFFFF', textMain: '#1F2933', textMuted: '#5F6B7A' },
    uiAccents: { borderRadius: 0, borderStrokeWeight: 2 },
  },
  {
    id: 'partner-pelican-bay', name: 'Pelican Bay Cruises', slug: 'pelican-bay',
    typography: { fontFamily: "'Trebuchet MS', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif", fontWeight: 400, fontWeightBold: 700, lineHeight: 1.5 },
    textDecoration: { textTransform: 'none', textDecoration: 'none' },
    colors: { primary: '#00707A', secondary: '#003E44', backgroundSurface: '#F7FBFB', textMain: '#1F3033', textMuted: '#55696C' },
    uiAccents: { borderRadius: 4, borderStrokeWeight: 1 },
  },
  {
    id: 'partner-cedarstone', name: 'Cedarstone Resorts', slug: 'cedarstone',
    typography: { fontFamily: "'Georgia', 'Times New Roman', Times, serif", fontWeight: 400, fontWeightBold: 700, lineHeight: 1.6 },
    textDecoration: { textTransform: 'capitalize', textDecoration: 'none' },
    colors: { primary: '#5B4636', secondary: '#2E231B', backgroundSurface: '#FAF7F2', textMain: '#2B2420', textMuted: '#6B5F55' },
    uiAccents: { borderRadius: 2, borderStrokeWeight: 1 },
  },
  {
    id: 'partner-larkspur-card', name: 'Larkspur Card', slug: 'larkspur-card',
    typography: { fontFamily: "'Arial', Helvetica, sans-serif", fontWeight: 400, fontWeightBold: 800, lineHeight: 1.4 },
    textDecoration: { textTransform: 'uppercase', textDecoration: 'none' },
    colors: { primary: '#4B2E83', secondary: '#2A1A4D', backgroundSurface: '#FFFFFF', textMain: '#1D1830', textMuted: '#5F5876' },
    uiAccents: { borderRadius: 20, borderStrokeWeight: 0 },
  },
  {
    id: 'partner-juniper-rail', name: 'Juniper Rail', slug: 'juniper-rail',
    typography: { fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 400, fontWeightBold: 700, lineHeight: 1.5 },
    textDecoration: { textTransform: 'none', textDecoration: 'none' },
    colors: { primary: '#1E4D38', secondary: '#12301F', backgroundSurface: '#FFFFFF', textMain: '#18231C', textMuted: '#55645A' },
    uiAccents: { borderRadius: 8, borderStrokeWeight: 1 },
  },
  {
    id: 'partner-marquee-cinema', name: 'Marquee Cinema Club', slug: 'marquee-cinema',
    typography: { fontFamily: "'Verdana', Geneva, Tahoma, sans-serif", fontWeight: 400, fontWeightBold: 700, lineHeight: 1.5 },
    textDecoration: { textTransform: 'none', textDecoration: 'none' },
    colors: { primary: '#A3195B', secondary: '#2B0A1A', backgroundSurface: '#FFFFFF', textMain: '#2B1B24', textMuted: '#6B5A63' },
    uiAccents: { borderRadius: 10, borderStrokeWeight: 1 },
  },
  {
    id: 'partner-copperline-fuel', name: 'Copperline Fuel', slug: 'copperline-fuel',
    typography: { fontFamily: "'Trebuchet MS', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif", fontWeight: 400, fontWeightBold: 700, lineHeight: 1.5 },
    textDecoration: { textTransform: 'none', textDecoration: 'underline' },
    colors: { primary: '#00695C', secondary: '#1F1F1F', backgroundSurface: '#FFFFFF', textMain: '#1F1F1F', textMuted: '#5C6664' },
    uiAccents: { borderRadius: 6, borderStrokeWeight: 1 },
  },
  {
    id: 'partner-quillhouse', name: 'Quillhouse Books', slug: 'quillhouse',
    typography: { fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 400, fontWeightBold: 700, lineHeight: 1.5 },
    textDecoration: { textTransform: 'lowercase', textDecoration: 'none' },
    colors: { primary: '#3B4A8C', secondary: '#1E2548', backgroundSurface: '#FDFCF8', textMain: '#20233A', textMuted: '#5D6078' },
    uiAccents: { borderRadius: 32, borderStrokeWeight: 0 },
  },
  {
    id: 'partner-onyx-reserve', name: 'Onyx Reserve', slug: 'onyx-reserve',
    typography: { fontFamily: "'Georgia', 'Times New Roman', Times, serif", fontWeight: 400, fontWeightBold: 700, lineHeight: 1.6 },
    textDecoration: { textTransform: 'none', textDecoration: 'none' },
    colors: { primary: '#D9B95B', secondary: '#F1EEE7', backgroundSurface: '#17171B', textMain: '#F1EEE7', textMuted: '#A8A49B' },
    uiAccents: { borderRadius: 4, borderStrokeWeight: 2 },
  },
  {
    id: 'partner-saffron-travel', name: 'Saffron Travel Club', slug: 'saffron-travel',
    typography: { fontFamily: "'Arial', Helvetica, sans-serif", fontWeight: 400, fontWeightBold: 700, lineHeight: 1.4 },
    textDecoration: { textTransform: 'none', textDecoration: 'none' },
    colors: { primary: '#7A4E00', secondary: '#2D1E00', backgroundSurface: '#FFFDF5', textMain: '#2A2110', textMuted: '#6B5A33' },
    uiAccents: { borderRadius: 12, borderStrokeWeight: 1 },
  },
];

export const defaultPartners: Partner[] = migrateLegacyPartners(legacyPartners);
