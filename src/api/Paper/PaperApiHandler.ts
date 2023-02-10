import basicApiHandler from "../BasicApiHandler"
import { PaperApiCaller } from "./PaperApiCaller"

import type { Paper } from "@/model/Paper"
import type { SavedPaper } from "@/model/SavedPaper"
import type { Tag } from "@/model/Tag"
import { SaveState } from "@/model/SaveState"
import type { Organizer } from "@/model/Organizer"
import { RecommendationMethod } from "@/model/RecommendationMethod"
import type { Research } from "@/model/Research"
import BasicApiHandler from "../BasicApiHandler"
import { ResearchApiHandler } from "../Research/ResearchApiHandler"

export class PaperApiHandler {
    public static async getDetails(paperId: string, researchId: string | null): Promise<unknown> {
        if (researchId == null) {
            // If the research id is null, the details of a "normal" paper should be requested
            const response = await PaperApiCaller.getDetails(paperId);
            let data = basicApiHandler.tryParseJson(response.data);
            return BasicApiHandler.buildPaper(data);
        } else {
            // Get the details of a SavedPaper if the research id is not null
            const response = await PaperApiCaller.getDetails(paperId, researchId);
            let data = basicApiHandler.tryParseJson(response.data);
            return BasicApiHandler.buildSavedPaper(data);
        }
    }

    public static async addTag(savedPaper: SavedPaper, tag: Tag): Promise<void> {
        await PaperApiCaller.addTag(savedPaper.paper.paperId, savedPaper.research.id, tag.id);
    }

    public static async removeTag(savedPaper: SavedPaper, tag: Tag): Promise<void> {
        console.log("before api:", await ResearchApiHandler.getTags(savedPaper.research));
        await PaperApiCaller.removeTag(savedPaper.paper.paperId, savedPaper.research.id, tag.id);
        console.log("after api:", await ResearchApiHandler.getTags(savedPaper.research));
    }

    public static async changeComment(savedPaper: SavedPaper, comment: string): Promise<void> {
        await PaperApiCaller.changeComment(savedPaper.paper.paperId, savedPaper.research.id, comment);
    }

    public static async changeSaveState(savedPaper: SavedPaper, saveState: SaveState): Promise<void> {
        await PaperApiCaller.changeSaveState(savedPaper.paper.paperId, savedPaper.research.id, SaveState[saveState]);
    }

    public static async changeRelevance(savedPaper: SavedPaper, relevance: number): Promise<void> {
        await PaperApiCaller.changeRelevance(savedPaper.paper.paperId, savedPaper.research.id, relevance);
    }

    public static async getRecommendations(paper: Paper, research: Research, organizers: Organizer[]): Promise<Paper[]> {
        const response = await PaperApiCaller.getRecommendationsOrReferencesOrCitations(paper.paperId, research.id, RecommendationMethod.algorithm, organizers)
        let data = basicApiHandler.tryParseJson(response.data);
        let recommendations: Paper[] = [];
        for (let recommendation of data.recommendations) {
            recommendations.push(BasicApiHandler.buildPaper(recommendation));
        }
        return recommendations;
    }

    public static async getReferences(paper: Paper, research: Research, organizers: Organizer[]): Promise<Paper[]> {
        const response = await PaperApiCaller.getRecommendationsOrReferencesOrCitations(paper.paperId, research.id, RecommendationMethod.references, organizers)
        let data = basicApiHandler.tryParseJson(response.data);
        let references: Paper[] = [];
        for (let reference of data.recommendations) {
            references.push(BasicApiHandler.buildPaper(reference));
        }
        return references;
    }

    public static async getCitations(paper: Paper, research: Research, organizers: Organizer[]): Promise<Paper[]> {
        const response = await PaperApiCaller.getRecommendationsOrReferencesOrCitations(paper.paperId, research.id, RecommendationMethod.citations, organizers)
        let data = basicApiHandler.tryParseJson(response.data);
        let citations: Paper[] = [];
        for (let citation of data.recommendations) {
            citations.push(BasicApiHandler.buildPaper(citation));
        }
        return citations;
    }
}
