import BasicApiCaller from "../BasicApiCaller";

export class TagApiCaller {
    static urlTag = '/tag/';

    public static createTag(researchId: string, name: string, color: string) {
        return BasicApiCaller.axiosInstance.post(this.urlTag, {
            params: {
                "researchId": researchId
            },
            data: {
                "name": name,
                "color": color
            }
        });
    }

    public static updateTag(id: string, name: string, color: string) {
        return BasicApiCaller.axiosInstance.patch(this.urlTag + id, {
            data: {
                "name": name,
                "color": color
            }
        });
    }

    public static deleteTag(id: string) {
        return BasicApiCaller.axiosInstance.delete(this.urlTag + id);
    }
}
