import axios, {type AxiosInstance} from "axios";
import {ApiErrors, triggerGlobalError} from "@/api/ApiErrors";

// defines basic functionality used by every specific api caller
class BasicApiCaller {
    axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: 'https://api.lara.gregyyy.dev',
            timeout: 10_000, // ms
        });

        // axios interceptor for requests
        this.axiosInstance.interceptors.request.use(config => {
            if (config.url !== '/login') {
                config.headers['Authorization'] = 'Bearer ' + document.cookie.split("=")[1];
            }
            return config;
        }, error => {
            console.log("error code:", error.code);
            console.log("error message:", error.message);
            return error;
        });

        // axios interceptor for responses
        this.axiosInstance.interceptors.response.use(response => {
            return response;
        }, error => {
            if (error.response) {
                if (error.response.status == "400") {
                    console.error("False arguments of request, recieved error message:", error.response.data.message);
                    triggerGlobalError(ApiErrors.wrongInput, error.response.data.message);
                } else if (error.response.status == "401") {
                    console.error("User not authentificated");
                    triggerGlobalError(ApiErrors.notAuthenticated);
                } else if (error.response.status == "403") {
                    console.error("Access forbidden, recieved error message:", error.response.data.message);
                    triggerGlobalError(ApiErrors.notAuthorized);
                } else if (error.response.status == "500") {
                    console.error("Internal Server Error,", error.response.data.message);
                    triggerGlobalError(ApiErrors.internalServerError);
                } else {
                    console.error("Something went wrong regarding the response of an api call, responded with http status code:", error.response.status);
                    triggerGlobalError(ApiErrors.unknownError);
                }
            } else {
                console.error("Something went wrong:", error.code, ",", error.message);
                triggerGlobalError(ApiErrors.unknownError);
            }
            return Promise.reject(error);
        });
    }
}

export default new BasicApiCaller();
