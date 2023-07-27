import { PaginationInterface } from "../interfaces/pagination.interface";
import { TenantInterface } from "../interfaces/tenant.interface";
import { SortDirection } from "../types/sort-direction.type";

export class PaginationUtil {

    public static GetPaginationParams(query: any, tenantId: string | TenantInterface): PaginationInterface {
        const page = +query.page!;
        const size = +query.size!;
        const sortDirection = <SortDirection>query.sortDirection!;
        const sortField = <string>query.sortField!;
        const searchTerm = <string>query.searchTerm;
        const skip = (page - 1) * size;
        const pagination: PaginationInterface = { 
            searchTerm,
            size,
            skip,
            sortField,
            sortDirection,
            tenantId
        }
        return pagination;
    }
}