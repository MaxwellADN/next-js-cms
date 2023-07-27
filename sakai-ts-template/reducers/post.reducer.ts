import { Action } from "../app-types/action.type";
import { CREATE, DELETE, END_LOADING, GET_ALL, GET_BY_ID, PAGINATE, START_LOADING, UPDATE } from "../constants/action.constant";
import { PostStateInterface } from "../interfaces/post-state.interface";
import { PostInterface } from "../interfaces/post.interface";

const initialState: PostStateInterface = {
    loading: true,
    posts: [],
    page: 1,
    pageSize: 10,
    totalRecords: 0
}

const postReducer = (state: PostStateInterface = initialState, action: Action<PostInterface>): PostStateInterface => {
    switch (action.type) {
        case START_LOADING:
            return { ...state, loading: true }
        case END_LOADING:
            return { ...state, loading: false }
        case GET_ALL:
            return { ...state, posts: action.payload?.data! }
        case GET_BY_ID:
            return { ...state, item: action.payload?.item }
        case PAGINATE:
            return {
                ...state,
                totalRecords: action.payload?.totalRecords!,
                posts: action.payload?.data!,
                page: action.payload?.page!,
                pageSize: action.payload?.pageSize!
              };
        case CREATE:
            return { ...state, item: action.payload?.item }
        case UPDATE:
            return { ...state, item: action.payload?.item }
        case DELETE:
            return { ...state, item: action.payload?.item }
        default:
            return state;
    }
};

export default postReducer;

