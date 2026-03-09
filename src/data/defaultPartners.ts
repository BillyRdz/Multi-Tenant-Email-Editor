import type { Partner } from '../types';
import type { LegacyPartnerTheme } from '../types';
import { migrateLegacyPartners } from './migrations';

const legacyPartners: LegacyPartnerTheme[] = [
  {
    id: 'partner-grubhub', name: 'Grubhub', slug: 'grubhub',
    typography: { fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 400, fontWeightBold: 700, lineHeight: 1.5 },
    textDecoration: { textTransform: 'none', textDecoration: 'none' },
    colors: { primary: '#FF8000', secondary: '#2D2D2D', backgroundSurface: '#FFFFFF', textMain: '#1A1A1A', textMuted: '#6B6B6B' },
    uiAccents: { borderRadius: 8, borderStrokeWeight: 1 },
  },
  {
    id: 'partner-seamless', name: 'Seamless', slug: 'seamless',
    typography: { fontFamily: "'Georgia', 'Times New Roman', Times, serif", fontWeight: 400, fontWeightBold: 700, lineHeight: 1.6 },
    textDecoration: { textTransform: 'capitalize', textDecoration: 'none' },
    colors: { primary: '#0070EB', secondary: '#003D80', backgroundSurface: '#F5F7FA', textMain: '#1C2B3A', textMuted: '#7A8B9C' },
    uiAccents: { borderRadius: 4, borderStrokeWeight: 1 },
  },
  {
    id: 'partner-eat24', name: 'Eat24', slug: 'eat24',
    typography: { fontFamily: "'Trebuchet MS', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif", fontWeight: 400, fontWeightBold: 700, lineHeight: 1.4 },
    textDecoration: { textTransform: 'uppercase', textDecoration: 'none' },
    colors: { primary: '#E4002B', secondary: '#FFD700', backgroundSurface: '#FFFFFF', textMain: '#222222', textMuted: '#888888' },
    uiAccents: { borderRadius: 12, borderStrokeWeight: 2 },
  },
  {
    id: 'partner-menulog', name: 'Menulog', slug: 'menulog',
    typography: { fontFamily: "'Verdana', Geneva, Tahoma, sans-serif", fontWeight: 400, fontWeightBold: 700, lineHeight: 1.5 },
    textDecoration: { textTransform: 'none', textDecoration: 'none' },
    colors: { primary: '#FF5000', secondary: '#1B1B1B', backgroundSurface: '#FFF8F0', textMain: '#2C2C2C', textMuted: '#999999' },
    uiAccents: { borderRadius: 6, borderStrokeWeight: 1 },
  },
  {
    id: 'partner-justeat', name: 'Just Eat', slug: 'justeat',
    typography: { fontFamily: "'Arial', Helvetica, sans-serif", fontWeight: 400, fontWeightBold: 700, lineHeight: 1.5 },
    textDecoration: { textTransform: 'none', textDecoration: 'underline' },
    colors: { primary: '#F36D00', secondary: '#005E2F', backgroundSurface: '#FFFFFF', textMain: '#242E30', textMuted: '#6E7E80' },
    uiAccents: { borderRadius: 24, borderStrokeWeight: 2 },
  },
  {
    id: 'partner-doordash', name: 'DoorDash', slug: 'doordash',
    typography: { fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 400, fontWeightBold: 700, lineHeight: 1.5 },
    textDecoration: { textTransform: 'none', textDecoration: 'none' },
    colors: { primary: '#FF3008', secondary: '#191919', backgroundSurface: '#FFFFFF', textMain: '#191919', textMuted: '#767676' },
    uiAccents: { borderRadius: 16, borderStrokeWeight: 1 },
  },
  {
    id: 'partner-ubereats', name: 'Uber Eats', slug: 'ubereats',
    typography: { fontFamily: "'Arial', Helvetica, sans-serif", fontWeight: 400, fontWeightBold: 700, lineHeight: 1.4 },
    textDecoration: { textTransform: 'none', textDecoration: 'none' },
    colors: { primary: '#06C167', secondary: '#142328', backgroundSurface: '#FFFFFF', textMain: '#000000', textMuted: '#545454' },
    uiAccents: { borderRadius: 8, borderStrokeWeight: 0 },
  },
  {
    id: 'partner-postmates', name: 'Postmates', slug: 'postmates',
    typography: { fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 300, fontWeightBold: 700, lineHeight: 1.6 },
    textDecoration: { textTransform: 'none', textDecoration: 'none' },
    colors: { primary: '#000000', secondary: '#FFDF00', backgroundSurface: '#FFFFFF', textMain: '#2D2D2D', textMuted: '#8E8E93' },
    uiAccents: { borderRadius: 0, borderStrokeWeight: 2 },
  },
  {
    id: 'partner-deliveroo', name: 'Deliveroo', slug: 'deliveroo',
    typography: { fontFamily: "'Trebuchet MS', 'Lucida Sans', Arial, sans-serif", fontWeight: 400, fontWeightBold: 700, lineHeight: 1.5 },
    textDecoration: { textTransform: 'none', textDecoration: 'none' },
    colors: { primary: '#00CCBC', secondary: '#2E3333', backgroundSurface: '#F9FAFA', textMain: '#2E3333', textMuted: '#828585' },
    uiAccents: { borderRadius: 4, borderStrokeWeight: 1 },
  },
  {
    id: 'partner-caviar', name: 'Caviar', slug: 'caviar',
    typography: { fontFamily: "'Georgia', 'Times New Roman', Times, serif", fontWeight: 400, fontWeightBold: 700, lineHeight: 1.6 },
    textDecoration: { textTransform: 'capitalize', textDecoration: 'none' },
    colors: { primary: '#FF5A1F', secondary: '#1A1A2E', backgroundSurface: '#FAFAFA', textMain: '#1A1A2E', textMuted: '#6E6E7A' },
    uiAccents: { borderRadius: 2, borderStrokeWeight: 1 },
  },
  {
    id: 'partner-gopuff', name: 'Gopuff', slug: 'gopuff',
    typography: { fontFamily: "'Arial', Helvetica, sans-serif", fontWeight: 400, fontWeightBold: 800, lineHeight: 1.4 },
    textDecoration: { textTransform: 'uppercase', textDecoration: 'none' },
    colors: { primary: '#0000FF', secondary: '#1A0533', backgroundSurface: '#FFFFFF', textMain: '#1A0533', textMuted: '#7B7B7B' },
    uiAccents: { borderRadius: 20, borderStrokeWeight: 0 },
  },
  {
    id: 'partner-instacart', name: 'Instacart', slug: 'instacart',
    typography: { fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 400, fontWeightBold: 700, lineHeight: 1.5 },
    textDecoration: { textTransform: 'none', textDecoration: 'none' },
    colors: { primary: '#43B02A', secondary: '#003D29', backgroundSurface: '#FFFFFF', textMain: '#343538', textMuted: '#72767E' },
    uiAccents: { borderRadius: 8, borderStrokeWeight: 1 },
  },
  {
    id: 'partner-slice', name: 'Slice', slug: 'slice',
    typography: { fontFamily: "'Verdana', Geneva, Tahoma, sans-serif", fontWeight: 400, fontWeightBold: 700, lineHeight: 1.5 },
    textDecoration: { textTransform: 'none', textDecoration: 'none' },
    colors: { primary: '#E63B2E', secondary: '#2B2B2B', backgroundSurface: '#FFF9F5', textMain: '#2B2B2B', textMuted: '#8C8C8C' },
    uiAccents: { borderRadius: 10, borderStrokeWeight: 1 },
  },
  {
    id: 'partner-chownow', name: 'ChowNow', slug: 'chownow',
    typography: { fontFamily: "'Trebuchet MS', Arial, sans-serif", fontWeight: 400, fontWeightBold: 700, lineHeight: 1.5 },
    textDecoration: { textTransform: 'none', textDecoration: 'underline' },
    colors: { primary: '#FF6B35', secondary: '#004E64', backgroundSurface: '#FFFFFF', textMain: '#1B2D45', textMuted: '#7C8DB0' },
    uiAccents: { borderRadius: 6, borderStrokeWeight: 1 },
  },
  {
    id: 'partner-ritual', name: 'Ritual', slug: 'ritual',
    typography: { fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 400, fontWeightBold: 700, lineHeight: 1.5 },
    textDecoration: { textTransform: 'lowercase', textDecoration: 'none' },
    colors: { primary: '#E8380D', secondary: '#1D1D1D', backgroundSurface: '#FFFFFF', textMain: '#1D1D1D', textMuted: '#9B9B9B' },
    uiAccents: { borderRadius: 32, borderStrokeWeight: 0 },
  },
  {
    id: 'partner-favor', name: 'Favor', slug: 'favor',
    typography: { fontFamily: "'Georgia', 'Times New Roman', Times, serif", fontWeight: 400, fontWeightBold: 700, lineHeight: 1.6 },
    textDecoration: { textTransform: 'none', textDecoration: 'none' },
    colors: { primary: '#0B60B0', secondary: '#F0CF65', backgroundSurface: '#FFFFFF', textMain: '#2C3E50', textMuted: '#95A5A6' },
    uiAccents: { borderRadius: 4, borderStrokeWeight: 2 },
  },
  {
    id: 'partner-swiggy', name: 'Swiggy', slug: 'swiggy',
    typography: { fontFamily: "'Arial', Helvetica, sans-serif", fontWeight: 400, fontWeightBold: 700, lineHeight: 1.4 },
    textDecoration: { textTransform: 'none', textDecoration: 'none' },
    colors: { primary: '#FC8019', secondary: '#3D4152', backgroundSurface: '#FFFFFF', textMain: '#3D4152', textMuted: '#93959F' },
    uiAccents: { borderRadius: 12, borderStrokeWeight: 1 },
  },
];

export const defaultPartners: Partner[] = migrateLegacyPartners(legacyPartners);
