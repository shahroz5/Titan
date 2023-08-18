
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Notification</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin: 0; padding: 0;">
    <table
      border="0"
      cellpadding="0"
      cellspacing="0"
      width="100%"
      style="background:#f6f4ee;overflow-x:auto;"
    >
      <tr>
        <td style="padding: 10px 0 30px 0;">
          <table
            align="center"
            border="0"
            cellpadding="0"
            cellspacing="0"
            width="600"
            style="border-collapse: collapse;"
          >
            <caption>
              <img
                src="https://www.tanishq.co.in/wps/wcm/connect/tanishq/cb53f671-01d0-449e-b18d-a4e61e6ffa0b/TanishqLogo.png?MOD=AJPERES&CACHEID=ROOTWORKSPACE.Z18_90IA1H80O0RT10QIMVSTFU3006-cb53f671-01d0-449e-b18d-a4e61e6ffa0b-mC036IT"
                class="img-responsive"
                alt=""
                style="padding: 30px 0px;"
              />
            </caption>

            <thead bgcolor="#7e6e38">
              <tr>
                <td
                  style="padding: 30px; color: #fff; font-size: 22px; font-weight: bold; font-family: Arial, sans-serif;"
                >
                  Job has Failed
                </td>
              </tr>
            </thead>
            <tbody
              bgcolor="#fff"
              style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.8;"
            >
              <tr>
                <td style="padding: 20px 30px;">
                  Dear ${name!"User"},
                </td>
              </tr>
               <tr>
                <td style="padding: 0px 30px;">
                  The ${jobName} that was triggered at ${date} has failed.
                </td>
              </tr>
             <tr>
                <td style="padding: 0px 30px;">
                  Please find the details:
                  <table style="width:100%;  border: 1px solid black">
  			<tr style="border: 1px solid black">
                      <td style="border: 1px solid black">FileName</td>
                      <td style="border: 1px solid black">Processed date</td> 
                      <td style="border: 1px solid black">Status</td>
                      <td style="border: 1px solid black">Total count</td>
                      <td style="border: 1px solid black">Success count</td>
                      <td style="border: 1px solid black">Failure count</td>
                      <td style="border: 1px solid black">Remarks</td>
  			</tr>
            <tr style="border: 1px solid black">
              <td style="border: 1px solid black">${fileName}</td>
              <td style="border: 1px solid black">${processedDate}</td>
              <td style="border: 1px solid black">${status}</td>
              <td style="border: 1px solid black">${totalCount}</td>
              <td style="border: 1px solid black">${successCount}</td>
              <td style="border: 1px solid black">${failureCount}</td>
              <td style="border: 1px solid black">${remarks}</td>
            </tr>
</table>
                </td>
              </tr>

              <tr>
                <td style="padding: 40px 30px 0px;">
                  Should you have any queries.
                </td>
              </tr>
              <tr>
                <td style="padding: 0px 30px;">
                  Please feel free to write to the system admin at
                  <a href="#">systemadmin@titan.com</a>.
                </td>
              </tr>
              <tr>
                <td style="padding: 30px 30px 0px;">
                  Yours sincerely,
                </td>
              </tr>
              <tr>
                <td style="padding: 0px 30px;">
                    ${orgName}
                  </td>
              </tr>
              <tr>
                <td style="padding: 0px 30px 30px;">
                    www.titan.com
                  </td>
              </tr>
            </tbody>
                       <thead bgcolor="#7e6e38">
              <tr>
                <td
                  style="padding: 12px; color: #fff; font-size: 14px; font-weight: bold; font-family: Arial, sans-serif;text-align: center"
                >
                  ${copyright}
                </td>
              </tr>
            </thead>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
