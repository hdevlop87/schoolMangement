import { Injectable } from 'najm-api';


@Injectable()
export class EmailService {
  private defaultSender: string;
  
  constructor() {
    this.defaultSender = process.env.EMAIL_SENDER ;
  }

  async sendEmail(params){
    const { to, subject, body, from = this.defaultSender, cc = [], bcc = [], attachments = [] } = params;
    
    try {
      console.log(`
        ----- EMAIL SENDING -----
        From: ${from}
        To: ${to}
        CC: ${cc.join(', ')}
        BCC: ${bcc.join(', ')}
        Subject: ${subject}
        Body:
        ${body}
        Attachments: ${attachments.map(a => a.filename).join(', ')}
        ----- END EMAIL -----
      `);

      return { success: true, message: 'Email sent successfully (simulated)' };
    } catch (error) {
      console.error('Failed to send email:', error);
      return { success: false, message: `Email sending failed: ${error.message}` };
    }
  }


  async sendPasswordEmail(email, name, password){
    const subject = 'Your Parking System Account Password';
    const body = `
      <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Welcome to the Parking System!</h2>
        <p>Hello ${name},</p>
        <p>Your account has been created successfully.</p>
        <p>Here are your login details:</p>
        <ul>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Password:</strong> ${password}</li>
        </ul>
        <p>For security reasons, we recommend changing your password after logging in for the first time.</p>
        <p>If you have any questions, please contact our support team.</p>
        <p>Thank you,<br>The Parking System Team</p>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject,
      body,
    });
  }
}
