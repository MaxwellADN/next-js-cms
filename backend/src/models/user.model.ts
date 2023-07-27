import { Schema, model } from "mongoose";
import mongoose from "mongoose";
import { UserInterface } from "../interfaces/user.interface";

export const UserSchema = new Schema({
    createdAt: { 
        type: Date,
        default: new Date(),
    },
    updatedAt: { 
        type: Date,
        default: null,
    },
    fullname: {
        type: String,
        required: true
    },
    email: { 
        type: String,
        required: true
    }, 
    password: {
        type: String,
        required: true
    }, 
    newPassword: {
        type: String,
        required: false
    }, 
    token: {
        type: String,
        required: false
    },
    verifiedEmail: {
        type: String,
        required: false
    },
    agreeWithTerms: {
        type: Boolean,
        required: true
    },
    useSocialLogin: {
        type: Boolean,
        required: false
    },
    rememberBe: {
        type: Boolean,
        required: false
    },
    changePassword: {
        type: Boolean,
        required: false
    },
    originUrl: {
        type: String,
        required: false,
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true
    }
});

const User = model<UserInterface>('User', UserSchema);
export default User;