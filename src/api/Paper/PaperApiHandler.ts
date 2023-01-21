import { PaperApiCaller } from "./PaperApiCaller"
import { Paper } from "@/model/Paper"
import type { Author } from "@/model/Author"
import { SavedPaper } from "@/model/SavedPaper"
import type { Research } from "@/model/Research"
import type { Comment } from "@/model/Comment"
import type { Tag } from "@/model/Tag"
import type { SaveState } from "@/model/SaveState"
import type { Organizer } from "@/model/Organizer"
import type { AxiosResponse } from "axios"

class PaperApiHandler {
    // old variant, yuck
    public static async getDetailsOfPaper(paperId: string): Promise<SavedPaper> {
        const response = await PaperApiCaller.getDetailsOfPaper(paperId)
            .then(res => {
                return res;
            });
               
        try {
            var json = JSON.parse(response);
        } catch(error) {
            throw new Error("Could not parse JSON string from backend: " + error);
        }

        let data = json["data"];
        if (json["status"] == "401") {
            throw new Error("User not authentificated: " + data["message"]);
        }
        if (json["status"] == "403") {
            throw new Error("Paper not found or paper does not belong to user :" + data["message"]);
        }
        
        try {
            var research = data["research"] as Research;
            var comment = data["comment"] as Comment;
            var tags = data["tags"].Children() as Tag[];
            var relevance = data["relevance"] as number;
            var saveState = data["saveState"] as SaveState;

            var title = data["title"];
            var authors = data["authors"].Children() as Author[];
            var year = data["year"] as number;
            var abstract = data["abstract"];
            var citationCount = data["citationCount"] as number;
            var referenceCount = data["referenceCount"] as number;
            var venue = data["venue"];
            var pdfUrl = data["pdfUrl"];
        } catch(error) {
            throw new Error("JSON string is of wrong format: " + error);
        }

        let paper = new Paper(paperId, title, authors, year, abstract, citationCount, referenceCount, venue, pdfUrl);

        return new SavedPaper(paper, research, comment, tags, relevance, saveState);
    }

    // new & improved variant
    public static getRecommendationsOfPaper(paper: Paper, method: string, organizers: Organizer[]): Promise<Paper[]> {
        return PaperApiCaller.getRecommendationsOfPaper(paper.id, method, organizers)
            .then(result => {
                let data = this.tryParseJSON(result);
                return this.buildRecommendations(data);
            })
            .catch(error => {
                if (error.response) {
                    throw new Error("Error in response of getRecomendationsOfPaper, http status code: " + error.response.status);
                }
                let array: Paper[] = [];
                return array;
            });
    }

    private static tryParseJSON(result: AxiosResponse<any, any>): any {
        try {
            var data = JSON.parse(JSON.stringify(result.data));
            console.log(data);
        } catch (error) {
            throw new Error("Could not parse JSON string");
        }
        return data;
    }

    private static buildRecommendations(data: any): Paper[] {
        let recommendations: Paper[] = [];

        for (let paperJSON of data) {
            try {
                var paper = JSON.parse(paperJSON);
            } catch (error) {
                console.log("Could not parse the following JSON string: ", paperJSON);
            }
            recommendations.push(paper);
        }

        return recommendations;
    }
}
