import axios, { type AxiosInstance, type AxiosResponse } from "axios";

// defines basic functionality used by every specific api caller
class BasicApiCaller {
    axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: 'https://2fa9806c-0984-4cb0-b381-e5fd2e3b013a.mock.pstmn.io/', // mocked server via postman
            timeout: 3000,
            headers: {
                "x-mock-response-code": 200 // mocked http response
            }
        });

        // axios interceptor for requests
        this.axiosInstance.interceptors.request.use(config => {
            console.log("request url: ", config.baseURL, config.url);
            console.log("request params: ", Object.keys(config.data.params)[0] + ": " + config.data.params.method); // only for param "method"
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
                if (error.response.status == "401") {
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
