import axios, { type AxiosInstance, type AxiosResponse } from "axios";

// defines basic functionality used by every specific api caller
class BasicApiCaller {
    axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: 'https://api.lara.gregyyy.dev',
            timeout: 10000, // ms
            headers: {
                Authorization: document.cookie
            }
        });

        // axios interceptor for requests
        this.axiosInstance.interceptors.request.use(config => {
            console.log("request url: ", config.baseURL, config.url);
            console.log("request method: ", config.method);
            return config;
        }, error => {
            console.log("error code: ", error.code);
            console.log("error message: ", error.message);
            return error;
        });

        // axios interceptor for responses
        this.axiosInstance.interceptors.response.use(response => {
            console.log("response status: ", response.status);
            return response;
        }, error => {
            console.log("error code: ", error.code);
            console.log("error message: ", error.message);

            if (error.response) {
                if (error.response.status == "400") {
                    throw new Error("False arguments of request, recieved error message: " + error.response.message);
                } else if (error.response.status == "401") {
                    throw new Error("User not authentificated, recieved error message: " + error.response.message);
                } else if (error.response.status == "403") {
                    throw new Error("Access forbidden, recieved error message: " + error.response.message);
                } else {
                    console.log(error.toJSON());
                    throw new Error("Something went wrong regarding the response of an api call, responded with http status code: "
                        + error.response.status);
                }
            } else {
                throw new Error("Something went wrong: " + error.code + ", " + error.message);
            }
        });
    }
}

export default new BasicApiCaller();
