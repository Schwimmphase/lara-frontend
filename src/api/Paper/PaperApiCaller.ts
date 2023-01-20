import axios from "axios"

export class PaperApiCaller {
    static baseUrl = 'api.lara.gregyyy.dev/paper/';

    public static getDetailsOfPaper(paperId: string): Promise<any> {
        return axios.get(this.baseUrl + paperId)
            .then(response => {
                return response.data
            })
            .catch(error => {
                console.log(error)
                return {}
            });
    }

    public static getRecommendationsOfPaper(paperId: string): string {
        return 'recommendations'
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
