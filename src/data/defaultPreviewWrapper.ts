export const defaultPreviewWrapper = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Email Preview</title>
  <!--[if !mso]><!-->
  <style>
    @media screen and (max-width: 600px) {
      table[class="responsive"] { width: 100% !important; }
      td[class="stack"] { display: block !important; width: 100% !important; max-width: 100% !important; }
    }
  </style>
  <!--<![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5;">
  <center>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center">
%%CANVAS_CONTENT%%
        </td>
      </tr>
    </table>
  </center>
</body>
</html>`;
