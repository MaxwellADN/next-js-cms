import mongoose, { Schema, model } from "mongoose";
import { FileInterface } from "../interfaces/file.interface";

export const ProductFileSchema = new Schema({
    createdAt: { 
        type: Date,
        default: new Date(),
    },
    updatedAt: { 
        type: Date,
        default: null,
    },
    filename: { 
        type: String,
        required: true
    },
    extension: { 
        type: String,
        required: true
    },
    url: { 
        type: String,
        required: true
    },
    Product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true
    }
});

const ProductFile = model<FileInterface>('ProductFile', ProductFileSchema);
export default ProductFile;