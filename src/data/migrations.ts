import type { Partner, StyleToken, LegacyPartnerTheme } from '../types';

export function migrateLegacyPartner(legacy: LegacyPartnerTheme): Partner {
  const now = new Date().toISOString();
  const tokens: StyleToken[] = [
    { key: 'fontFamily', value: legacy.typography.fontFamily },
    { key: 'fontWeight', value: String(legacy.typography.fontWeight) },
    { key: 'fontWeightBold', value: String(legacy.typography.fontWeightBold) },
    { key: 'lineHeight', value: String(legacy.typography.lineHeight) },
    { key: 'textTransform', value: legacy.textDecoration.textTransform },
    { key: 'textDecoration', value: legacy.textDecoration.textDecoration },
    { key: 'colorPrimary', value: legacy.colors.primary },
    { key: 'colorSecondary', value: legacy.colors.secondary },
    { key: 'colorBackground', value: legacy.colors.backgroundSurface },
    { key: 'colorTextMain', value: legacy.colors.textMain },
    { key: 'colorTextMuted', value: legacy.colors.textMuted },
    { key: 'borderRadius', value: String(legacy.uiAccents.borderRadius) },
    { key: 'borderStrokeWeight', value: String(legacy.uiAccents.borderStrokeWeight) },
    { key: 'partnerName', value: legacy.name },
  ];

  return {
    id: legacy.id,
    name: legacy.name,
    slug: legacy.slug,
    tokens,
    createdAt: now,
    updatedAt: now,
  };
}

export function migrateLegacyPartners(legacyPartners: LegacyPartnerTheme[]): Partner[] {
  return legacyPartners.map(migrateLegacyPartner);
}
