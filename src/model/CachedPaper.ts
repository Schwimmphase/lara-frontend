import type { Paper } from "./Paper";
import type { Research } from "./Research";
import type { CachedPaperType } from "./CachedPaperType";

// Model-class of a cachedPaper
export class CachedPaper {
    paper: Paper;
    parentPaper: Paper;
    research: Research;
    type: CachedPaperType;

    constructor(paper: Paper, parentPaper: Paper, research: Research, type: CachedPaperType) {
        this.paper = paper;
        this.parentPaper = parentPaper;
        this.research = research;
        this.type = type;
    }
}
