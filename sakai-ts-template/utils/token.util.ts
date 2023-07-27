import jwt, { JwtPayload } from 'jsonwebtoken';

export const isTokenExpired = (token: string) => {
    try {
        const decodedToken = jwt.decode(token) as JwtPayload;
        const currentTime = Math.floor(Date.now() / 1000); // Get the current time in seconds
    
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          // Token is expired
          return true;
        } else {
          // Token is not expired
          return false;
        }
    } catch (error) {
        console.log(error)
        return false;
    }
};
