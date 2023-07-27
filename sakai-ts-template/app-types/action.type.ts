import { CREATE, DELETE, END_LOADING, GET_ALL, GET_BY_ID, PAGINATE, START_LOADING, UPDATE } from "../constants/action.constant"
import { ActionPayload } from "../interfaces/action-payload.interface";

export type Action<T> = {
    type: typeof START_LOADING | typeof END_LOADING | typeof PAGINATE | typeof GET_ALL | typeof GET_BY_ID | typeof CREATE | typeof UPDATE | typeof DELETE;
    payload?: ActionPayload<T>
}