import { PaperApiCaller } from "./PaperApiCaller"
import { SavedPaper } from "@/model/SavedPaper"
import type { Comment } from "@/model/Comment"
import { Paper } from "@/model/Paper"
import type { SaveState } from "@/model/SaveState"
import type { Tag } from "@/model/Tag"
import type { Research } from "@/model/Research"
import type { Author } from "@/model/Author"

class PaperApiHandler {
    public static async getDetailsOfPaper(paperId: string): Promise<SavedPaper> {
        const response = await PaperApiCaller.getDetailsOfPaper(paperId)
            .then(result => {
                return result;
            });
        
        let responseSplit = response.split(","); 
        if (responseSplit.length != 13) {
            throw new Error("Did not recieve complete JSON string from backend");
        }
        
        try {
            var result = JSON.parse(response);
        } catch(error) {
            throw new Error("Could not parse JSON string from backend: " + error);
        }

        try {
            var research = result["research"] as Research;
            var comment = result["comment"] as Comment;
            var tags = result["tags"].Children() as Tag[];
            var relevance = result["relevance"] as number;
            var saveState = result["saveState"] as SaveState;

            var title = result["title"];
            var authors = result["authors"].Children() as Author[];
            var year = result["year"] as number;
            var abstract = result["abstract"];
            var citationCount = result["citationCount"] as number;
            var referenceCount = result["referenceCount"] as number;
            var venue = result["venue"];
            var pdfUrl = result["pdfUrl"];
        } catch(error) {
            throw new Error("JSON string is of wrong format: " + error);
        }

        let paper = new Paper(paperId, title, authors, year, abstract, citationCount, referenceCount, venue, pdfUrl);

        return new SavedPaper(paper, research, comment, tags, relevance, saveState);
    }
}
