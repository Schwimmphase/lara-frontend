import basicApiHandler from "../BasicApiHandler"
import { PaperApiCaller } from "./PaperApiCaller"

import { Paper } from "@/model/Paper"
import { Author } from "@/model/Author"
import type { SavedPaper } from "@/model/SavedPaper"
import type { Comment } from "@/model/Comment"
import type { Tag } from "@/model/Tag"
import { SaveState } from "@/model/SaveState"
import type { Organizer } from "@/model/Organizer"
import { RecommendationMethod } from "@/model/RecommendationMethod"
import { plainToInstance } from "class-transformer"
import type { Research } from "@/model/Research"

export class PaperApiHandler {
    public static async getDetailsOfPaper(paper: Paper): Promise<unknown[]> {
        const response = await PaperApiCaller.getDetailsOfPaper(paper.id);
        let data = basicApiHandler.tryParseJson(response.data);
        return plainToInstance(Paper.constructor(), data);
    }

    public static async addTagToPaper(savedPaper: SavedPaper, tag: Tag): Promise<void> {
        await PaperApiCaller.addTagToPaper(savedPaper.paper.id, savedPaper.research.id, tag.id);
    }

    public static async removeTagFromPaper(savedPaper: SavedPaper, tag: Tag): Promise<void> {
        await PaperApiCaller.removeTagFromPaper(savedPaper.paper.id, savedPaper.research.id, tag.id);
    }

    public static async changeComment(savedPaper: SavedPaper, comment: Comment): Promise<void> {
        await PaperApiCaller.changeComment(savedPaper.paper.id, savedPaper.research.id, comment.text);
    }

    public static async changeSaveState(savedPaper: SavedPaper, saveState: SaveState): Promise<void> {
        await PaperApiCaller.changeSaveState(savedPaper.paper.id, savedPaper.research.id, SaveState[saveState]);
    }

    public static async changeRelevance(savedPaper: SavedPaper, relevance: number): Promise<void> {
        await PaperApiCaller.changeRelevance(savedPaper.paper.id, savedPaper.research.id, relevance);
    }

    public static async getRecommendationsOfPaper(paper: Paper, research: Research, method: RecommendationMethod, organizers: Organizer[]): Promise<Paper[]> {
        const response = await PaperApiCaller.getRecommendationsOfPaper(paper.id, research.id, RecommendationMethod[method], organizers)
        let data = basicApiHandler.tryParseJson(response.data);
        return plainToInstance(Paper.constructor(), data);
    }

    public static getReferencesOfPaper(paper: Paper) {
        return // not defined in yaml
    }

    public static getCitationsOfPaper(paper: Paper) {
        return // not defined in yaml
    }
}
