import { NextFunction, Request, Response } from "express";
import { HttpStatusCodeEnum } from "../enums/http-status-code.enum";
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from "../constants/token.constant";
import { ErrorMessageEnum } from "../enums/error-message.enum";

export function authenticate(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (token) {
            const decodedData: any = jwt.verify(token, TOKEN_SECRET)
            req.params.userId = decodedData?.id;
        }
        else{
            return res.status(HttpStatusCodeEnum.UNAUTHORIZED).send(ErrorMessageEnum.UNAUTHORIZED);
        }
        next();
    } catch (error) {
        return res.status(HttpStatusCodeEnum.UNAUTHORIZED).send(error);
    }
}