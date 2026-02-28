import type { PartnerTheme, EmailComponent, RACardData } from '../types';

function generateStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

export function renderComponent(
  component: EmailComponent,
  theme: PartnerTheme,
  raCardData?: RACardData
): string {
  let html = component.html;

  // Replace theme tokens
  html = html.replace(/\$\{theme\.typography\.fontFamily\}/g, theme.typography.fontFamily);
  html = html.replace(/\$\{theme\.typography\.fontWeight\}/g, String(theme.typography.fontWeight));
  html = html.replace(/\$\{theme\.typography\.fontWeightBold\}/g, String(theme.typography.fontWeightBold));
  html = html.replace(/\$\{theme\.typography\.lineHeight\}/g, String(theme.typography.lineHeight));
  html = html.replace(/\$\{theme\.textDecoration\.textTransform\}/g, theme.textDecoration.textTransform);
  html = html.replace(/\$\{theme\.textDecoration\.textDecoration\}/g, theme.textDecoration.textDecoration);
  html = html.replace(/\$\{theme\.colors\.primary\}/g, theme.colors.primary);
  html = html.replace(/\$\{theme\.colors\.secondary\}/g, theme.colors.secondary);
  html = html.replace(/\$\{theme\.colors\.backgroundSurface\}/g, theme.colors.backgroundSurface);
  html = html.replace(/\$\{theme\.colors\.textMain\}/g, theme.colors.textMain);
  html = html.replace(/\$\{theme\.colors\.textMuted\}/g, theme.colors.textMuted);
  html = html.replace(/\$\{theme\.uiAccents\.borderRadius\}/g, String(theme.uiAccents.borderRadius));
  html = html.replace(/\$\{theme\.uiAccents\.borderStrokeWeight\}/g, String(theme.uiAccents.borderStrokeWeight));

  // Replace partner name
  html = html.replace(/\$\{partnerName\}/g, theme.name);

  // Replace RA Card data
  if (raCardData) {
    html = html.replace(/\$\{raCard\.name\}/g, raCardData.name);
    html = html.replace(/\$\{raCard\.rating\}/g, String(raCardData.rating));
    html = html.replace(/\$\{raCard\.milesAway\}/g, String(raCardData.milesAway));
    html = html.replace(/\$\{raCard\.message\}/g, raCardData.message);
    html = html.replace(/\$\{raCard\.ctaLink\}/g, raCardData.ctaLink);
    html = html.replace(/\$\{raCard\.imageUrl\}/g, raCardData.imageUrl);
    html = html.replace(/\$\{stars\}/g, generateStars(raCardData.rating));
  }

  return html;
}

export function renderFullEmail(
  components: EmailComponent[],
  activeComponentIds: string[],
  theme: PartnerTheme,
  raCardData: RACardData,
  raCards?: RACardData[]
): string {
  const orderedComponents = activeComponentIds
    .map(id => components.find(c => c.id === id))
    .filter((c): c is EmailComponent => c !== undefined);

  const bodyHtml = orderedComponents
    .map(comp => {
      if (comp.type === 'ra-card' && raCards && raCards.length > 0) {
        // Render one RA card for each entry
        return raCards
          .map(card => renderComponent(comp, theme, card))
          .join('\n');
      }
      return renderComponent(comp, theme, raCardData);
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${theme.name} Email</title>
  <!--[if !mso]><!-->
  <style>
    @media screen and (max-width: 600px) {
      table[class="responsive"] { width: 100% !important; }
      td[class="stack"] { display: block !important; width: 100% !important; max-width: 100% !important; }
    }
  </style>
  <!--<![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: ${theme.colors.backgroundSurface}; font-family: ${theme.typography.fontFamily};">
  <center>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center">
${bodyHtml}
        </td>
      </tr>
    </table>
  </center>
</body>
</html>`;
}

export function minifyHtml(html: string): string {
  return html
    .replace(/<!--(?!\[if).*?-->/gs, '') // remove comments except conditional
    .replace(/\n\s*/g, '') // remove newlines and leading whitespace
    .replace(/\s{2,}/g, ' ') // collapse whitespace
    .trim();
}
