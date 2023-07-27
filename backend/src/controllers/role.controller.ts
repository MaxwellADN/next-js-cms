import { POST, route } from "awilix-express";
import { RoleService } from "../services/role.service";
import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "../enums/http-status-code.enum";

@route('/role')
export class RoleController {

    /**
     * The constructor function is a special function that is called when a new instance of the class
     * is created. 
     * 
     * The constructor function is used to initialize the instance members of the class. 
     * 
     * The constructor function can also use the dependencies to initialize the instance members of
     * @param {RoleService} roleService - This is the service that we created earlier.
     */
    constructor(private readonly roleService: RoleService) { }

    @POST()
    public async create(req: Request, res: Response) {
        try {
            const role = await this.roleService.create(req.body);
            return res.status(HttpStatusCodeEnum.CREATED).json(role);
        } catch (error) {
            console.log(error);
            return res.status(HttpStatusCodeEnum.BAD_REQUEST).send({ message: error })
        }
    }
}