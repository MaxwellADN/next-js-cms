import { Document } from "mongoose";

export interface RoleInterface extends Document  {
    createdAt: Date;
    updateAt: Date;
    name: string;
}