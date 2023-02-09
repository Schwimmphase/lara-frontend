import BasicApiCaller from "../BasicApiCaller";
import basicApiHandler from "../BasicApiHandler";

export class AuthApiCaller {
    static urlLogin = '/login';

    public static login(userId: string, password: string) {
        return BasicApiCaller.axiosInstance.post(this.urlLogin, {
            "userId": userId,
            "password": password
        }).catch(reason => basicApiHandler.handleError(reason));
    }
}
