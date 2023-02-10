import BasicApiCaller from "../BasicApiCaller";
import basicApiHandler from "../BasicApiHandler";

export class AuthApiCaller {
    static urlLogin = '/login';

    public static login(username: string, password: string) {
        return BasicApiCaller.axiosInstance.post(this.urlLogin, {
            "username": username,
            "password": password
        }).catch(reason => basicApiHandler.handleError(reason));
    }
}
