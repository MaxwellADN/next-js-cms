import { ClientSession } from "mongoose";
import { UserInterface } from "../interfaces/user.interface";
import User from "../models/user.model";

export class UserService {

    /**
     * It returns a promise that resolves to a UserInterface or null
     * @param {string} id - string - The id of the user you want to get.
     * @returns A promise of a UserInterface or null.
     */
    public async getSingle(id: string): Promise<UserInterface | null> {
        return await User.findById(id).populate('role').exec();
    }

    /**
     * This function takes an email address as a parameter and returns a user object if the email
     * address exists in the database, otherwise it returns null.
     * @param {string} email - string - The email of the user you want to find.
     * @returns A promise of a UserInterface or null.
     */
    public async getSingleByEmail(email: string): Promise<UserInterface | null> {
        return await User.findOne({ email: email }).populate('role').exec();
    }

    /**
     * This function returns an array of UserInterface objects, or null, based on the tenantId
     * parameter.
     * @param {string} tenantId - string - The tenantId is a string that is passed in from the
     * controller.
     * @returns An array of UserInterface objects or null.
     */
    public async getAllByTenant(tenantId: string): Promise<UserInterface[] | null> {
        return await User.find({ tenant: tenantId }).populate('role').exec();
    }

    /**
     * This function creates a new user in the database and returns the newly created user.
     * @param {UserInterface} user - UserInterface - This is the user object that we are going to
     * create.
     * @returns The user object that was created.
     */
    public async create(user: UserInterface): Promise<UserInterface | null> {
        return await User.create(user);
    }

    /**
     * This function creates a new user in the database, and returns an array of users that were
     * created.
     * @param {UserInterface} user - UserInterface - This is the user object that you want to create.
     * @param {ClientSession} session - ClientSession
     * @returns An array of UserInterface objects.
     */
    public async createWithSession(user: UserInterface, session: ClientSession): Promise<UserInterface[] | null> {
        return await User.create([user], { session: session });
    }

    /**
     * It updates a user in the database.
     * @param {UserInterface} user - UserInterface - This is the user object that we are going to
     * update.
     * @returns The updated user.
     */
    public async update(user: UserInterface): Promise<UserInterface | null> {
        return await User.findByIdAndUpdate(user.id, user, { new: true });
    }

    /**
     * "Update a user in the database and return the updated user."
     * 
     * The function takes two parameters:
     * 1. user: UserInterface
     * 2. session: ClientSession
     * 
     * The function returns a Promise that resolves to an array of UserInterface objects or null
     * @param {UserInterface} user - UserInterface - This is the user object that you want to update.
     * @param {ClientSession} session - ClientSession
     * @returns The updated user.
     */
    public async updateWithSession(user: UserInterface, session: ClientSession): Promise<UserInterface[] | null> {
        return await User.findByIdAndUpdate(user.id, user, { new: true, session: session });
    }

    /**
     * Delete a user from the database by id.
     * @param {string} id - string - The id of the user to delete
     * @returns The result of the deleteOne() method.
     */
    public async delete(id: string) {
        return await User.deleteOne({ _id: id });
    }
}