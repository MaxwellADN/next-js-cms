import { ClientSession } from "mongoose";
import { TenantInterface } from "../interfaces/tenant.interface";
import Tenant from "../models/tenant.model";
import { TenantType } from "../types/tenant.type";

export class TenantService {

    /**
     * It returns a promise that resolves to a TenantInterface or null
     * @param {string} id - string - The id of the tenant you want to get.
     * @returns A promise of a TenantInterface or null.
     */
    public async getSingle(id: string): Promise<TenantInterface | null> {
        return await Tenant.findById(id);
    }
    
    /**
     * This function creates a new tenant in the database and returns the newly created tenant.
     * @param {TenantType} tenant - TenantType - this is the type of the tenant object that is being
     * passed in.
     * @returns TenantInterface | null
     */
    public async create(tenant: TenantType): Promise<TenantInterface | null> {
        return await Tenant.create(tenant);
    }

    /**
     * This function creates a new tenant in the database, and returns an array of tenants that were
     * created.
     * @param {TenantType} tenant - TenantType - This is the tenant object that you want to create.
     * @param {ClientSession} session - ClientSession
     * @returns An array of TenantInterface objects.
     */
    public async createWithSession(tenant: TenantType, session: ClientSession): Promise<TenantInterface[] | null> {
        return await Tenant.create([tenant], {session: session });
    }

    /**
     * It updates a tenant in the database.
     * @param {TenantType} tenant - TenantType - This is the tenant object that we are going to
     * update.
     * @returns The updated tenant.
     */
    public async update(tenant: TenantInterface): Promise<TenantInterface | null> {
        return await Tenant.findByIdAndUpdate(tenant.id, tenant, { new: true });
    }

    /**
     * "Update a tenant in the database and return the updated tenant."
     * 
     * The function takes two parameters:
     * 1. tenant: TenantInterface
     * 2. session: ClientSession
     * 
     * The function returns a Promise that resolves to an array of TenantInterface objects or null
     * @param {TenantInterface} tenant - TenantInterface - This is the tenant object that you want to update.
     * @param {ClientSession} session - ClientSession
     * @returns The updated tenant.
     */
    public async updateWithSession(tenant: TenantInterface, session: ClientSession): Promise<TenantInterface[] | null> {
        return await Tenant.findByIdAndUpdate(tenant.id, tenant, { new: true, session: session });
    }

    /**
     * Delete a tenant from the database by id.
     * @param {string} id - string - The id of the tenant to delete
     * @returns The result of the deleteOne() method.
     */
    public async delete(id: string) {
        return await Tenant.deleteOne({ _id: id });
    }
}