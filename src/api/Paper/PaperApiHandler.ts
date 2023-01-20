import { PaperApiCaller } from "./PaperApiCaller"

import { Author } from "../../model/Author"
import { Comment } from "../../model/Comment"
import { Paper } from "../../model/Paper"
import { SavedPaper } from "../../model/SavedPaper"
import { SaveState } from "../../model/SaveState"
import { Tag } from "../../model/Tag"

/*
class SavedPaper {
    paper: Paper
    research: Research
    saveState: SaveState
    comment: Comment
    tags: Tag[]
    relevance: number

    constructor(paper: Paper, research: Research, saveState: SaveState, comment: Comment, tags: Tag[], relevance: number) {
        this.paper = paper
        this.research = research
        this.saveState = saveState
        this.comment = comment
        this.tags = tags
        this.relevance = relevance
    }
}

class Paper {
    id: string
    researchId: string
    title: string
    year: number
    abstract: string
    citationCount: number
    refrenceCount: number
    venue: string
    pdfUrl: string
    comment: string
    tags: Tag[]

    public static getPaperOfId(paperId: string): Paper {
        return {} as Paper
    }
}

class Research {
    id: string
    title: string
    started: Date
    user: User

    public static getResearchOfId(researchId: string): Research {
        return {} as Research
    }
}

interface User {
    username: string
    userId: string
    password: string
    activeResearch: string
    category: Category
}

interface Category {
    color: string
    name: string
}

interface Tag {
    id: string
    name: string
    color: string
}

interface Comment {
    text: string
}

enum SaveState {
    citation,
    reference
}
*/

class PaperApiHandler {
    public static getDetailsOfPaper(paperId: string): SavedPaper {
        let researchId: string = ""
        let title: string = ""
        let year: number = 0
        let abstract: string = ""
        let citationCount: number = 0
        let refrenceCount: number = 0
        let venue: string = ""
        let pdfUrl: string = ""
        let authors: Author[] = [ new Author("", "") ]
        let comment: Comment = new Comment("")
        let tags: Tag[] = [ new Tag("", "", "") ]


        const response = PaperApiCaller.getDetailsOfPaper(paperId)
            .then(result => {
                researchId = result.researchId
                title = result.title
                year = result.year
                abstract = result.abstract
                citationCount = result.citationCount
                refrenceCount = result.refrenceCount
                venue = result.venue
                pdfUrl = result.pdfUrl
                for (let i = 0; i < result.authors.size; i++) {
                    authors[i] = new Author(result.authors[i].id, result.authors[i].name)
                }
                comment = new Comment(result.comment)
                for (let i = 0; i < result.tags.size; i++) {
                    tags[i] = new Tag(result.tags[i].id, result.tags[i].name, result.tags[i].color)
                }
            })
            .catch(error => {
                console.log(error)
                return
            })
        
        let paper = new Paper(paperId, title, year, abstract, citationCount, refrenceCount, venue, pdfUrl, authors)

        let saveState = SaveState.added // tmp

        return new SavedPaper(paper, comment, 0, tags, saveState)
    }
}