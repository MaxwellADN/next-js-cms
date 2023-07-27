import bcrypt from 'bcryptjs'

export class EncryptionService {
    /**
     * This function takes a string, and returns a promise that resolves to a string.
     * @param {string} password - The password to be encrypted.
     * @returns
     */
    public async encrypt(password: string): Promise<string> {
        return await bcrypt.hash(password, 12);
    }

    /**
     * It compares the password with the hashed password.
     * @param {string} password - The password to be hashed.
     * @param {string} hashedPassword - The hashed password that was stored in the database.
     * @returns A boolean value.
     */
    public async compare(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }
}