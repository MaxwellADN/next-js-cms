import { SortDirection } from "../app-types/sort-direction.type";
import { TenantInterface } from "./tenant.interface";

export interface PaginationInterface {
    page: number;
    pageSize: number;
    searchTerm: string;
    sortDirection: SortDirection;
    sortField: string;
}