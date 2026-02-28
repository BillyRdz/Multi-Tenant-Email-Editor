export interface PartnerTheme {
  id: string;
  name: string;
  slug: string;
  typography: {
    fontFamily: string;
    fontWeight: number;
    fontWeightBold: number;
    lineHeight: number;
  };
  textDecoration: {
    textTransform: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
    textDecoration: 'underline' | 'none';
  };
  colors: {
    primary: string;
    secondary: string;
    backgroundSurface: string;
    textMain: string;
    textMuted: string;
  };
  uiAccents: {
    borderRadius: number;
    borderStrokeWeight: number;
  };
}

export interface EmailComponent {
  id: string;
  name: string;
  type: 'header' | 'body' | 'ra-card' | 'footer' | 'cta' | 'custom';
  html: string; // template literal string with ${theme.xxx} placeholders
  createdAt: string;
  updatedAt: string;
}

export interface RACardData {
  name: string;
  rating: number;
  milesAway: number;
  message: string;
  ctaLink: string;
  imageUrl: string;
}

export interface EmailVersion {
  id: string;
  name: string;
  partnerId: string;
  componentIds: string[];
  raCardData?: RACardData;
  createdAt: string;
}
