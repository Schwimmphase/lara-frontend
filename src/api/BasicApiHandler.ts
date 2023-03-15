import {Author} from "@/model/Author";
import {CachedPaper} from "@/model/CachedPaper";
import {Paper} from "@/model/Paper";
import {Research} from "@/model/Research";
import {SavedPaper} from "@/model/SavedPaper";
import type {Tag} from "@/model/Tag";
import {User} from "@/model/User";
import {UserCategory} from "@/model/UserCategory";
import type {AxiosResponse} from "axios";
import {plainToInstance} from "class-transformer";
import type {SaveState} from "@/model/SaveState";
import {ApiErrors, triggerGlobalError} from "@/api/ApiErrors";

// defines basic functionality used by every specific api handler
class BasicApiHandler {
    constructor() {}

    public tryParseJson(responseData: any): any {
        let data = undefined;
        try {
            data = JSON.parse(JSON.stringify(responseData));
        } catch (error) {
            triggerGlobalError(ApiErrors.couldNotParseData);
            throw new Error("Could not parse JSON string");
        }
        return data;
    }

    public buildUser(data: string): User {
        let user = plainToInstance(User, data);
        user.userCategory = plainToInstance(UserCategory, user.userCategory);
        if (user.activeResearch != null) {
            user.activeResearch = this.buildResearch(this.tryParseJson(user.activeResearch));
        }
        return user;
    }
    
    public buildUserCategory(data: string): UserCategory {
        return plainToInstance(UserCategory, data);
    }

    public buildResearch(data: string): Research {
        let research = plainToInstance(Research, data);
        research.startDate = new Date(research.startDate);
        return research;
    }
    
    public buildPaper(data: string): Paper {
        let paper = plainToInstance(Paper, data);
        let authors: Author[] = [];
        for (let author of paper.authors) {
            authors.push(plainToInstance(Author, author));
        }
        paper.authors = authors;
        return paper;
    }

    public buildSavedPaper(data: string): SavedPaper {
        let savedPaper = plainToInstance(SavedPaper, data);
        savedPaper.paper = this.buildPaper(this.tryParseJson(savedPaper.paper));
        savedPaper.research = this.buildResearch(this.tryParseJson(savedPaper.research));
        savedPaper.saveState = savedPaper.saveState.toString().toLowerCase() as SaveState;
        let tags: Tag[] = [];
        for (let tag of savedPaper.tags) {
            tags.push(new Tag(tag.id, tag.name, tag.color));
        }
        savedPaper.tags = tags;
        return savedPaper;
    }

    public buildCachedPaper(data: string): CachedPaper {
        let cachedPaper = plainToInstance(CachedPaper, data);
        cachedPaper.paper = this.buildPaper(this.tryParseJson(cachedPaper.paper));
        cachedPaper.parentPaper = this.buildPaper(this.tryParseJson(cachedPaper.parentPaper));
        cachedPaper.research = this.buildResearch(this.tryParseJson(cachedPaper.research));
        return cachedPaper;
    }

    public handleError(reason: any) {
        console.error(reason.name + ',', reason.message);
    }
}

export default new BasicApiHandler();
