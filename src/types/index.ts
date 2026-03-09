export interface StyleToken {
  key: string;
  value: string;
}

export interface Partner {
  id: string;
  name: string;
  slug: string;
  tokens: StyleToken[];
  createdAt: string;
  updatedAt: string;
}

export interface EmailComponent {
  id: string;
  name: string;
  type: string;
  html: string;
  detectedVariables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CanvasInstance {
  id: string;
  componentId: string;
  contentValues: Record<string, string>;
  order: number;
}

export interface CanvasState {
  id: string;
  name: string;
  partnerId: string;
  instances: CanvasInstance[];
  previewWrapper: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailVersion {
  id: string;
  name: string;
  canvasState: CanvasState;
  createdAt: string;
}

// Legacy types for migration
export interface LegacyPartnerTheme {
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
    textTransform: string;
    textDecoration: string;
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
