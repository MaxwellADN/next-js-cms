import jwt from 'jsonwebtoken'; 
import { TOKEN_SECRET } from '../constants/token.constant';

export class BearerTokenService {

    /**
     * The function takes in a data object and a deadline string, and returns a JWT token
     * @param {any} data - The data you want to encode in the token.
     * @param {string} deadline - The time in seconds that the token will be valid for.
     * @returns A token
     */
    public generate(data: any, deadline: string, ) { 
        return jwt.sign(data, TOKEN_SECRET, { expiresIn: deadline });
    }
}