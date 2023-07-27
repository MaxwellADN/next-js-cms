import axios from "axios";
import { UserInterface } from "../interfaces/user.interface";
import { API_URL, CONNECTED_USER } from "../constants/api.constant";

class AuthService {
    private url: string =  API_URL+'/auth';

    /**
     * Call the API and log the user 
     * @param user 
     * @returns 
     */
    public login(user: UserInterface) {
        return axios.post(this.url+"/login", user);
    }

    /**
     * This function sends a POST request to the server to register a user.
     * @param {UserInterface} user 
     * @returns
     */
    public register(user: UserInterface) {
        return axios.post(this.url+'/register', user);
    }

    /**
     * The function removes the connected user from local storage.
     */
    public logout() {
        localStorage.removeItem(CONNECTED_USER);
    }

    public passwordRecoveryLink(user: UserInterface) {
        return axios.post(this.url+'/account-recovery', user);
    }

}
var authService = new AuthService();
export default authService;