import type { Paper } from "@/model/Paper";
import type { SavedPaper } from "@/model/SavedPaper";

export class OpenPaper {
    readonly paper: Paper | null;
    readonly savedPaper: SavedPaper | null;
    readonly saved: boolean;

    constructor(paper: Paper | null, savedPaper: SavedPaper | null, saved: boolean) {
        this.paper = paper;
        this.savedPaper = savedPaper;
        this.saved = saved;
    }
}