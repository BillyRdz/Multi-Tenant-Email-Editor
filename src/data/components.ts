import type { EmailComponent } from '../types';

export const defaultComponents: EmailComponent[] = [
  {
    id: 'comp-header',
    name: 'Email Header',
    type: 'header',
    html: `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: \${theme.colors.primary};">
  <tr>
    <td align="center" style="padding: 24px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font-family: \${theme.typography.fontFamily}; font-size: 28px; font-weight: \${theme.typography.fontWeightBold}; color: \${theme.colors.backgroundSurface}; text-transform: \${theme.textDecoration.textTransform}; line-height: \${theme.typography.lineHeight};">
            \${partnerName}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'comp-body',
    name: 'Body Text Block',
    type: 'body',
    html: `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: \${theme.colors.backgroundSurface};">
  <tr>
    <td align="center" style="padding: 32px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font-family: \${theme.typography.fontFamily}; font-size: 16px; font-weight: \${theme.typography.fontWeight}; color: \${theme.colors.textMain}; line-height: \${theme.typography.lineHeight};">
            <h2 style="margin: 0 0 16px 0; font-size: 22px; font-weight: \${theme.typography.fontWeightBold}; color: \${theme.colors.textMain}; text-transform: \${theme.textDecoration.textTransform};">
              Your order is on its way!
            </h2>
            <p style="margin: 0 0 12px 0; color: \${theme.colors.textMuted};">
              Great news! Your food is being prepared and will arrive soon. Track your order in the app for real-time updates.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'comp-ra-card',
    name: 'Restaurant Area Card',
    type: 'ra-card',
    html: `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: \${theme.colors.backgroundSurface};">
  <tr>
    <td align="center" style="padding: 16px;">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="border: \${theme.uiAccents.borderStrokeWeight}px solid \${theme.colors.textMuted}; border-radius: \${theme.uiAccents.borderRadius}px; overflow: hidden;">
        <tr>
          <!--[if mso]><td width="240" valign="top"><![endif]-->
          <!--[if !mso]><!--><td style="display: inline-block; width: 100%; max-width: 240px; vertical-align: top;"><!--<![endif]-->
            <img src="\${raCard.imageUrl}" alt="\${raCard.name}" width="240" style="display: block; width: 100%; max-width: 240px; height: auto;" />
          </td>
          <!--[if mso]><td width="360" valign="top"><![endif]-->
          <!--[if !mso]><!--><td style="display: inline-block; width: 100%; max-width: 360px; vertical-align: top; padding: 20px;"><!--<![endif]-->
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-family: \${theme.typography.fontFamily}; font-size: 20px; font-weight: \${theme.typography.fontWeightBold}; color: \${theme.colors.textMain}; text-transform: \${theme.textDecoration.textTransform}; padding-bottom: 8px; line-height: \${theme.typography.lineHeight};">
                  \${raCard.name}
                </td>
              </tr>
              <tr>
                <td style="font-family: \${theme.typography.fontFamily}; font-size: 14px; color: \${theme.colors.primary}; padding-bottom: 4px;">
                  \${stars} &nbsp; <span style="color: \${theme.colors.textMuted};">\${raCard.milesAway} mi away</span>
                </td>
              </tr>
              <tr>
                <td style="font-family: \${theme.typography.fontFamily}; font-size: 14px; font-weight: \${theme.typography.fontWeight}; color: \${theme.colors.textMuted}; padding-bottom: 16px; line-height: \${theme.typography.lineHeight};">
                  \${raCard.message}
                </td>
              </tr>
              <tr>
                <td>
                  <a href="\${raCard.ctaLink}" style="display: inline-block; background-color: \${theme.colors.primary}; color: \${theme.colors.backgroundSurface}; font-family: \${theme.typography.fontFamily}; font-size: 14px; font-weight: \${theme.typography.fontWeightBold}; text-decoration: none; padding: 10px 24px; border-radius: \${theme.uiAccents.borderRadius}px; text-transform: \${theme.textDecoration.textTransform};">
                    Order Now
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'comp-cta',
    name: 'CTA Button Block',
    type: 'cta',
    html: `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: \${theme.colors.backgroundSurface};">
  <tr>
    <td align="center" style="padding: 24px 16px;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center" style="background-color: \${theme.colors.primary}; border-radius: \${theme.uiAccents.borderRadius}px;">
            <a href="#" style="display: inline-block; background-color: \${theme.colors.primary}; color: \${theme.colors.backgroundSurface}; font-family: \${theme.typography.fontFamily}; font-size: 16px; font-weight: \${theme.typography.fontWeightBold}; text-decoration: none; padding: 14px 32px; border-radius: \${theme.uiAccents.borderRadius}px; text-transform: \${theme.textDecoration.textTransform};">
              Track Your Order
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'comp-footer',
    name: 'Email Footer',
    type: 'footer',
    html: `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: \${theme.colors.secondary};">
  <tr>
    <td align="center" style="padding: 24px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font-family: \${theme.typography.fontFamily}; font-size: 12px; color: \${theme.colors.backgroundSurface}; text-align: center; line-height: \${theme.typography.lineHeight}; opacity: 0.8;">
            <p style="margin: 0 0 8px 0;">© 2025 \${partnerName}. All rights reserved.</p>
            <p style="margin: 0;">
              <a href="#" style="color: \${theme.colors.backgroundSurface}; text-decoration: \${theme.textDecoration.textDecoration};">Unsubscribe</a> &nbsp;|&nbsp;
              <a href="#" style="color: \${theme.colors.backgroundSurface}; text-decoration: \${theme.textDecoration.textDecoration};">Privacy Policy</a>
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];
