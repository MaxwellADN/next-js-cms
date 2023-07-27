import { Document } from "mongoose";
import { ProductStatusEnum } from "../enums/product-status.enum";
import { FileInterface } from "./file.interface";
import { TaxInterface } from "./tax.interface";
import { TenantInterface } from "./tenant.interface";
import { UserInterface } from "./user.interface";

export interface ProductInterface extends Document {
    /**
     * Role id
     */
    id: string;
    /**
     * Date creation
     */
    createdAt: Date;
    /**
     * Updated date
     */
    updateAt: Date
    /**
     * Role name
     */
    name: string;
    /**
     * Produc description
     */
    description: string;
    /**
     * Product price
     */
    price: number;
    /**
     * Product status
     */
    status: ProductStatusEnum;
    /**
     * Product dowloadable files
     */
    files: FileInterface[];
    /**
     * Tax
     */
    tax: TaxInterface;
    /**
     * The user that create the data
     */
    createdBy: UserInterface;
    /**
     * The tenant
     */
    tenant: TenantInterface;
}