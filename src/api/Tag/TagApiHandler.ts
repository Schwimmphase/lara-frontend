import { plainToInstance } from "class-transformer";
import BasicApiHandler from "../BasicApiHandler";
import { TagApiCaller } from "./TagApiCaller";

import type { Research } from "@/model/Research";
import { Tag } from "@/model/Tag";

export class TagApiHandler {
    public static async createTag(research: Research, name: string, color: string) {
        const response = await TagApiCaller.createTag(research.id, name, color);
        let data = BasicApiHandler.tryParseJson(response.data);
        return plainToInstance(Tag.constructor(), data);
    }

    public static updateTag(tag: Tag, name: string, color: string) {
        TagApiCaller.updateTag(tag.id, name, color)
            .then(response => {
                    let data = BasicApiHandler.tryParseJson(response.data);
            });
    }

    public static deleteTag(tag: Tag) {
        TagApiCaller.deleteTag(tag.id)
            .then(response => {
                let data = BasicApiHandler.tryParseJson(response.data);
            });
    }
}