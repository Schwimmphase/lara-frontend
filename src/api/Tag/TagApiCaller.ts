import BasicApiCaller from "../BasicApiCaller";

export class TagApiCaller {
    static urlTag = '/tag';

    public static createTag(researchId: string, name: string, color: string) {
        return BasicApiCaller.axiosInstance.post(this.urlTag, {
            "name": name,
            "color": color
        }, {
            params: {
                "researchId": researchId
            }
        }).catch(reason => { throw new Error(reason.response.data.message); });
    }

    public static updateTag(id: string, name: string, color: string) {
        return BasicApiCaller.axiosInstance.patch(this.urlTag + '/' + id, {
            "name": name,
            "color": color
        }).catch(reason => { throw new Error(reason.response.data.message); });
    }

    public static deleteTag(id: string) {
        return BasicApiCaller.axiosInstance.delete(this.urlTag + '/' + id)
            .catch(reason => { throw new Error(reason.response.data.message); });
    }
}
