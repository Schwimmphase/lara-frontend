import type { Research } from "./Research";
import type { UserCategory } from "./UserCategory";

export class User {
    readonly username: string;
    readonly userId: string;
    readonly password: string;
    readonly activeResearch?: Research;
    readonly userCategory: UserCategory;

	constructor(username: string, userId: string, password: string, userCategory: UserCategory) {
        this.username = username;
        this.userId = userId;
        this.password = password;
        this.userCategory = userCategory;
	}
}
