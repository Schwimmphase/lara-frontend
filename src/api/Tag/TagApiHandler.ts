import BasicApiHandler from "../BasicApiHandler";
import { TagApiCaller } from "./TagApiCaller";

import type { Research } from "@/model/Research";
import type { Tag } from "@/model/Tag";

export class TagApiHandler {
    public static createTag(research: Research, name: string, color: string) {
        TagApiCaller.createTag(research.id, name, color)
            .then(response => {
                let data = BasicApiHandler.tryParseJson(response.data);
            });
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