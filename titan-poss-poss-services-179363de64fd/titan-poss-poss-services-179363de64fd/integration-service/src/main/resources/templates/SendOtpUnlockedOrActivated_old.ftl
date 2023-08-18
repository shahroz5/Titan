<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Your OTP</title>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

    <link href='http://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>

    <!-- use the font -->
    <style>
        body {
            font-family: 'Roboto', sans-serif;
            font-size: 21px;
        }
    </style>
</head>
<body style="margin: 0; padding: 0;">

    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;">
        <tr>
            <td align="center" bgcolor="#1d2345" style="padding: 20px 0 10px 0;">
                <p style="color:white;font-size: 40px">${orgName}</p>
                <p style="color:white;font-size: 30px"> Your account is ${newStatus}</p>
            </td>
        </tr>
        <tr>
            <td bgcolor="#eaeaea" style="padding: 40px 30px 40px 30px;">
                <p>Dear ${name!"User"},</p>
                <p>OTP Token :- ${otp}</p>
                <p>Expiry Time :- ${expiryTime}</p><br>
                <p>Thanks,<br/>${orgName}</p>
            </td>
        </tr>
        <tr>
                <td
                  style="padding: 12px; color: #fff; font-size: 12px; font-weight: bold; font-family: Arial, sans-serif;text-align: center"
                >
                  ${copyright}
                </td>
        </tr>
    </table>

</body>
</html>