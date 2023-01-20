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
        let title: string = "";
        let research = new Research(0, "", new Date(), new Comment(""), new User("", "", "", new UserCategory("", "")))
        let authors = [ new Author("", "") ];
        let year: number = 0;
        let abstract: string = "";
        let citationCount: number = 0;
        let refrenceCount: number = 0;
        let venue: string = "";
        let pdfUrl: string = "";
        let saveState = SaveState.added;
        let comment = new Comment("");
        let tags = [ new Tag("", "", "") ];

        const response = PaperApiCaller.getDetailsOfPaper(paperId)
            .then(result => {
                title = result.title;
                research = result.research;
                for (let i = 0; i < result.authors.size; i++) {
                    authors[i] = new Author(result.authors[i].id, result.authors[i].name)
                }
                year = result.year;
                abstract = result.abstract;
                citationCount = result.citationCount;
                refrenceCount = result.refrenceCount;
                venue = result.venue;
                pdfUrl = result.pdfUrl;
                saveState = result.saveState;
                comment = new Comment(result.comment);
                for (let i = 0; i < result.tags.size; i++) {
                    tags[i] = new Tag(result.tags[i].id, result.tags[i].name, result.tags[i].color);
                }
            })
            .catch(error => {
                console.log(error)
                return
            });
        
        let paper = new Paper(paperId, title, year, abstract, citationCount, refrenceCount, venue, pdfUrl, authors);

        return new SavedPaper(paper, comment, 0, tags, saveState);
    }
}
