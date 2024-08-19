import nodemailer from "nodemailer"

const mailer = async (email, otp) => {

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SERVER_EMAIL,
            pass: process.env.SERVER_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    try {

        await transporter.sendMail({
            from: `"GameLedger" <${process.env.SERVER_EMAIL}>`,
            to: email,
            subject: "Reset Password",
            html:
                `<!DOCTYPE html>
                <html>
                
                <head>
                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                
                    <title>Forgot Password</title>
                
                </head>
                
                <body style="margin: 0;">

                <div style="display: none; max-height: 0px; overflow: hidden;">
                    We received a request to reset the password for your account. If you made this request, please use the following One-Time Password (OTP). This OTP will expire in 5 minutes.
                </div>

                <div style="display: none; max-height: 0px; overflow: hidden;">
                    &#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;
                    &#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;
                    &#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;
                </div>
                
                    <center style="width: 100%; table-layout: fixed; text-align: center;">
                
                        <table width="100%" align="center" style="border-spacing: 0; background-color: #374151;
                        max-width: 800px;
                        font-family: Helvetica, sans-serif;
                        color: #cbd5e1;
                        text-align: center;
                        padding: 10px 0px 30px 0px;">
                
                            <tr>
                                <td>
                                    <table align="center" style="border-spacing: 0; text-align: center; padding: 20px 0px 15px 0px;">
                                        <tr>
                                            <td>
                                                <img src="https://i.ibb.co/Vgmhr4V/logo.png" alt="logo" border="0" width="32" height="32">
                                            </td>
                                            <td>
                                                <h1 style="color:#3b82f6;font-size: 24px; margin: 0px 5px;">GameLedger</h1>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                
                            <tr>
                                <td>
                                    <table align="center" width="90%"
                                        style="padding: 20px; background-color: #1f2937; border-radius: 25px; border-spacing: 0;">
                                        <tr>
                                            <td>
                                                <h2 style="color: #3b82f6; font-size: 18px;">RESET PASSWORD</h2>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p style="font-size: 14px; line-height: 1.5;">
                                                    We received a request to reset the password for your
                                                    account. If you made this request, please use the following One-Time Password (OTP).
                                                    This OTP will expire in 5 minutes.</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <table align="center" cellspacing="10">
                                                    <tr style="color:#3b82f6; font-weight: bold; font-size: 32px; text-align: center; letter-spacing: 5px;">
                                                        <td>
                                                            <p>${otp}</p>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p style="font-size: 12px; color: #94a3b8">If you did not request a password reset, you
                                                    can safely
                                                    ignore this email.</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <table align="center" style="border-spacing: 0; padding-top: 30px;">
                                        <tr style="font-size: 12px; color: #94a3b8; line-height: 0;">
                                            <td>
                                                <a href="#"
                                                    style="text-decoration: none; color: inherit; margin: 0px 5px 0px 5px;">About</a>
                                            </td>
                                            <td>
                                                <a href="#"
                                                    style="text-decoration: none; color: inherit; margin: 0px 5px 0px 5px;">Contact
                                                    Us</a>
                                            </td>
                                            <td>
                                                <a href="#"
                                                    style="text-decoration: none; color: inherit; margin: 0px 5px 0px 5px;">Terms &
                                                    Privacy</a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                
                            </tr>
                            <tr>
                                <td style="font-size: 12px; color: #94a3b8; line-height: 0; padding-top: 10px;">
                                    <p>&copy; ${new Date().getFullYear()} GameLedger</p>
                                </td>
                            </tr>
                
                        </table>
                    </center>
                </body>
                <html>`

        });

    } catch (err) {
        console.log(err);
    }





}

export default mailer