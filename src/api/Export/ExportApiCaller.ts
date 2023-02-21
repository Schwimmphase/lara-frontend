import BasicApiCaller from "../BasicApiCaller";
import type {Organizer} from "@/model/Organizer";

export class ExportApiCaller {
    static urlExport = '/export';
    static urlResearch = '/research/';
    static urlPaper = '/paper/';

    public static exportResearch(researchId: string, organizers: Organizer[]) {
        return BasicApiCaller.axiosInstance.post(this.urlExport + this.urlResearch + researchId, {
            "organizers": organizers
        }).catch(reason => { throw new Error(reason.response.data.message); });
    }

    public static exportPaper(paperId: string) {
        return BasicApiCaller.axiosInstance.get(this.urlExport + this.urlPaper + paperId)
            .catch(reason => { throw new Error(reason.response.data.message); });
    }
}
