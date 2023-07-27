import { before, POST, PUT, route } from "awilix-express";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { UserService } from "../services/user.service";
import { HttpStatusCodeEnum } from "../enums/http-status-code.enum";
import { ErrorMessageEnum } from "../enums/error-message.enum";
import { TenantService } from "../services/tenant.service";
import { UserRoleEnum } from "../enums/user-role.enum";
import { RoleService } from "../services/role.service";
import { BearerTokenService } from "../services/bearer-token.service";
import { EncryptionService } from "../services/encryption.service";
import { UserInterface } from "../interfaces/user.interface";
import { ExpireInEnum } from "../enums/expire-in.enum";
import { AuthEmailService } from "../services/auth-email.service";
import { authenticate } from "../middlewares/auth.middleware";

@route('/auth')
export class AuthController {

    /**
     * This function takes in a userService, tenantService, roleService, encryptionService, and
     * bearerTokenService, and returns nothing.
     * @param {UserService} userService - UserService
     * @param {TenantService} tenantService - TenantService
     * @param {RoleService} roleService - RoleService
     * @param {EncryptionService} encryptionService - EncryptionService,
     * @param {BearerTokenService} bearerTokenService - BearerTokenService
     * @param {AuthEmailService} authEmailService - AuthEmailService
     */
    constructor(
        private readonly userService: UserService,
        private tenantService: TenantService,
        private readonly roleService: RoleService,
        private readonly encryptionService: EncryptionService,
        private readonly bearerTokenService: BearerTokenService,
        private readonly authEmailService: AuthEmailService
    ) { }

    @route('/register')
    @POST()
    /**
     * It creates a new user, a new tenant, and assigns the user to the tenant.
     * @param {Request} req - Request - the request object
     * @param {Response} res - Response - the response object
     * @returns The user object with the token property.
     */
    async signUp(req: Request, res: Response) {
        const session = await mongoose.startSession();
        session.startTransaction();
        const user: UserInterface = req.body;
        try {
            if (user) {
                const dbUser = await this.userService.getSingleByEmail(user.email);
                if (dbUser) return res.status(HttpStatusCodeEnum.CONFLIT).send(ErrorMessageEnum.CONFLIT);
                const dbTenants = await this.tenantService.createWithSession({ createdAt: new Date() }, session);
                const tenant = !!dbTenants?.length ? dbTenants[0] : null;
                user.tenant = tenant!;
                const adminRole = await this.roleService.getByName(UserRoleEnum.ADMIN);
                user.role = adminRole!;
                user.password = await this.encryptionService.encrypt(user.password);
                const createdUsers = await this.userService.createWithSession(user, session);
                const createdUser = !!createdUsers?.length ? createdUsers[0] : null;
                createdUser!.token = this.bearerTokenService.generate({ id: createdUser?.id, email: createdUser?.email }, ExpireInEnum.ONE_DAY);
                if (createdUser) {
                    const link = `${user.originUrl}/#/app/dashboard/token/${createdUser.token}`
                    await this.authEmailService.sendAccountValidationLink(
                        createdUser.email,
                        createdUser.fullname,
                        `Hi ${createdUser.fullname}! Activate your account - light-speed checkout`,
                        link
                    );
                }
 
                await session.commitTransaction();
                return res.status(HttpStatusCodeEnum.CREATED).json(createdUser)
            }
            return res.status(HttpStatusCodeEnum.BAD_REQUEST).json({ message: ErrorMessageEnum.BAD_REQUEST });
        } catch (error) {
            await session.abortTransaction();
            return res.status(HttpStatusCodeEnum.BAD_REQUEST).json({ message: error });
        } finally {
            await session.endSession();
        }
    }

    @route('/login')
    @POST()
    /**
     * It takes a user object from the request body, checks if the user exists in the database, if the
     * user exists, it checks if the password is correct, if the password is correct, it generates a
     * token and returns the user object with the token.
     * @param {Request} req - Request - the request object
     * @param {Response} res - Response - the response object
     * @returns The user object with the token property.
     */
    async signIn(req: Request, res: Response) {
        const user: UserInterface = req.body;
        try {
            const dbUser = await this.userService.getSingleByEmail(user.email);
            if (dbUser) {
                const expireIn = user?.rememberBe ? ExpireInEnum.SEVEN_DAYS : ExpireInEnum.ONE_DAY
                if (user?.password) {
                    const correctPassword = await this.encryptionService.compare(user.password, dbUser.password);
                    if (!correctPassword) return res.status(HttpStatusCodeEnum.UNAUTHORIZED).json({ message: ErrorMessageEnum.UNAUTHORIZED });
                    dbUser.token = this.bearerTokenService.generate({ id: dbUser?.id, email: dbUser?.email }, expireIn);
                } else if (user?.useSocialLogin) {
                    dbUser.token = this.bearerTokenService.generate({ id: dbUser?.id, email: dbUser?.email }, expireIn);
                }
                return res.status(HttpStatusCodeEnum.OK).json(dbUser);
            }
            return res.status(HttpStatusCodeEnum.BAD_REQUEST).json({ message: ErrorMessageEnum.NOT_FOUND });
        } catch (error) {
            return res.status(HttpStatusCodeEnum.BAD_REQUEST).json({ message: error });
        }
    }

    @route('/account-recovery')
    @POST()
    /**
     * It sends an account recovery link to the user's email address.
     * @param {Request} req - Request the request object
     * @param {Response} res - Response - the response object
     * @returns The response is being returned as a JSON object.
     */
    async sendAccountRecoveryLink(req: Request, res: Response) {
        const user: UserInterface = req.body;
        try {
            const dbUser = await this.userService.getSingleByEmail(user.email);
            if (!dbUser) return res.status(HttpStatusCodeEnum.NOT_FOUND).json({ message: ErrorMessageEnum.NOT_FOUND });
            const token = this.bearerTokenService.generate({ id: dbUser?.id, email: dbUser?.email }, ExpireInEnum.ONE_DAY);
            const link = `${user.originUrl}/#/auth/reset-password/${token}`
            const isEmailSent = await this.authEmailService.sendAccountRecoveryLink(
                dbUser.email,
                dbUser.fullname,
                `Hi ${dbUser.fullname}! You ask an account recovery link... `,
                link
            );
            return res.status(HttpStatusCodeEnum.OK).send(isEmailSent);
        } catch (error) {
            return res.status(HttpStatusCodeEnum.BAD_REQUEST).json({ message: ErrorMessageEnum.BAD_REQUEST });
        }
    }

    @route('/reset-password')
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
            return res.status(HttpStatusCodeEnum.BAD_REQUEST).json({ message: ErrorMessageEnum.BAD_REQUEST });
        }
    }

}