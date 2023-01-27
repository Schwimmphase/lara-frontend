import BasicApiHandler from "../BasicApiHandler";
import { ResearchApiCaller } from "./ResearchApiCaller";

import { User } from "@/model/User";
import { Comment } from "@/model/Comment";
import { Research } from "@/model/Research";
import { Paper } from "@/model/Paper";
import { SaveState } from "@/model/SaveState";
import type { Organizer } from "@/model/Organizer";
import { RecommendationMethod } from "@/model/RecommendationMethod";
import { UserCategory } from "@/model/UserCategory";
import { SavedPaper } from "@/model/SavedPaper";
import { plainToInstance } from "class-transformer";
import { Tag } from "@/model/Tag";

export class ResearchApiHandler {
    public static async getAllResearchesByUser(user: User): Promise<unknown[]> {
        const response = await ResearchApiCaller.getAllResearchesByUser(user.userId);
        let data = BasicApiHandler.tryParseJson(response.data.researches);
        let researches: Research[] = [];
        for (let research of data) {
            researches.push(new Research(research.id, research.title, new Date(research.startDate), new Comment(research.comment), new User(user.username, user.userId,
                user.password, new UserCategory(user.userCategory.id, user.userCategory.color, user.userCategory.name))));
        }
        return researches;
    }

    public static async createResearch(user: User, title: string, description: Comment): Promise<unknown> {
        const response = await ResearchApiCaller.createResearch(user.userId, title, description.text);
        let data = BasicApiHandler.tryParseJson(response.data);
        return plainToInstance(Research.constructor(), data);
    }

    public static async updateResearch(research: Research, title: string, description: Comment): Promise<unknown> {
        const response = await ResearchApiCaller.updateResearch(research.id, title, description.text);
        let data = BasicApiHandler.tryParseJson(response.data);
        return plainToInstance(Research.constructor(), data);
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

    public static async getTags(research: Research): Promise<unknown[]> {
        const response = await ResearchApiCaller.getTags(research.id);
        let data = BasicApiHandler.tryParseJson(response.data);
        return plainToInstance(Tag, data.tags);
    }

    public static async getPapers(research: Research, organizers: Organizer[]): Promise<unknown[]> {
        const response = await ResearchApiCaller.getPapers(research.id, organizers.toString());
        let data = BasicApiHandler.tryParseJson(response.data);
        return plainToInstance(SavedPaper, data.papers);
    }

    public static async getRecommendations(research: Research, organizers: Organizer[]): Promise<unknown[]> {
        const response = await ResearchApiCaller.getRecommendationsOrReferencesOrCitations(research.id, organizers.toString(), RecommendationMethod.algorithm.toString());
        let data = BasicApiHandler.tryParseJson(response.data);
        return plainToInstance(Paper, data.recommendations);
    }

    public static async getReferences(research: Research, organizers: Organizer[]): Promise<unknown[]> {
        const response = await ResearchApiCaller.getRecommendationsOrReferencesOrCitations(research.id, organizers.toString(), RecommendationMethod.references.toString());
        let data = BasicApiHandler.tryParseJson(response.data);
        return plainToInstance(Paper, data.recommendations);
    }

    public static async getCitations(research: Research, organizers: Organizer[]): Promise<unknown[]> {
        const response = await ResearchApiCaller.getRecommendationsOrReferencesOrCitations(research.id, organizers.toString(), RecommendationMethod.citations.toString());
        let data = BasicApiHandler.tryParseJson(response.data);
        return plainToInstance(Paper, data.recommendations);
    }
    
    public static async searchByKeywords(query: string, organizers: Organizer[]): Promise<unknown[]> {
        const response = await ResearchApiCaller.searchByKeywords(query, JSON.stringify(organizers));
        let data = BasicApiHandler.tryParseJson(response.data);
        return plainToInstance(Paper, data.papers);
    }
}
