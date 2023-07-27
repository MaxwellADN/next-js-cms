import bcrypt from 'bcryptjs'

export class PasswordCryptUtil {

    /**
     * This function takes a string, and returns a promise that resolves to a string.
     * @param {string} password - The password to be encrypted.
     * @returns
     */
    public async encrypt(password: string): Promise<string> {
        return await bcrypt.hash(password, 12);
    }

    public async compare(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }
}