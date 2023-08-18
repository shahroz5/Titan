
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Approval Notification</title>
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
                  style="padding: 30px; color: #fff; font-size: 20px; font-weight: bold; font-family: Arial, sans-serif;"
                >
                  <#if typeOfRequest??>
                    ${typeOfRequest} Discount Request Notification
                  <#else>
                   ${workflowType} Workflow Approval Notification
                  </#if>
                </td>
              </tr>
            </thead>
            <tbody
              bgcolor="#fff"
              style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.8;"
            >
              <tr>
                <td style="padding: 20px 30px;">
                  Dear <b>${approver}</b> User,
                </td>
              </tr>
              <tr>
                <td style="padding: 20px 30px;">
                  Please complete the Task assigned to you with the Approval details provided below.
                </td>
              </tr>
              <tr>
                <td style="padding: 0px 30px;">
                  <b>Approval Type:</b> ${workflowType}
                </td>
              </tr>
              <tr>
                <td style="padding: 20px 30px;">
                  Please login to the application and provide the Approval or Rejection with your Relevant Comments.                  
                </td>
              </tr>             
              <tr>
                <td style="padding: 40px 30px 0px;">
                  Should you have any queries.
                </td>
              </tr>
              <tr>
                <td style="padding: 0px 30px;">
                  Please feel free to write to the Systems Admin at
                  <a href="#">systemsadmin@titan.com</a>.
                </td>
              </tr>
              <tr>
                <td style="padding: 30px 30px 0px;">
                  Yours sincerely,
                </td>
              </tr>
              <tr>
                <td style="padding: 0px 30px;">
                    Admin
                  </td>
              </tr>
              <tr>
                <td style="padding: 0px 30px 30px;">
                    <a href="#">www.titan.com</a>
                  </td>
              </tr>
            </tbody>
                       <thead bgcolor="#7e6e38">
              <tr>
                <td
                  style="padding: 12px; color: #fff; font-size: 14px; font-weight: bold; font-family: Arial, sans-serif;text-align: center"
                >
                  
                </td>
              </tr>
            </thead>
 
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
