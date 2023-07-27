import { Schema, model } from "mongoose";
import { TenantInterface } from "../interfaces/tenant.interface";

export const TenantSchema = new Schema({
    createdAt: { 
        type: Date,
        default: new Date(),
    },
    updatedAt: { 
        type: Date,
        default: null,
    }
});

const Tenant = model<TenantInterface>('Tenant', TenantSchema);
export default Tenant;