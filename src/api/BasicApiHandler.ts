import type { AxiosResponse } from "axios";

// defines basic functionality used by every specific api handler
class BasicApiHandler {
    constructor() {}

    public tryParseJson(responseData: AxiosResponse<any, any>): any {
        try {
            var data = JSON.parse(JSON.stringify(responseData));
        } catch (error) {
            throw new Error("Could not parse JSON string");
        }
        return data;
    }
}

export default new BasicApiHandler();
