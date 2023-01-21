import type { Organizer } from "@/model/Organizer";
import axios from "axios"

export class PaperApiCaller {
    static baseUrl = 'api.lara.gregyyy.dev/paper/';

    // old variant, yuck
    public static async getDetailsOfPaper(paperId: string): Promise<string> {
        return await axios.get(this.baseUrl + paperId)
            .then(response => {
                return JSON.stringify(response);
            })
            .catch(error => {
                console.log(error);
                return '{}';
            });
    }

    // new & improved variant
    public static getRecommendationsOfPaper(paperId: string, method: string, organizers: Organizer[]) { // input parameters "method", "organizers" needed
        let organizersJSON = JSON.stringify(organizers);
        return axios.get(this.baseUrl + paperId, {
            params: {
                method: method
            },
            data : {
                organizers: organizersJSON
            }
        });
    }

    public static getReferencesOfPaper(paperId: string): string {
        return 'references'
    }

    public static getCitationsOfPaper(paperId: string): string {
        return 'citations'
    }

    public static addTagToPaper(paperId: string, tagId: string): string {
        return 'tag added'
    }

    public static removeTagFromPaper(paperId: string, tagId: string): string {
        return 'tag removed'
    }

    public static changeComment(comment: string): string {  // fehlt hier nicht paperId ?
        return 'comment changed'
    }

    public static changeSaveState(paperId: string, saveState: string): string {
        return 'save state changed'
    }

    public static changeRelevance(paperId: string, relevance: number): string {
        return 'relevance changed'
    }
}
