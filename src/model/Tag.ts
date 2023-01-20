// Model-class of tag
export class Tag {
    readonly id: string;
    readonly name: string;
    readonly color: string;

    constructor(id: string, name: string, color: string) {
        this.id = id;
        this.name = name;
        this.color = color; 
    }
}