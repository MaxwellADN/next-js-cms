import { Document } from "mongoose";
import { TenantInterface } from "./tenant.interface";
import { UserInterface } from "./user.interface";

export interface TaxInterface extends Document {
    /**
     * Id
     */
    id: string | undefined;
    /**
     * Date creation
     */
    createdAt: Date | undefined;
    /**
     * Updated date
     */
    updateAt: Date | undefined
    /**
     * Tax name
     */
    name: string | undefined;
    /**
     * Tax rate
     */
    rate: number | undefined;
    /**
     * The user that create the data
     */
    createdBy: UserInterface;
    /**
     * The tenant
     */
    tenant: TenantInterface;
}