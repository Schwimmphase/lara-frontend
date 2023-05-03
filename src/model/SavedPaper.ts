import type { Paper } from "./Paper";
import type { Tag } from "./Tag";
import type { SaveState } from "./SaveState";
import type { Research } from "./Research";

// Model-class of a savedPaper
export class SavedPaper {
    paper: Paper;
    research: Research;
    comment: string;
    tags: Tag[];
    relevance: number;
    userPdfUrl: string;
    saveState: SaveState;

    constructor(paper: Paper, research: Research, comment: string, tags: Tag[], relevance: number, userPdfUrl: string,
                saveState: SaveState) {
        this.paper = paper;
        this.research = research;
        this.comment = comment;
        this.tags = tags;
        this.relevance = relevance;
        this.userPdfUrl = userPdfUrl;
        this.saveState = saveState;
    }
}
