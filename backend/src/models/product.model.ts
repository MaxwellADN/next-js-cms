import mongoose, { Schema, model } from "mongoose";
import { ProductInterface } from "../interfaces/product.interface";

export const ProductSchema = new Schema({
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
    description: { 
        type: String,
        required: false
    },
    price: { 
        type: Number,
        required: true
    },
    status: { 
        type: String,
        required: true
    },
    files: [],
    tax: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tax',
        required: false
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

const Product = model<ProductInterface>('Product', ProductSchema);
export default Product;