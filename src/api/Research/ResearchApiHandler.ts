import BasicApiHandler from "../BasicApiHandler";
import { ResearchApiCaller } from "./ResearchApiCaller";

import { User } from "@/model/User";
import { Comment } from "@/model/Comment";
import { Research } from "@/model/Research";
import { Paper } from "@/model/Paper";
import { SaveState } from "@/model/SaveState";
import type { Organizer } from "@/model/Organizer";
import { RecommendationMethod } from "@/model/RecommendationMethod";
import { SavedPaper } from "@/model/SavedPaper";
import { plainToInstance } from "class-transformer";
import { Tag } from "@/model/Tag";
import { UserCategory } from "@/model/UserCategory";

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

    public static async createResearch(user: User, title: string, description: Comment): Promise<unknown[]> { // user should be used somewhere (not defined in yaml)
        const response = await ResearchApiCaller.createResearch(title, description.text);
        let data = BasicApiHandler.tryParseJson(response.data);
        return plainToInstance(Research.constructor(), data);
    }

    public static async updateResearch(research: Research, title: string, description: Comment): Promise<unknown[]> {
        const response = await ResearchApiCaller.updateResearch(research.id, title, description.text);
        let data = BasicApiHandler.tryParseJson(response.data);
        return plainToInstance(Research.constructor(), data);
    }

    public static deleteResearch(research: Research) {
        ResearchApiCaller.deleteResearch(research.id)
            .then(response => {
                let data = BasicApiHandler.tryParseJson(response.data);
            });
    }

    public static async savePaperToResearch(research: Research, paper: Paper, saveState: SaveState): Promise<void> {
        await ResearchApiCaller.savePaperToResearch(research.id, paper.id, SaveState[saveState]);
    }

    public static async removePaperFromResearch(research: Research, paper: Paper): Promise<void> {
        await ResearchApiCaller.removePaperFromResearch(research.id, paper.id);
    }

    public static async getTagsFromResearch(research: Research): Promise<unknown[]> {
        const response = await ResearchApiCaller.getTagsFromResearch(research.id);
        let data = BasicApiHandler.tryParseJson(response.data);
        return plainToInstance(Tag.constructor(), data.tags);
    }

    public static async getPapersFromResearch(research: Research, organizers: Organizer[]): Promise<unknown[]> {
        const response = await ResearchApiCaller.getPapersFromResearch(research.id, organizers.toString());
        let data = BasicApiHandler.tryParseJson(response.data);
        return plainToInstance(SavedPaper.constructor(), data.papers);
    }

    public static getReferences() {
        // not defined in yaml
    }

    public static getCitations() {
        // not defined in yaml
    }

    public static async getRecommendations(research: Research, recommendationMethod: RecommendationMethod): Promise<unknown[]> {
        const response = await ResearchApiCaller.getRecommendations(research.id, RecommendationMethod[recommendationMethod]);
        let data = BasicApiHandler.tryParseJson(response.data);
        return plainToInstance(Paper.constructor(), data.recommendations);
    }

    public static async searchByKeywords(query: string, organizers: Organizer[]): Promise<unknown[]> {
        const response = await ResearchApiCaller.searchByKeywords(query, JSON.stringify(organizers));
        let data = BasicApiHandler.tryParseJson(response.data);
        return plainToInstance(Paper.constructor(), data.papers);
    }
}
