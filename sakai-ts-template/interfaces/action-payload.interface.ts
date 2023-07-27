export interface ActionPayload<T> {
    data?: T[];
    totalRecords?: number;
    page?: number;
    pageSize?: number;
    item?: T;
}