import type { Research } from "./Research";
import type { UserCategory } from "./UserCategory";

export class User {
    username: string;
    readonly userId: string;
    password: string;
    activeResearch?: Research;
    userCategory: UserCategory;

	constructor(username: string, userId: string, password: string, userCategory: UserCategory) {
        this.username = username;
        this.userId = userId;
        this.password = password;
        this.userCategory = userCategory;
	}
}
