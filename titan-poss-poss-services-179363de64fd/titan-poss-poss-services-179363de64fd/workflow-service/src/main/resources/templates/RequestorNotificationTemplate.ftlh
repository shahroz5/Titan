
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>${workflowType}  Approval Notification</title>
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
                style="padding: 0px 0px;"
              />
            </caption>
            <thead bgcolor="#7e6e38">
              <tr>
                <td
                  style="padding: 30px; color: #fff; font-size: 20px; font-weight: bold; font-family: Arial, sans-serif;">
                  <#if isApproved>
                  		 <#if typeOfRequest??>
                    	 ${typeOfRequest} Discount Request Success Notification
                  		 <#else>
                   		${workflowType} Successful Approval Notification
                 		 </#if>
                  <#else>
                  		 <#if typeOfRequest??>
                    	 ${typeOfRequest} Discount Rejection Notification
                  		 <#else>
                   		${workflowType} Rejection Notification
                 		 </#if>
                  </#if>
                </td>
              </tr>
            </thead>
            <tbody
              bgcolor="#fff"
              style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.8;"
            >
              <tr>
                <td style="padding: 20px 30px 20px;">
                  Dear <b>${requestor}</b> Requestor,
                </td>
              </tr>
              
              <tr>
                <td style="padding: 20px 30px 20px;">
                <#if isApproved>
                  <b>Congratulations !!</b>
                  <#else>
                  <b>Thank you</b> for your time.
                </#if>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 10px 30px;">
                  Your <b>${workflowType}</b> workflow request has been
                  <#if isApproved>
                  <b><i><u>APPROVED SUCCESSFULLY</u></i></b> by <b>${approverName}</b> User.
                  <#else>
                  <b><i><u>REJECTED</u></i></b> by <b>${approverName}</b> User. Please Review and <b>Raise your Request again</b>.
                  </#if>
                  					
                </td>
              </tr>
              <tr>
                <td style="padding: 20px 30px 20px;">
                  The above Approver action has been taken for the Below Request Details Raised by you: 
                </td>
              </tr>
               <tr>
                <td style="padding: 0px 20px;" >            
                    <table style="width:100%;  border: 3px solid black"  cellspacing="0" cellpadding="1">
                    <tr>
                      <#list emailContent as key, value>
                        <th style="border: 1px solid black">
                           ${key}                
                        </th>                      
                      </#list>
                      </tr>
                      <tr>
                      <#list emailContent as key, value>
                        <td style="border: 1px solid black;text-align:  center;vertical-align: middle;">          
                          	${value}                
                        </td>
                      </#list>
                      </tr>
                  </table>             
                </td>        
              </tr>
              <tr>
                <td style="padding: 30px 30px 0px;">
                  Should you have any queries, Please feel free to write to the Systems Admin at
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
-