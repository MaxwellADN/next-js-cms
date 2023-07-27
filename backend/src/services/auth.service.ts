import { UserInterface } from "../interfaces/user.interface";
import { UserService } from "./user.service";
import { ErrorMessageEnum } from "../enums/error-message.enum";
import { HttpStatusCodeEnum } from "../enums/http-status-code.enum";
import { TenantService } from "./tenant.service";
import { Response } from "express";
import mongoose from "mongoose";
import { RoleService } from "./role.service";
import { UserRoleEnum } from "../enums/user-role.enum";
import { EncryptionService } from "./encryption.service";
import { BearerTokenService } from "./bearer-token.service";

export class AuthService {

    /**
     * This function takes in a userService and a tenantService and assigns them to the private
     * variables userService and tenantService.
     * @param {UserService} userService - UserService
     * @param {TenantService} tenantService - TenantService
     * @param {RoleService} roleService - RoleService
     * @param {EncryptionService} encryptionService - EncryptionService
     * @param {BearerTokenService} bearerTokenService - BearerTokenService
     */
    constructor(
        private readonly userService: UserService,
        private readonly tenantService: TenantService,
        private readonly roleService: RoleService,
        private readonly encryptionService: EncryptionService,
        private readonly bearerTokenService: BearerTokenService,
    ) { }

    /**
     * It creates a new tenant, creates a new user, and assigns the user to the tenant.
     * 
     * Here's the code for the user model:
     * @param {UserInterface} user - UserInterface - the user object that is being created
     * @param {Response} res - Response - the response object
     * @returns The user object with the token property.
     */
    public async signUp(user: UserInterface, res: Response): Promise<Response> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            if (user) {
                const dbUser = await this.userService.getSingleByEmail(user.email);
                if (dbUser) return res.status(HttpStatusCodeEnum.CONFLIT).send(ErrorMessageEnum.CONFLIT);
                const dbTenants = await this.tenantService.createWithSession({ createdAt: new Date() }, session);
                if (!!dbTenants?.length) {
                    const tenant = dbTenants[0];
                    user.tenant = tenant;
                    const adminRole = await this.roleService.getByName(UserRoleEnum.ADMIN);
                    user.role = adminRole!;
                    user.password = await this.encryptionService.encrypt(user.password);
                    const createdUsers = await this.userService.createWithSession(user, session);
                    if (!!createdUsers?.length){
                        const craetedUser = createdUsers[0];
                        craetedUser.token = this.bearerTokenService.generate(craetedUser, '24h');
                        return res.status(HttpStatusCodeEnum.CREATED).json(craetedUser);
                    }
                    await session.commitTransaction();
                }
            }
            return res.status(HttpStatusCodeEnum.BAD_REQUEST).send(ErrorMessageEnum.BAD_REQUEST);
        } catch (error) {
            await session.abortTransaction();
            console.log(error);
            return res.status(HttpStatusCodeEnum.BAD_REQUEST).send(ErrorMessageEnum.BAD_REQUEST);
        } finally {
            await session.endSession();
        }
    }

}