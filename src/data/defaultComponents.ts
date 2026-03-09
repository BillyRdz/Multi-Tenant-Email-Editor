import type { EmailComponent } from '../types';
import { extractVariables } from '../utils/templateEngine';

const componentData: Omit<EmailComponent, 'detectedVariables'>[] = [
  {
    id: 'comp-header',
    name: 'Email Header',
    type: 'header',
    html: `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: %%=v(@colorPrimary)=%%;">
  <tr>
    <td align="center" style="padding: 24px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font-family: %%=v(@fontFamily)=%%; font-size: 28px; font-weight: %%=v(@fontWeightBold)=%%; color: %%=v(@colorBackground)=%%; text-transform: %%=v(@textTransform)=%%; line-height: %%=v(@lineHeight)=%%;">
            %%=v(@partnerName)=%%
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
    html: `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: %%=v(@colorBackground)=%%;">
  <tr>
    <td align="center" style="padding: 32px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font-family: %%=v(@fontFamily)=%%; font-size: 16px; font-weight: %%=v(@fontWeight)=%%; color: %%=v(@colorTextMain)=%%; line-height: %%=v(@lineHeight)=%%;">
            <h2 style="margin: 0 0 16px 0; font-size: 22px; font-weight: %%=v(@fontWeightBold)=%%; color: %%=v(@colorTextMain)=%%; text-transform: %%=v(@textTransform)=%%;">
              %%=v(@headline)=%%
            </h2>
            <p style="margin: 0 0 12px 0; color: %%=v(@colorTextMuted)=%%;">
              %%=v(@bodyText)=%%
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
    html: `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: %%=v(@colorBackground)=%%;">
  <tr>
    <td align="center" style="padding: 16px;">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="border: %%=v(@borderStrokeWeight)=%%px solid %%=v(@colorTextMuted)=%%; border-radius: %%=v(@borderRadius)=%%px; overflow: hidden;">
        <tr>
          <!--[if mso]><td width="240" valign="top"><![endif]-->
          <!--[if !mso]><!--><td style="display: inline-block; width: 100%; max-width: 240px; vertical-align: top;"><!--<![endif]-->
            <img src="%%=v(@restaurantImage)=%%" alt="%%=v(@restaurantName)=%%" width="240" style="display: block; width: 100%; max-width: 240px; height: auto;" />
          </td>
          <!--[if mso]><td width="360" valign="top"><![endif]-->
          <!--[if !mso]><!--><td style="display: inline-block; width: 100%; max-width: 360px; vertical-align: top; padding: 20px;"><!--<![endif]-->
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-family: %%=v(@fontFamily)=%%; font-size: 20px; font-weight: %%=v(@fontWeightBold)=%%; color: %%=v(@colorTextMain)=%%; text-transform: %%=v(@textTransform)=%%; padding-bottom: 8px; line-height: %%=v(@lineHeight)=%%;">
                  %%=v(@restaurantName)=%%
                </td>
              </tr>
              <tr>
                <td style="font-family: %%=v(@fontFamily)=%%; font-size: 14px; color: %%=v(@colorPrimary)=%%; padding-bottom: 4px;">
                  %%=v(@restaurantRating)=%% &nbsp; <span style="color: %%=v(@colorTextMuted)=%%;">%%=v(@restaurantDistance)=%%</span>
                </td>
              </tr>
              <tr>
                <td style="font-family: %%=v(@fontFamily)=%%; font-size: 14px; font-weight: %%=v(@fontWeight)=%%; color: %%=v(@colorTextMuted)=%%; padding-bottom: 16px; line-height: %%=v(@lineHeight)=%%;">
                  %%=v(@restaurantMessage)=%%
                </td>
              </tr>
              <tr>
                <td>
                  <a href="%%=v(@restaurantCtaLink)=%%" style="display: inline-block; background-color: %%=v(@colorPrimary)=%%; color: %%=v(@colorBackground)=%%; font-family: %%=v(@fontFamily)=%%; font-size: 14px; font-weight: %%=v(@fontWeightBold)=%%; text-decoration: none; padding: 10px 24px; border-radius: %%=v(@borderRadius)=%%px; text-transform: %%=v(@textTransform)=%%;">
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
    html: `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: %%=v(@colorBackground)=%%;">
  <tr>
    <td align="center" style="padding: 24px 16px;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center" style="background-color: %%=v(@colorPrimary)=%%; border-radius: %%=v(@borderRadius)=%%px;">
            <a href="%%=v(@ctaLink)=%%" style="display: inline-block; background-color: %%=v(@colorPrimary)=%%; color: %%=v(@colorBackground)=%%; font-family: %%=v(@fontFamily)=%%; font-size: 16px; font-weight: %%=v(@fontWeightBold)=%%; text-decoration: none; padding: 14px 32px; border-radius: %%=v(@borderRadius)=%%px; text-transform: %%=v(@textTransform)=%%;">
              %%=v(@ctaText)=%%
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
    html: `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: %%=v(@colorSecondary)=%%;">
  <tr>
    <td align="center" style="padding: 24px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font-family: %%=v(@fontFamily)=%%; font-size: 12px; color: %%=v(@colorBackground)=%%; text-align: center; line-height: %%=v(@lineHeight)=%%; opacity: 0.8;">
            <p style="margin: 0 0 8px 0;">%%=v(@copyrightText)=%%</p>
            <p style="margin: 0;">
              <a href="%%=v(@unsubscribeLink)=%%" style="color: %%=v(@colorBackground)=%%; text-decoration: %%=v(@textDecoration)=%%;">Unsubscribe</a> &nbsp;|&nbsp;
              <a href="%%=v(@privacyLink)=%%" style="color: %%=v(@colorBackground)=%%; text-decoration: %%=v(@textDecoration)=%%;">Privacy Policy</a>
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

export const defaultComponents: EmailComponent[] = componentData.map(comp => ({
  ...comp,
  detectedVariables: extractVariables(comp.html),
}));
