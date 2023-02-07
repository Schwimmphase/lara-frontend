import { Author } from "@/model/Author";
import { CachedPaper } from "@/model/CachedPaper";
import { Comment } from "@/model/Comment";
import { Paper } from "@/model/Paper";
import { Research } from "@/model/Research";
import { SavedPaper } from "@/model/SavedPaper";
import { Tag } from "@/model/Tag";
import { User } from "@/model/User";
import { UserCategory } from "@/model/UserCategory";
import type { AxiosResponse } from "axios";
import { plainToInstance } from "class-transformer";
import type {SaveState} from "@/model/SaveState";

// defines basic functionality used by every specific api handler
class BasicApiHandler {
    constructor() {}

    public tryParseJson(responseData: AxiosResponse<any, any>): any {
        try {
            var data = JSON.parse(JSON.stringify(responseData));
        } catch (error) {
            throw new Error("Could not parse JSON string");
        }
        return data;
    }

    public buildUser(data: string): User {
        let user = plainToInstance(User, data);
        user.userCategory = plainToInstance(UserCategory, user.userCategory);
        if (user.activeResearch != null) {
            user.activeResearch = this.buildResearch(user.activeResearch.toString());
        }
        return user;
    }
    
    public buildUserCategory(data: string): UserCategory {
        return plainToInstance(UserCategory, data);
    }

    public buildTag(data: string): Tag {
        return plainToInstance(Tag, data);
    }

    public buildResearch(data: string): Research {
        let research = plainToInstance(Research, data);
        research.comment = new Comment(research.comment.toString());
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
        savedPaper.paper = this.buildPaper(JSON.parse(JSON.stringify(savedPaper.paper)));
        savedPaper.research = this.buildResearch(JSON.parse(JSON.stringify(savedPaper.research)));
        savedPaper.comment = new Comment(savedPaper.comment.toString());
        savedPaper.saveState = savedPaper.saveState.toString().toLowerCase() as SaveState;
        let tags: Tag[] = [];
        for (let tag of savedPaper.tags) {
            tags.push(this.buildTag(tag.toString()));
        }
        savedPaper.tags = tags;
        return savedPaper;
    }

    public buildCachedPaper(data: string): CachedPaper {
        let cachedPaper = plainToInstance(CachedPaper, data);
        cachedPaper.paper = this.buildPaper(cachedPaper.paper.toString());
        cachedPaper.parentPaper = this.buildPaper(cachedPaper.parentPaper.toString());
        cachedPaper.research = this.buildResearch(cachedPaper.research.toString());
        return cachedPaper;
    }
}

export default new BasicApiHandler();
