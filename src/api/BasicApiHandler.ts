import { Author } from "@/model/Author";
import { CachedPaper } from "@/model/CachedPaper";
import type { CachedPaperType } from "@/model/CachedPaperType";
import { Comment } from "@/model/Comment";
import type { Paper } from "@/model/Paper";
import type { Research } from "@/model/Research";
import { SaveState } from "@/model/SaveState";
import type { SavedPaper } from "@/model/SavedPaper";
import { Tag } from "@/model/Tag";
import { User } from "@/model/User";
import { UserCategory } from "@/model/UserCategory";
import { testPaper, testResearch, testSavedPaper1 } from "@/model/_testResearch";
import type { AxiosResponse } from "axios";
import { plainToInstance } from "class-transformer";

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
    
    public buildComment(data: string): Comment {
        return plainToInstance(Comment, data);
    }

    public buildTag(data: string): Tag {
        return plainToInstance(Tag, data);
    }

    public buildResearch(data: string): Research {
        let research = testResearch; // TODO: replace this line by the commented line below once the backend people have updated their api response according to the yml definition
        //let research = plainToInstance(Research, data); // TODO: check if research.started was translated correctly
        research.comment = this.buildComment(research.comment.toString());
        //research.user = this.buildUser(research.user.toString()); // TODO: uncomment once the backend people have updated their api response according to the yml definition
        return research;
    }
    
    public buildPaper(data: string): Paper {
        let paper = testPaper; // TODO: replace this line by the commented line below once the backend people have updated their api response according to the yml definition
        //let paper = plainToInstance(Paper, data);
        let authors: Author[] = [];
        for (let author of paper.author) {
            authors.push(plainToInstance(Author, author));
        }
        paper.author = authors;
        return paper;
    }

    public buildSavedPaper(data: string): SavedPaper {
        let savedPaper = testSavedPaper1; // TODO: replace this line by the commented line below once the backend people have updated their api response according to the yml definition
        //let savedPaper = plainToInstance(SavedPaper, data);
        savedPaper.paper = this.buildPaper(savedPaper.paper.toString());
        savedPaper.research = this.buildResearch(savedPaper.research.toString());
        savedPaper.comment = this.buildComment(savedPaper.comment.toString());
        let tags: Tag[] = [];
        for (let tag of savedPaper.tags) {
            tags.push(this.buildTag(tag.toString()));
        }
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
