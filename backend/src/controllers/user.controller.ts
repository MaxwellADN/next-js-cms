import { route, PUT, before } from "awilix-express";
import { ErrorMessageEnum } from "../enums/error-message.enum";
import { HttpStatusCodeEnum } from "../enums/http-status-code.enum";
import { UserInterface } from "../interfaces/user.interface";
import { EncryptionService } from "../services/encryption.service";
import { UserService } from "../services/user.service";
import { Request, Response } from "express";
import { authenticate } from "../middlewares/auth.middleware";

@route('/user')
export class UserController {

    /**
     * The constructor function is a special function that is called when an instance of a class is
     * created
     * @param {UserService} userService - This is the service that we created earlier.
     * @param {EncryptionService} encryptionService - This is the service that we created in the
     * previous step.
     */
    constructor(private readonly userService: UserService, private readonly encryptionService: EncryptionService) {}

    @before([authenticate])
    @PUT()
    /**
     * It takes a user object from the request body, gets the user from the database, encrypts the
     * password, updates the user in the database, and returns the updated user.
     * @param {Request} req - Request - this is the request object that contains the request data
     * @param {Response} res - Response - the response object
     * @returns The updated user object.
     */
    async updatePassword(req: Request, res: Response) {
        const user: UserInterface = req.body;
        try {
            const dbUser = await this.userService.getSingleByEmail(user.email);
            if (dbUser) {
                dbUser.password = await this.encryptionService.encrypt(user.password);
                dbUser.updateAt = new Date();
                dbUser.role = dbUser.role?.id;
                const updatedUser = await this.userService.update(dbUser);
                return res.status(HttpStatusCodeEnum.OK).json(updatedUser);
            }
            return res.status(HttpStatusCodeEnum.NOT_FOUND).json({ message: ErrorMessageEnum.NOT_FOUND });
        } catch (error) {
            return res.status(HttpStatusCodeEnum.BAD_REQUEST).json({ message: error });
        }
    }
}