import { Dispatch } from "redux";
import { PaginationInterface } from "../interfaces/pagination.interface";
import { Action } from "../app-types/action.type";
import { PostInterface } from "../interfaces/post.interface";
import { CREATE, DELETE, END_LOADING, GET_BY_ID, PAGINATE, START_LOADING, UPDATE } from "../constants/action.constant";
import postService from "../services/post.service";
import { NextRouter } from "next/router";

export const paginate = (pagination: PaginationInterface) => async (dispatch: Dispatch<Action<PostInterface>>) => {
    try {
        dispatch({ type: START_LOADING });
        const response = await postService.paginate(pagination);
        dispatch({
            type: PAGINATE,
            payload: {
                data: response.data.results,
                totalRecords: response.data.records,
                page: pagination.page,
                pageSize: pagination.pageSize
            }
        });
        dispatch({ type: END_LOADING });
    } catch (error) {
        console.log(error)
    }
}

export const getPost =  (id: string) => async(dispatch: Dispatch<Action<PostInterface>>) => {
    try {
        dispatch({ type: START_LOADING });
        const response = await postService.get(id);
        dispatch({
            type: GET_BY_ID,
            payload: {
                item: response.data
            }
        })
        dispatch({ type: END_LOADING });
    } catch (error) {
        console.log(error)
    }
}

export const createPost = (post: PostInterface, router: NextRouter, toast: any) => async (dispatch: Dispatch<Action<PostInterface>>) => {
    try {
        dispatch({ type: START_LOADING });
        const data = await postService.create(post);
        dispatch({
            type: CREATE,
            payload: { item: data }
        });
        toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'The post has been successfully created !',
            life: 3000, // Display the toast message for 3 seconds
        });
        router.push(`/posts/post-list`);
    } catch (error) {
        console.log(error);
        toast.current?.show({
            severity: 'error',
            summary: 'Error Message',
            detail: 'An error occurred. Please try again.',
            life: 3000, // Display the toast message for 3 seconds
        });
    }
};

export const updatePost = (id: string, post: PostInterface, toast: any) => async (dispatch: Dispatch<Action<PostInterface>>) => {
    try {
        dispatch({ type: START_LOADING });
        const data = await postService.update(id, post);
        dispatch({
            type: UPDATE,
            payload: { item: data }
        });
        dispatch({ type: END_LOADING });
        toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'The post has been successfully updated !',
            life: 3000, // Display the toast message for 3 seconds
        });
        if (post.publish) {
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'The post has been successfully published !',
                life: 3000, // Display the toast message for 3 seconds
            });
        }
        if (post.unpublish) {
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'The post has been successfully unpublished !',
                life: 3000, // Display the toast message for 3 seconds
            });
        }
    } catch (error) {
        console.log(error);
        toast.current?.show({
            severity: 'error',
            summary: 'Error Message',
            detail: 'An error occurred. Please try again.',
            life: 3000, // Display the toast message for 3 seconds
        });
    }
};

export const deletePost = (id: string, toast: any) => async (dispatch: Dispatch<Action<PostInterface>>) => {
    try {
        const data = await postService.delete(id);
        dispatch({
            type: DELETE,
            payload: { item: data }
        });
        toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'The post has been successfully deleted !',
            life: 3000, // Display the toast message for 3 seconds
        });
    } catch (error) {
        console.log(error);
        toast.current?.show({
            severity: 'error',
            summary: 'Error Message',
            detail: 'An error occurred. Please try again.',
            life: 3000, // Display the toast message for 3 seconds
        });
    }
};