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
import { CachedPaper } from "@/model/CachedPaper"

export class PaperApiHandler {
    public static async getDetails(paperId: string, researchId: string | null): Promise<unknown> {
        if (researchId == null) {
            // If the research id is null, the details of a "normal" paper should be requested
            const response = await PaperApiCaller.getDetails(paperId);
            let data = basicApiHandler.tryParseJson(response.data);
            return plainToInstance(Paper, data);
        }

        // Get the details of a SavedPaper if the research id is not null

    }

    public static async addTag(savedPaper: SavedPaper, tag: Tag): Promise<void> {
        await PaperApiCaller.addTag(savedPaper.paper.paperId, savedPaper.research.id, tag.id);
    }

    public static async removeTag(savedPaper: SavedPaper, tag: Tag): Promise<void> {
        await PaperApiCaller.removeTag(savedPaper.paper.paperId, savedPaper.research.id, tag.id);
    }

    public static async changeComment(savedPaper: SavedPaper, comment: Comment): Promise<void> {
        await PaperApiCaller.changeComment(savedPaper.paper.paperId, savedPaper.research.id, comment.text);
    }

    public static async changeSaveState(savedPaper: SavedPaper, saveState: SaveState): Promise<void> {
        await PaperApiCaller.changeSaveState(savedPaper.paper.paperId, savedPaper.research.id, SaveState[saveState]);
    }

    public static async changeRelevance(savedPaper: SavedPaper, relevance: number): Promise<void> {
        await PaperApiCaller.changeRelevance(savedPaper.paper.paperId, savedPaper.research.id, relevance);
    }

    public static async getRecommendations(paper: Paper, research: Research, organizers: Organizer[]): Promise<Paper[]> {
        const response = await PaperApiCaller.getRecommendationsOrReferencesOrCitations(paper.paperId, research.id, RecommendationMethod.algorithm.toString(), organizers)
        let data = basicApiHandler.tryParseJson(response.data);
        return plainToInstance(Paper, data);
    }

    public static async getReferences(paper: Paper, research: Research, organizers: Organizer[]): Promise<CachedPaper[]> {
        const response = await PaperApiCaller.getRecommendationsOrReferencesOrCitations(paper.paperId, research.id, RecommendationMethod.references.toString(), organizers)
        let data = basicApiHandler.tryParseJson(response.data);
        return plainToInstance(CachedPaper, data);
    }

    public static async getCitations(paper: Paper, research: Research, organizers: Organizer[]): Promise<CachedPaper[]> {
        const response = await PaperApiCaller.getRecommendationsOrReferencesOrCitations(paper.paperId, research.id, RecommendationMethod.citations.toString(), organizers)
        let data = basicApiHandler.tryParseJson(response.data);
        return plainToInstance(CachedPaper, data);
    }
}
