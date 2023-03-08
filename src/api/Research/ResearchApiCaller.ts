import BasicApiCaller from "../BasicApiCaller";
import type {Organizer} from "@/model/Organizer";

export class ResearchApiCaller {
    static urlResearch = '/research';
    static urlPaper = '/paper';
    static urlTags = '/tags';
    static urlPapers = '/papers';
    static urlRecommendations = '/recommendations';
    static urlSearch = '/search';

    public static getAllResearchesByUser() {
        return BasicApiCaller.axiosInstance.get(this.urlResearch)
            .catch(reason => { throw new Error(reason.response.data.message); });
    }

    public static createResearch(title: string, description: string) {
        return BasicApiCaller.axiosInstance.post(this.urlResearch, {
            "title": title,
            "description": description
        }).catch(reason => { throw new Error(reason.response.data.message); });
    }

    public static updateResearch(researchId: string, title: string, description: string) {
        return BasicApiCaller.axiosInstance.patch(this.urlResearch + '/' + researchId, {
            "title": title,
            "description": description
        }).catch(reason => { throw new Error(reason.response.data.message); });
    }

    public static deleteResearch(researchId: string) {
        return BasicApiCaller.axiosInstance.delete(this.urlResearch + '/' + researchId);
    }

    public static savePaper(researchId: string, paperId: string, saveState: string) {
        return BasicApiCaller.axiosInstance.put(this.urlResearch + '/' + researchId + this.urlPaper, {}, {
            params: {
                "paperId": paperId,
                "state": saveState
            }
        }).catch(reason => { throw new Error(reason.response.data.message); });
    }

    public static removePaper(researchId: string, paperId: string) {
        return BasicApiCaller.axiosInstance.delete(this.urlResearch + '/' + researchId + this.urlPaper, {
            params: {
                "paperId": paperId
            }
        }).catch(reason => { throw new Error(reason.response.data.message); });
    }

    public static getTags(researchId: string) {
        return BasicApiCaller.axiosInstance.get(this.urlResearch + '/' + researchId + this.urlTags)
            .catch(reason => { throw new Error(reason.response.data.message); });
    }

    public static getPapers(researchId: string, organizers: Organizer[]) {
        return BasicApiCaller.axiosInstance.post(this.urlResearch + '/' + researchId + this.urlPapers, {
            "organizers": organizers
        }).catch(reason => { throw new Error(reason.response.data.message); });
    }

    public static getRecommendationsOrReferencesOrCitations(researchId: string, organizers: Organizer[], method: string) {
        return BasicApiCaller.axiosInstance.post(this.urlResearch + '/' + researchId + this.urlRecommendations, {
            "organizers": organizers
        }, {
            params: {
                "method": method
            }
        }).catch(reason => { throw new Error(reason.response.data.message); });
    }

    public static searchByKeywords(query: string, organizers: Organizer[]) {
        return BasicApiCaller.axiosInstance.post(this.urlResearch + this.urlSearch, {
            "organizers": organizers
        }, {
            params: {
                "query": query
            }
        }).catch(reason => { throw new Error(reason.response.data.message); });
    }
}
