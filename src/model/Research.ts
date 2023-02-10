import type { User } from "./User";

export class Research {
    readonly id: string;
    readonly title: string;
    startDate: Date;
    comment: string;

    constructor(id: string, title: string, startDate: Date, comment: string, user: User) {
        this.id = id;
        this.title = title;
        this.startDate = startDate;
        this.comment = comment;
    }
}
