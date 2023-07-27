import axios from 'axios';
import { UserInterface } from '../interfaces/user.interface';
import { API_URL, CONNECTED_USER } from '../constants/api.constant';
import { isTokenExpired } from '../utils/token.util';

const _axios = axios.create({ baseURL: API_URL });

/**
 * Intercept http request to the API. 
 * Add bearer authorisation in the headers in order to be authenticated
 */
_axios.interceptors.request.use((req) => {
    const connectedUser: UserInterface = JSON.parse(<string>localStorage.getItem(CONNECTED_USER));
    if (connectedUser?.token && !isTokenExpired(connectedUser?.token)) {
        req.headers.Authorization = `Bearer ${connectedUser.token}`
    } else {
        localStorage.removeItem(CONNECTED_USER);
        window.location.href = '/auth/login'
    }
    return req;
})

/**
 * Intercept http response and disconnect the connected user 
 * if the status code is equal 401
 */
_axios.interceptors.response.use((res) => {
    const connectedUser: UserInterface = JSON.parse(<string>localStorage.getItem(CONNECTED_USER));
    if (res.status === 401 && isTokenExpired(connectedUser?.token!)) {
        localStorage.removeItem(CONNECTED_USER);
        window.location.href = '/auth/login'
    }
    return res;
})

export default _axios;
