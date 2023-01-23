import BasicApiCaller from "../BasicApiCaller";

export class AuthApiCaller {
    static urlLogin = '/login';

    public static login(userId: string, password: string) {
        return BasicApiCaller.axiosInstance.post(this.urlLogin, {
            "userId": userId,
            "password": password
        });
    }
}
