import type { PartnerTheme } from '../types';

export const defaultPartners: PartnerTheme[] = [
  {
    id: 'partner-grubhub',
    name: 'Grubhub',
    slug: 'grubhub',
    typography: {
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      fontWeight: 400,
      fontWeightBold: 700,
      lineHeight: 1.5,
    },
    textDecoration: {
      textTransform: 'none',
      textDecoration: 'none',
    },
    colors: {
      primary: '#FF8000',
      secondary: '#2D2D2D',
      backgroundSurface: '#FFFFFF',
      textMain: '#1A1A1A',
      textMuted: '#6B6B6B',
    },
    uiAccents: {
      borderRadius: 8,
      borderStrokeWeight: 1,
    },
  },
  {
    id: 'partner-seamless',
    name: 'Seamless',
    slug: 'seamless',
    typography: {
      fontFamily: "'Georgia', 'Times New Roman', Times, serif",
      fontWeight: 400,
      fontWeightBold: 700,
      lineHeight: 1.6,
    },
    textDecoration: {
      textTransform: 'capitalize',
      textDecoration: 'none',
    },
    colors: {
      primary: '#0070EB',
      secondary: '#003D80',
      backgroundSurface: '#F5F7FA',
      textMain: '#1C2B3A',
      textMuted: '#7A8B9C',
    },
    uiAccents: {
      borderRadius: 4,
      borderStrokeWeight: 1,
    },
  },
  {
    id: 'partner-eat24',
    name: 'Eat24',
    slug: 'eat24',
    typography: {
      fontFamily: "'Trebuchet MS', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
      fontWeight: 400,
      fontWeightBold: 700,
      lineHeight: 1.4,
    },
    textDecoration: {
      textTransform: 'uppercase',
      textDecoration: 'none',
    },
    colors: {
      primary: '#E4002B',
      secondary: '#FFD700',
      backgroundSurface: '#FFFFFF',
      textMain: '#222222',
      textMuted: '#888888',
    },
    uiAccents: {
      borderRadius: 12,
      borderStrokeWeight: 2,
    },
  },
  {
    id: 'partner-menulog',
    name: 'Menulog',
    slug: 'menulog',
    typography: {
      fontFamily: "'Verdana', Geneva, Tahoma, sans-serif",
      fontWeight: 400,
      fontWeightBold: 700,
      lineHeight: 1.5,
    },
    textDecoration: {
      textTransform: 'none',
      textDecoration: 'none',
    },
    colors: {
      primary: '#FF5000',
      secondary: '#1B1B1B',
      backgroundSurface: '#FFF8F0',
      textMain: '#2C2C2C',
      textMuted: '#999999',
    },
    uiAccents: {
      borderRadius: 6,
      borderStrokeWeight: 1,
    },
  },
  {
    id: 'partner-justeat',
    name: 'Just Eat',
    slug: 'justeat',
    typography: {
      fontFamily: "'Arial', Helvetica, sans-serif",
      fontWeight: 400,
      fontWeightBold: 700,
      lineHeight: 1.5,
    },
    textDecoration: {
      textTransform: 'none',
      textDecoration: 'underline',
    },
    colors: {
      primary: '#F36D00',
      secondary: '#005E2F',
      backgroundSurface: '#FFFFFF',
      textMain: '#242E30',
      textMuted: '#6E7E80',
    },
    uiAccents: {
      borderRadius: 24,
      borderStrokeWeight: 2,
    },
  },
];
