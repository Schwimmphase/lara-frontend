import type { Paper } from "@/model/Paper";
import type { SavedPaper } from "@/model/SavedPaper";

export class OpenPaper {
    readonly paper: Paper | undefined;
    readonly savedPaper: SavedPaper | undefined;
    readonly saved: boolean;

    constructor(paper: Paper | undefined, savedPaper: SavedPaper | undefined, saved: boolean) {
        this.paper = paper;
        this.savedPaper = savedPaper;
        this.saved = saved;
    }

    getPaper(): Paper | undefined {
        return this.saved ? this.savedPaper?.paper : this.paper;
    }

    getPdfUrl(): string | undefined {
        if (this.saved && this.savedPaper?.userPdfUrl != undefined) {
            return this.savedPaper?.userPdfUrl;
        } else {
            return this.getPaper()?.pdfUrl;
        }
    }

}