import BasicApiHandler from "../BasicApiHandler";
import { ResearchApiCaller } from "./ResearchApiCaller";

import type { Research } from "@/model/Research";
import type { Paper } from "@/model/Paper";
import { SaveState } from "@/model/SaveState";
import type { Organizer } from "@/model/Organizer";
import { RecommendationMethod } from "@/model/RecommendationMethod";
import type { SavedPaper } from "@/model/SavedPaper";
import type { Tag } from "@/model/Tag";
import basicApiHandler from "@/api/BasicApiHandler";

export class ResearchApiHandler {
    public static async getAllResearchesByUser(): Promise<Research[]> {
        const response = await ResearchApiCaller.getAllResearchesByUser();
        let data = BasicApiHandler.tryParseJson(response.data);
        let researches: Research[] = [];
        for (let research of data.researches) {
            research = BasicApiHandler.buildResearch(research);
            researches.push(research);
        }
        return researches;
    }

    public static async createResearch(title: string, description: string): Promise<Research> {
        const response = await ResearchApiCaller.createResearch(title, description);
        let data = BasicApiHandler.tryParseJson(response.data);
        return BasicApiHandler.buildResearch(data);
    }

    public static async updateResearch(research: Research, title: string, description: string): Promise<Research> {
        const response = await ResearchApiCaller.updateResearch(research.id, title, description);
        let data = BasicApiHandler.tryParseJson(response.data);
        return BasicApiHandler.buildResearch(data);
    }

    public static async deleteResearch(research: Research): Promise<void> {
        await ResearchApiCaller.deleteResearch(research.id);
    }

    public static async savePaper(research: Research, paper: Paper, saveState: SaveState): Promise<void> {
        await ResearchApiCaller.savePaper(research.id, paper.paperId, SaveState[saveState]);
    }

    public static async removePaper(research: Research, paper: Paper): Promise<void> {
        await ResearchApiCaller.removePaper(research.id, paper.paperId);
    }

    public static async getTags(research: Research): Promise<Tag[]> {
        const response = await ResearchApiCaller.getTags(research.id);
        let data = BasicApiHandler.tryParseJson(response.data);
        let tags: Tag[] = [];
        for (let tag of data.tags) {
            tags.push(tag as Tag);
        }
        return tags;
    }

    public static async getSavedPapers(research: Research, organizers: Organizer[]): Promise<SavedPaper[]> {
        const response = await ResearchApiCaller.getPapers(research.id, organizers);
        let data = BasicApiHandler.tryParseJson(response.data);
        let savedPapers: SavedPaper[] = [];
        for (let savedPaper of data.papers) {
            savedPapers.push(BasicApiHandler.buildSavedPaper(savedPaper));
        }
        return savedPapers;
    }

    public static async getRecommendations(research: Research, organizers: Organizer[]): Promise<Paper[]> {
        const response = await ResearchApiCaller.getRecommendationsOrReferencesOrCitations(research.id, organizers, RecommendationMethod.algorithm);
        let data = BasicApiHandler.tryParseJson(response.data);
        let recommendations: Paper[] = [];
        for (let recommendation of data.recommendations) {
            recommendations.push(BasicApiHandler.buildPaper(recommendation));
        }
        return recommendations;
    }

    public static async getReferences(research: Research, organizers: Organizer[]): Promise<Paper[]> {
        const response = await ResearchApiCaller.getRecommendationsOrReferencesOrCitations(research.id, organizers, RecommendationMethod.references);
        let data = basicApiHandler.tryParseJson(response.data);
        let references: Paper[] = [];
        for (let reference of data.recommendations) {
            references.push(BasicApiHandler.buildPaper(reference));
        }
        return references;
    }

    public static async getCitations(research: Research, organizers: Organizer[]): Promise<Paper[]> {
        const response = await ResearchApiCaller.getRecommendationsOrReferencesOrCitations(research.id, organizers, RecommendationMethod.citations);
        let data = basicApiHandler.tryParseJson(response.data);
        let citations: Paper[] = [];
        for (let citation of data.recommendations) {
            citations.push(BasicApiHandler.buildPaper(citation));
        }
        return citations;
    }
    
    public static async searchByKeywords(query: string, organizers: Organizer[]): Promise<Paper[]> {
        const response = await ResearchApiCaller.searchByKeywords(query, organizers);
        let data = BasicApiHandler.tryParseJson(response.data);
        let papers: Paper[] = [];
        for (let paper of data.papers) {
            papers.push(BasicApiHandler.buildPaper(paper));
        }
        return papers;
    }
}
