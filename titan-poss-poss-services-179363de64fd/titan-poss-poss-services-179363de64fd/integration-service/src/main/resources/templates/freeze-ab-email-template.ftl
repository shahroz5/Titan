<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Notification</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin: 0; padding: 0">
    <table
      border="0"
      cellpadding="0"
      cellspacing="0"
      width="100%"
      style="background: #f6f4ee"
    >
      <tr>
        <td style="padding: 10px 0 30px 0">
          <table
            align="center"
            border="0"
            cellpadding="0"
            cellspacing="0"
            width="600"
            style="border-collapse: collapse"
          >
            <caption>
              <img
                src="https://www.tanishq.co.in/wps/wcm/connect/tanishq/cb53f671-01d0-449e-b18d-a4e61e6ffa0b/TanishqLogo.png?MOD=AJPERES&CACHEID=ROOTWORKSPACE.Z18_90IA1H80O0RT10QIMVSTFU3006-cb53f671-01d0-449e-b18d-a4e61e6ffa0b-mC036IT"
                class="img-responsive"
                alt=""
                style="padding: 30px 0px"
              />
            </caption>

            <thead bgcolor="#7e6e38">
              <tr>
                <td
                  style="
                    padding: 30px;
                    color: #fff;
                    font-size: 22px;
                    font-weight: bold;
                    font-family: Arial, sans-serif;
                  "
                >
                  ${transactionType} - GR - Frozen
                </td>
              </tr>
            </thead>
            <tbody
              bgcolor="#fff"
              style="
                font-family: Arial, sans-serif;
                font-size: 14px;
                line-height: 1.8;
              "
            >
              <tr>
                <td style="padding: 20px 30px">Dear ${brandCode!'Tanishq'} Customer,</td>
              </tr>
              <tr>
                <td style="padding: 0px 30px 30px">
                  Thank you for placing <b>${transactionType}</b> : <b>${docNo}</b> Date:
                  <b>${docDate}</b>, Location Code: ${locationCode}. The status of the
                  Gold rate stands as Fixed (<b>${frozenRate}</b> per gm) for this booking. FYI
                  and T and C Apply.
                </td>
              </tr>

              <tr>
                <td style="padding: 30px 30px 0px">Yours sincerely,</td>
              </tr>
              <tr>
                <td style="padding: 0px 30px">${orgName}</td>
              </tr>
              <tr>
                <td style="padding: 0px 30px 30px">www.titan.com</td>
              </tr>
              <thead bgcolor="#7e6e38">
                <tr>
                  <td
                    style="
                      padding: 10px;
                      color: #fff;
                      font-size: 14px;
                      font-weight: bold;
                      font-family: Arial, sans-serif;
                      text-align: center;
                    "
                  >
                    © Titan Company LTD.
                  </td>
                </tr>
              </thead>
            </tbody>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
