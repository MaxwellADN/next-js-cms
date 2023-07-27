import { RoleInterface } from "../interfaces/role.interface";
import Role from "../models/role.model";
import { RoleType } from "../types/role.type";

export class RoleService {
    
    /**
     * This function returns a single role from the database based on the id passed in.
     * @param {string} id - string - The id of the role you want to get.
     * @returns A RoleInterface or null
     */
    public async getSingle(id: string): Promise<RoleInterface | null> {
        return await Role.findById(id);
    }

    /**
     * This function returns a role by name.
     * @param {string} name - string - The name of the role you want to get.
     * @returns A RoleInterface or null
     */
    public async getByName(name: string): Promise<RoleInterface | null> {
        return await Role.findOne({ name: name })
    }

    /**
     * It creates a new role in the database.
     * @param {RoleType} role - RoleType - This is the type of the role object that is being passed in.
     * @returns The RoleInterface is being returned.
     */
    public async create(role: RoleType): Promise<RoleInterface | null> {
        return await Role.create(role);
    }
}