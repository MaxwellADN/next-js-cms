import mongoose, { Schema, model } from "mongoose";
import { TaxInterface } from "../interfaces/tax.interface";

export const TaxSchema = new Schema({
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
    },
    rate: { 
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true
    }
});

const Tax = model<TaxInterface>('Tax', TaxSchema);
export default Tax;