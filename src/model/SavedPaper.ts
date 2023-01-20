import type { Paper } from "./Paper";
import type { Comment } from "./Comment";
import type { Tag } from "./Tag";
import type { SaveState } from "./SaveState";

// Model-class of a savedPaper
export class SavedPaper {
    readonly paper: Paper;
    readonly comment: Comment;
    readonly relevance: number;
    readonly tags: Tag[];
    readonly saveState: SaveState;

    constructor(paper: Paper, comment: Comment, relevance: number, tags: Tag[], saveState: SaveState) {
        this.paper = paper;
        this.comment = comment;
        this.relevance = relevance;
        this.tags = tags;
        this.saveState = saveState;
    }
}