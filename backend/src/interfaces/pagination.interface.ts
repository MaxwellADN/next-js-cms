import { SortDirection } from "../types/sort-direction.type";
import { TenantInterface } from "./tenant.interface";

export interface PaginationInterface {
    tenantId: string | TenantInterface;
    size: number;
    skip: number;
    searchTerm: string;
    sortDirection: SortDirection;
    sortField: string;
}