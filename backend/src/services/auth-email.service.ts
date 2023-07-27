import { EmailUtil } from "../utils/email.util";
import fs from 'fs';
import path from 'path'

export class AuthEmailService {

    /**
     * It reads an HTML file, replaces some placeholders with values, and sends the email
     * @param {string} to - The email address of the user
     * @param {string} name - The name of the user
     * @param {string} subject - The subject of the email
     * @param {string} link - http://localhost:3000/account/recover/{token}
     * @returns The return value is a promise.
     */
    public async sendAccountRecoveryLink(to: string, name: string, subject: string, link: string) {
        try {
            let content = fs.readFileSync(path.resolve(__dirname, '../common/email-templates/account-recovery-link.html'), { encoding: 'utf-8' });
            content = content.replace('{{fullname}}', name);
            content = content.replace('{{link}}', link);
            return await EmailUtil.sendEmail(to, subject, content);
        } catch (error) {
            throw error;
        }
    }

    /**
     * It reads a file, replaces some text in the file, and then sends the file as an email
     * @param {string} to - The email address of the recipient
     * @param {string} name - The name of the user
     * @param {string} subject - The subject of the email
     * @param {string} link -
     * http://localhost:3000/api/v1/auth/verify-email?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjY
     * @returns The return value is a promise.
     */
    public async sendAccountValidationLink(to: string, name: string, subject: string, link: string) {
        try {
            let content = fs.readFileSync(path.resolve(__dirname, '../common/email-templates/welcome-email.html'), { encoding: 'utf-8' });
            content = content.replace('{{fullname}}', name);
            content = content.replace('{{link}}', link);
            return await EmailUtil.sendEmail(to, subject, content);
        } catch (error) {
            throw error;
        }
    }
}