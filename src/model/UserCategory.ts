export class UserCategory {
    readonly id: string;
    readonly color: string;
    readonly name: string;

    constructor(id: string, color: string, name: string) {
        this.id = id;
        this.color = color;
        this.name = name;
    }

    toString() {
        return "{" + this.id + "," + this.color + "," + this.name + "}";
    }
}
