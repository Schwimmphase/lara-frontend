import BasicApiHandler from "../BasicApiHandler";
import { TagApiCaller } from "./TagApiCaller";

import type { Research } from "@/model/Research";
import type { Tag } from "@/model/Tag";

export class TagApiHandler {
    public static async createTag(research: Research, name: string, color: string): Promise<Tag> {
        const response = await TagApiCaller.createTag(research.id, name, color);
        let data = BasicApiHandler.tryParseJson(response.data);
        return BasicApiHandler.buildTag(data);
    }

    public static async updateTag(tag: Tag, name: string, color: string): Promise<Tag> {
        const response = await TagApiCaller.updateTag(tag.id, name, color)
        let data = BasicApiHandler.tryParseJson(response.data);
        return BasicApiHandler.buildTag(data);
    }

    public static async deleteTag(tag: Tag): Promise<void> {
        await TagApiCaller.deleteTag(tag.id);
    }
}