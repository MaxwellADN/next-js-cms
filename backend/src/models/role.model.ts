
import { Schema, model } from "mongoose";
import { RoleInterface } from "../interfaces/role.interface";

export const RoleSchema = new Schema({
    createdAt: { 
        type: Date,
        default: new Date(),
    },
    updatedAt: { 
        type: Date,
        default: null,
    },
    name: {
        type: String,
        required: true
    }
});

const Role = model<RoleInterface>('Role', RoleSchema);
export default Role;