import { Document } from "mongoose";

export interface TenantInterface extends Document {
    createdAt: Date;
    updateAt: Date;
}