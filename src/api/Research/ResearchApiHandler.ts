import BasicApiHandler from "../BasicApiHandler";
import { ResearchApiCaller } from "./ResearchApiCaller";

import type { User } from "@/model/User";
import type { Comment } from "@/model/Comment";
import type { Research } from "@/model/Research";
import type { Paper } from "@/model/Paper";
import { SaveState } from "@/model/SaveState";
import type { Organizer } from "@/model/Organizer";
import { RecommendationMethod } from "@/model/RecommendationMethod";
import type { SavedPaper } from "@/model/SavedPaper";
import type { Tag } from "@/model/Tag";
import type { CachedPaper } from "@/model/CachedPaper";

export class ResearchApiHandler {
    public static async getAllResearchesByUser(user: User): Promise<Research[]> {
        const response = await ResearchApiCaller.getAllResearchesByUser(user.userId);
        let data = BasicApiHandler.tryParseJson(response.data.researches);
        let researches: Research[] = [];
        for (let research of data.researches) {
            researches.push(BasicApiHandler.buildResearch(research));
        }
        return researches;
    }

    public static async createResearch(user: User, title: string, description: Comment): Promise<Research> {
        const response = await ResearchApiCaller.createResearch(user.userId, title, description.text);
        let data = BasicApiHandler.tryParseJson(response.data);
        return BasicApiHandler.buildResearch(data);
    }

    public static async updateResearch(research: Research, title: string, description: Comment): Promise<Research> {
        const response = await ResearchApiCaller.updateResearch(research.id, title, description.text);
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
            tags.push(BasicApiHandler.buildTag(tag));
        }
        return tags;
    }

    public static async getSavedPapers(research: Research, organizers: Organizer[]): Promise<SavedPaper[]> {
        const response = await ResearchApiCaller.getPapers(research.id, organizers.toString());
        let data = BasicApiHandler.tryParseJson(response.data);
        let savedPapers: SavedPaper[] = [];
        for (let savedPaper of data.savedPapers) {
            savedPapers.push(BasicApiHandler.buildSavedPaper(savedPaper));
        }
        return savedPapers;
    }

    public static async getRecommendations(research: Research, organizers: Organizer[]): Promise<Paper[]> {
        const response = await ResearchApiCaller.getRecommendationsOrReferencesOrCitations(research.id, organizers.toString(), RecommendationMethod.algorithm.toString());
        let data = BasicApiHandler.tryParseJson(response.data);
        let recommendations: Paper[] = [];
        for (let recommendation of data.recommendations) {
            recommendations.push(BasicApiHandler.buildPaper(recommendation));
        }
        return recommendations;
    }

    public static async getReferences(research: Research, organizers: Organizer[]): Promise<CachedPaper[]> {
        const response = await ResearchApiCaller.getRecommendationsOrReferencesOrCitations(research.id, organizers.toString(), RecommendationMethod.references.toString());
        let data = BasicApiHandler.tryParseJson(response.data);
        let references: CachedPaper[] = [];
        for (let reference of data.recommendations) {
            references.push(BasicApiHandler.buildCachedPaper(reference));
        }
        return references;
    }

    public static async getCitations(research: Research, organizers: Organizer[]): Promise<CachedPaper[]> {
        const response = await ResearchApiCaller.getRecommendationsOrReferencesOrCitations(research.id, organizers.toString(), RecommendationMethod.citations.toString());
        let data = BasicApiHandler.tryParseJson(response.data);
        let citations: CachedPaper[] = [];
        for (let citation of data.recommendations) {
            citations.push(BasicApiHandler.buildCachedPaper(citation));
        }
        return citations;
    }
    
    public static async searchByKeywords(query: string, organizers: Organizer[]): Promise<Paper[]> {
        const response = await ResearchApiCaller.searchByKeywords(query, JSON.stringify(organizers));
        let data = BasicApiHandler.tryParseJson(response.data);
        let papers: Paper[] = [];
        for (let paper of data.papers) {
            papers.push(BasicApiHandler.buildPaper(paper));
        }
        return papers;
    }
}
