import BasicApiCaller from "../BasicApiCaller";
import type { Organizer } from "@/model/Organizer";

export class ResearchApiCaller {
    static urlResearch = '/research';
    static urlPaper = '/paper';
    static urlTags = '/tags';
    static urlPapers = '/papers';
    static urlRecommendations = '/recommendations';
    static urlSearch = '/search';

    public static getAllResearchesByUser() {
        return BasicApiCaller.axiosInstance.get(this.urlResearch);
    }

    public static createResearch(title: string, description: string) {
        return BasicApiCaller.axiosInstance.post(this.urlResearch, {
            "title": title,
            "description": description
        });
    }

    public static updateResearch(researchId: string, title: string, description: string) {
        return BasicApiCaller.axiosInstance.patch(this.urlResearch + '/' + researchId, {
            "title": title,
            "description": description
        });
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
        });
    }

    public static removePaper(researchId: string, paperId: string) {
        return BasicApiCaller.axiosInstance.delete(this.urlResearch + '/' + researchId + this.urlPaper, {
            params: {
                "paperId": paperId
            }
        });
    }

    public static getTags(researchId: string) {
        return BasicApiCaller.axiosInstance.get(this.urlResearch + '/' + researchId + this.urlTags);
    }

    public static getPapers(researchId: string, organizers: Organizer[]) {
        return BasicApiCaller.axiosInstance.post(this.urlResearch + '/' + researchId + this.urlPapers, {
            "organizers": organizers
        });
    }

    public static getRecommendationsOrReferencesOrCitations(researchId: string, organizers: Organizer[], method: string) {
        return BasicApiCaller.axiosInstance.post(this.urlResearch + '/' + researchId + this.urlRecommendations, {
            "organizers": organizers
        }, {
            params: {
                "method": method
            }
        });
    }

    public static searchByKeywords(query: string, organizers: Organizer[]) {
        return BasicApiCaller.axiosInstance.post(this.urlResearch + this.urlSearch, {
            "organizers": organizers
        }, {
            params: {
                "query": query
            }
        });
    }
}
