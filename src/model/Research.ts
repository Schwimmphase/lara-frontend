import type { Comment } from "./Comment";
import type { User } from "./User";

export class Research {
    readonly id: string;
    readonly title: string;
    started: Date;
    comment: Comment;
    user: User;

    constructor(id: string, title: string, started: Date, comment: Comment, user: User) {
        this.id = id;
        this.title = title;
        this.started = started;
        this.comment = comment;
        this.user = user;
    }
}
