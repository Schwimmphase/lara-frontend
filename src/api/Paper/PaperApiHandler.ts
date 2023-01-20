import { PaperApiCaller } from "./PaperApiCaller"
import { Author } from "../../model/Author"
import { Comment } from "../../model/Comment"
import { Paper } from "../../model/Paper"
import { SavedPaper } from "../../model/SavedPaper"
import { SaveState } from "../../model/SaveState"
import { Tag } from "../../model/Tag"
import { Research } from "../../model/Research"
import { User } from "@/model/User"
import { UserCategory } from "@/model/UserCategory"

class PaperApiHandler {
    public static getDetailsOfPaper(paperId: string): SavedPaper {
        let title = "";
        let research = new Research(0, "", new Date(), new Comment(""), new User("", "", "", new UserCategory("", "")))
        let authors = [ new Author("", "") ];
        let year = 0;
        let abstract = "";
        let citationCount = 0;
        let refrenceCount = 0;
        let venue = "";
        let pdfUrl = "";
        let comment = new Comment("");
        let tags = [ new Tag("", "", "") ];
        let relevance = 0;
        let saveState = SaveState.added;

        const response = PaperApiCaller.getDetailsOfPaper(paperId)
            .then(result => {
                title = result.title;
                research = new Research(result.research, "", new Date(), new Comment(""), new User("", "", "", new UserCategory("", "")));
                for (let i = 0; i < result.authors.size; i++) {
                    authors[i] = new Author(result.authors[i].id, result.authors[i].name)
                }
                year = result.year;
                abstract = result.abstract;
                citationCount = result.citationCount;
                refrenceCount = result.refrenceCount;
                venue = result.venue;
                pdfUrl = result.pdfUrl;
                comment = new Comment(result.comment);
                for (let i = 0; i < result.tags.size; i++) {
                    tags[i] = new Tag(result.tags[i].id, result.tags[i].name, result.tags[i].color);
                }
                relevance = result.relevance;
                saveState = result.saveState;
            })
            .catch(error => {
                console.log(error)
                return
            });
        
        let paper = new Paper(paperId, title, year, abstract, citationCount, refrenceCount, venue, pdfUrl, authors);

        return new SavedPaper(paper, research, comment, tags, relevance, saveState);
    }
}
