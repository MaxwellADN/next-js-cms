import nodeMailer from 'nodemailer';
import { SMTP_CONFIG } from '../constants/smtp-config.constant';

export class EmailUtil {

    /**
     * It sends an email to the specified email address with the specified subject and content
     * @param {string} to - The email address of the recipient.
     * @param {string} subject - The subject of the email
     * @param {string} content - The content of the email.
     * @returns The return value of the callback function.
     */
    public static async sendEmail(to: string, subject: string, content: string): Promise<boolean> {
        try {
            let transporter = nodeMailer.createTransport(SMTP_CONFIG);
            let mailOptions = {
                from: SMTP_CONFIG.auth.user,
                to: to,
                subject: subject,
                html: content
            }
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error)
                    return false; 
                }
                console.log(`Message ${info.messageId} is sent ${info.response}`)
                return true;
            });
            return false;
        } catch (error) {
            throw error;
        }
    }
}