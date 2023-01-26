import type { Organizer } from "@/model/Organizer";
import BasicApiCaller from "../BasicApiCaller";

export class ResearchApiCaller {
    static urlResearch = '/research/';
    static urlPaper = '/paper';
    static urlTags = '/tags';
    static urlPapers = '/papers';
    static urlRecommendations = '/recommendations';
    static urlSearch = '/search';

    public static getAllResearchesByUser(userId: string) { // needs user id? where?
        return BasicApiCaller.axiosInstance.get(this.urlResearch);
    }

    public static createResearch(title: string, description: string) {
        return BasicApiCaller.axiosInstance.post(this.urlResearch, {
            "title": title,
            "description": description
        });
    }

    public static updateResearch(researchId: string, title: string, description: string) {
        return BasicApiCaller.axiosInstance.patch(this.urlResearch + researchId, {
            "title": title,
            "description": description
        });
    }

    public static deleteResearch(researchId: string) {
        return BasicApiCaller.axiosInstance.delete(this.urlResearch + researchId);
    }

    public static savePaperToResearch(researchId: string, paperId: string, saveState: string) {
        return BasicApiCaller.axiosInstance.put(this.urlResearch + researchId + this.urlPaper, {}, {
            params: {
                "paperId": paperId,
                "state": saveState
            }
        });
    }

    public static removePaperFromResearch(researchId: string, paperId: string) {
        return BasicApiCaller.axiosInstance.delete(this.urlResearch + researchId + this.urlPaper, {
            params: {
                "paperId": paperId
            }
        });
    }

    public static getTagsFromResearch(researchId: string) {
        return BasicApiCaller.axiosInstance.delete(this.urlResearch + researchId + this.urlTags);
    }

    public static getPapersFromResearch(researchId: string, organizers: Organizer[]) {
        return BasicApiCaller.axiosInstance.post(this.urlResearch + researchId + this.urlPapers, {
            "organizers": organizers
        });
    }

    public static getReferences() {
        // not defined in yaml
    }

    public static getCitations() {
        // not defined in yaml
    }

    public static getRecommendations(researchId: string, method: string) {
        return BasicApiCaller.axiosInstance.post(this.urlResearch + researchId + this.urlRecommendations, {}, {
            params: {
                "method": method
            }
        });
    }

    public static searchByKeywords(query: string, organizerList: string) {
        return BasicApiCaller.axiosInstance.post(this.urlResearch + this.urlSearch, {
                "organizers": organizerList
            }, {
                params: {
                    "query": query
                }
            }
        );
    }
}
