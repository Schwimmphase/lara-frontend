import BasicApiHandler from "../BasicApiHandler";
import { ResearchApiCaller } from "./ResearchApiCaller";

import { User } from "@/model/User";
import { Comment } from "@/model/Comment";
import { Research } from "@/model/Research";
import type { Paper } from "@/model/Paper";
import { SaveState } from "@/model/SaveState";
import type { Organizer } from "@/model/Organizer";
import { RecommendationMethod } from "@/model/RecommendationMethod";
import { useResearchesStore } from "@/stores/researches";
import { UserCategory } from "@/model/UserCategory";
import { SavedPaper } from "@/model/SavedPaper";
import { plainToInstance } from "class-transformer";

export class ResearchApiHandler {
    public static getAllResearchesByUser(user: User) {
        ResearchApiCaller.getAllResearchesByUser(user.userId)
            .then(response => {
                let data = BasicApiHandler.tryParseJson(response.data.researches);
                let store = useResearchesStore();
                store.reset();
                for (let researchJSON of data) {
                    let research = new Research(researchJSON.id, researchJSON.title, new Date(researchJSON.started), new Comment(researchJSON.description), new User("", "", "", new UserCategory("", "", "")));
                    store.addResearch(research);
                }
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
        ResearchApiCaller.getPapersFromResearch(research.id, organizers)
            .then(response => {
                let data = BasicApiHandler.tryParseJson(response.data);
                /*
                let papers: SavedPaper[] = [];
                for (let savedPaperJSON of data) {
                    let paperJSON = savedPaperJSON.paper;
                    let authors: Author[] = [];
                    for (let authorJSON of paperJSON.authors) {
                        let author = new Author(authorJSON.id, authorJSON.name);
                        authors.push(author);
                    }
                    let paper = new Paper(paperJSON.id, paperJSON.title, authors, +paperJSON.year, paperJSON.abstract, +paperJSON.citationCount, +paperJSON.referenceCount, paperJSON.venue, paperJSON.pdfUrl);
                    let comment = new Comment(savedPaperJSON.comment);
                    let tags: Tag[] = [];
                    for (let tagJSON of savedPaperJSON.tags) {
                        let tag = new Tag(tagJSON.id, tagJSON.name, tagJSON.color);
                        tags.push(tag);
                    }
                    if (savedPaperJSON.saveState === SaveState.added.toString()) {
                        var saveState = SaveState.added;
                    } else if (savedPaperJSON.saveState === SaveState.enqueued.toString()) {
                        var saveState = SaveState.enqueued;
                    } else {
                        var saveState = SaveState.hidden;
                    }
                    let savedPaper = new SavedPaper(paper, research, comment, tags, +savedPaperJSON.relevance, saveState);
                    papers.push(savedPaper);
                }
                useOpenResearchStore().setResearchPapers(papers);
                console.log(useOpenResearchStore().getResearchPapers);
                */
                let savedPapers: SavedPaper[] = [];
                for (let savedPaperJSON of data.papers) {
                    let savedPaper = plainToInstance(SavedPaper.constructor(), data.papers);
                    console.log(savedPaper);
                }
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