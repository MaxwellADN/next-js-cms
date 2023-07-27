export interface PaginationResultInterface<T> {
    data: Data<T>;
}

export interface ResultInterface<T> {
    data: T;
}

export interface Data<T> {
    records: number;
    results: T[];
}

