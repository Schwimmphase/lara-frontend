import basicApiCaller from "../BasicApiCaller";
import type {Organizer} from "@/model/Organizer";

export class PaperApiCaller {
    static urlPath = '/paper/';
    static urlTag = '/tag';
    static urlComment = '/comment';
    static urlSaveState = '/save-state';
    static urlRelevance = '/relevance';
    static urlRecommendations = '/recommendations';
    static urlUserPdf = '/user-pdf';

    public static getDetails(paperId: string, researchId?: string) {
        if (researchId == null) {
            return basicApiCaller.axiosInstance.get(this.urlPath + paperId)
                .catch(reason => { throw new Error(reason.response.data.message); });
        } else {
            return basicApiCaller.axiosInstance.get(this.urlPath + paperId, {
                params: {
                    "researchId": researchId
                }
            }).catch(reason => { throw new Error(reason.response.data.message); });
        }
    }

    public static addTag(paperId: string, researchId: string, tagId: string) {
        return basicApiCaller.axiosInstance.put(this.urlPath + paperId + this.urlTag, {}, {
            params: {
                "researchId": researchId,
                "tagId": tagId
            }
        }).catch(reason => { throw new Error(reason.response.data.message); });
    }
    
    public static removeTag(paperId: string, researchId: string, tagId: string) {
        return basicApiCaller.axiosInstance.delete(this.urlPath + paperId + this.urlTag, {
            params: {
                "researchId": researchId,
                "tagId": tagId
            }
        }).catch(reason => { throw new Error(reason.response.data.message); });
    }
    
    public static changeComment(paperId: string, researchId: string, comment: string) {
        return basicApiCaller.axiosInstance.patch(this.urlPath + paperId + this.urlComment, {
                "comment": comment
            }, {
                params: {
                    "researchId": researchId
                }
            }
        ).catch(reason => { throw new Error(reason.response.data.message); });
    }

    public static changeSaveState(paperId: string, researchId: string, saveState: string) {
        return basicApiCaller.axiosInstance.put(this.urlPath + paperId + this.urlSaveState, {}, {
            params: {
                "researchId": researchId,
                "save-state": saveState
            }
        }).catch(reason => { throw new Error(reason.response.data.message); });
    }

    public static changeRelevance(paperId: string, researchId: string, relevance: number) {
        return basicApiCaller.axiosInstance.patch(this.urlPath + paperId + this.urlRelevance, {}, {
            params: {
                "researchId": researchId,
                "relevance": relevance
            }
        }).catch(reason => { throw new Error(reason.response.data.message); });
    }

    public static changeUserPdf(paperId: string, researchId: string, userPdfUrl: string) {
        return basicApiCaller.axiosInstance.put(this.urlPath + paperId + this.urlUserPdf, {}, {
                params: {
                    "researchId": researchId,
                    "url": userPdfUrl
                }
            }
        ).catch(reason => { throw new Error(reason.response.data.message); });
    }
    
    public static getRecommendationsOrReferencesOrCitations(paperId: string, method: string, organizers: Organizer[]) {
        return basicApiCaller.axiosInstance.post(this.urlPath + paperId + this.urlRecommendations, {
                "organizers": organizers
            }, {
                params: {
                    "method": method
                }
            }
        ).catch(reason => { throw new Error(reason.response.data.message); });
    }
}
