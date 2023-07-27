import { ClientSession } from "mongoose";
import { ProductInterface } from "../interfaces/product.interface";
import { TenantInterface } from "../interfaces/tenant.interface";
import Product from "../models/product.model";
import { SortDirection } from "aws-sdk/clients/quicksight";
import { PaginationInterface } from "../interfaces/pagination.interface";

export class ProductService {

    /**
     * It returns a promise that resolves to a ProductInterface or null
     * @param {string} id - string - The id of the product you want to get.
     * @returns A promise of a ProductInterface or null.
     */
    public async getSingle(id: string): Promise<ProductInterface | null> {
        return await Product.findById(id).populate('tax').exec();
    }

    /**
     * This function returns an array of ProductInterface objects, or null, based on the tenantId
     * parameter.
     * @param {string} tenantId - string - The tenantId is a string that is passed in from the
     * controller.
     * @returns An array of ProductInterface objects or null.
     */
    public async getAll(pagination: PaginationInterface): Promise<ProductInterface[] | null> {
        const regex = new RegExp(pagination.searchTerm, 'i');
        let sort: any = { createdAt: -1 };
        if (pagination.sortDirection !== '') {
            sort = { [pagination.sortField]: pagination.sortDirection === 'asc' ? -1 : 1 };
        }
        return await Product.find(
            {
                $and: [
                    { tenant: pagination.tenantId },
                    {
                        $or: [
                            { name: { $regex: regex } },
                            { description: { $regex: regex } },
                            { status: { $regex: regex } }
                        ]
                    }
                ]
            })
            .skip(pagination.skip)
            .limit(pagination.size)
            .sort(sort)
            .exec();
    }

    public async count(tenantId: string | TenantInterface, searchTerm: string): Promise<number | null> {
        const regex = new RegExp(searchTerm, 'i');
        return await Product.count(
            {
                $and: [
                    { tenant: tenantId },
                    {
                        $or: [
                            { name: { $regex: regex } },
                            { description: { $regex: regex } },
                            { status: { $regex: regex } }
                        ]
                    }
                ]
            }
        );
    }

    /**
     * This function creates a new product in the database and returns the newly created product.
     * @param {ProductInterface} product - ProductInterface - This is the product object that we are going to
     * create.
     * @returns The product object that was created.
     */
    public async create(product: ProductInterface): Promise<ProductInterface | null> {
        return await Product.create(product);
    }

    /**
     * This function creates a new product in the database, and returns an array of products that were
     * created.
     * @param {ProductInterface} product - ProductInterface - This is the product object that you want to create.
     * @param {ClientSession} session - ClientSession
     * @returns An array of ProductInterface objects.
     */
    public async createWithSession(product: ProductInterface, session: ClientSession): Promise<ProductInterface[] | null> {
        return await Product.create([product], { session: session });
    }

    /**
     * It updates a product in the database.
     * @param {ProductInterface} product - ProductInterface - This is the product object that we are going to
     * update.
     * @returns The updated product.
     */
    public async update(product: ProductInterface): Promise<ProductInterface | null> {
        return await Product.findByIdAndUpdate(product.id, product, { new: true });
    }

    /**
     * "Update a product in the database and return the updated product."
     * 
     * The function takes two parameters:
     * 1. product: ProductInterface
     * 2. session: ClientSession
     * 
     * The function returns a Promise that resolves to an array of ProductInterface objects or null
     * @param {ProductInterface} product - ProductInterface - This is the product object that you want to update.
     * @param {ClientSession} session - ClientSession
     * @returns The updated product.
     */
    public async updateWithSession(product: ProductInterface, session: ClientSession): Promise<ProductInterface[] | null> {
        return await Product.findByIdAndUpdate(product.id, product, { new: true, session: session });
    }

    /**
     * Delete a product from the database by id.
     * @param {string} id - string - The id of the product to delete
     * @returns The result of the deleteOne() method.
     */
    public async delete(id: string) {
        return await Product.deleteOne({ _id: id });
    }
}