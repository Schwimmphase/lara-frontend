import BasicApiHandler from "../BasicApiHandler";
import { ResearchApiCaller } from "./ResearchApiCaller";

import type { User } from "@/model/User";
import type { Comment } from "@/model/Comment";
import type { Research } from "@/model/Research";
import type { Paper } from "@/model/Paper";
import { SaveState } from "@/model/SaveState";
import type { Organizer } from "@/model/Organizer";
import { RecommendationMethod } from "@/model/RecommendationMethod";

export class ResearchApiHandler {
    public static getAllResearchesByUser(user: User) {
        ResearchApiCaller.getAllResearchesByUser(user.userId)
            .then(response => {
                let data = BasicApiHandler.tryParseJson(response.data);
            });
    }

    public static createResearch(user: User, title: string, description: Comment) { // user should be used somewhere (not in yaml)
        ResearchApiCaller.createResearch(title, description.text)
            .then(response => {
                let data = BasicApiHandler.tryParseJson(response.data);
            });
    }

    public static updateResearch(research: Research, title: string, description: Comment) {
        ResearchApiCaller.updateResearch(research.id, title, description.text)
            .then(response => {
                let data = BasicApiHandler.tryParseJson(response.data);
            });
    }

    public static deleteResearch(research: Research) {
        ResearchApiCaller.deleteResearch(research.id)
            .then(response => {
                let data = BasicApiHandler.tryParseJson(response.data);
            });
    }

    public static savePaperToResearch(research: Research, paper: Paper, saveState: SaveState) {
        ResearchApiCaller.savePaperToResearch(research.id, paper.id, SaveState[saveState])
            .then(response => {
                let data = BasicApiHandler.tryParseJson(response.data);
            });
    }

    public static removePaperFromResearch(research: Research, paper: Paper) {
        ResearchApiCaller.removePaperFromResearch(research.id, paper.id)
            .then(response => {
                let data = BasicApiHandler.tryParseJson(response.data);
            });
    }

    public static getTagsFromResearch(research: Research) {
        ResearchApiCaller.getTagsFromResearch(research.id)
            .then(response => {
                let data = BasicApiHandler.tryParseJson(response.data);
            });
    }

    public static getPapersFromResearch(research: Research, organizers: Organizer[]) {
        ResearchApiCaller.getPapersFromResearch(research.id, JSON.stringify(organizers))
            .then(response => {
                let data = BasicApiHandler.tryParseJson(response.data);
            });
    }

    public static getReferences() {
        // not defined in yaml
    }

    public static getCitations() {
        // not defined in yaml
    }

    public static getRecommendations(research: Research, recommendationMethod: RecommendationMethod) {
        ResearchApiCaller.getRecommendations(research.id, RecommendationMethod[recommendationMethod])
            .then(response => {
                let data = BasicApiHandler.tryParseJson(response.data);
            });
    }

    public static searchByKeywords(query: string, organizers: Organizer[]) {
        ResearchApiCaller.searchByKeywords(query, JSON.stringify(organizers))
            .then(response => {
                let data = BasicApiHandler.tryParseJson(response.data);
            });
    }
}
