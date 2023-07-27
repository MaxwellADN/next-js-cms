import { Document } from "mongoose";
import { RoleInterface } from "./role.interface";
import { TenantInterface } from "./tenant.interface";

export interface UserInterface extends Document {
    createdAt: Date;
    updateAt: Date;
    fullname: string;
    email: string;
    password: string; 
    newPassword: string;
    token: string;
    verifiedEmail: boolean;
    agreeWithTerms: boolean; 
    useSocialLogin: boolean;
    rememberBe: boolean;
    changePassword: boolean;
    originUrl: string;
    role: RoleInterface;
    tenant: TenantInterface;
    createdBy: UserInterface
}