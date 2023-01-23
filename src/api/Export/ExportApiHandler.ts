import BasicApiHandler from "../BasicApiHandler";
import { ExportApiCaller } from "./ExportApiCaller";
import type { Research } from "@/model/Research";
import type { Organizer } from "@/model/Organizer";
import type { Paper } from "@/model/Paper";

export class ExportApiHandler {
    public static exportResearch(research: Research, organizers: Organizer[]) {
        ExportApiCaller.exportResearch(research.id, JSON.stringify(organizers))
            .then(response => {
                let data = BasicApiHandler.tryParseJson(response.data);
            })
    }

    public static exportPaper(paper: Paper) {
        ExportApiCaller.exportPaper(paper.id)
            .then(response => {
                let data =BasicApiHandler.tryParseJson(response.data);
            })
    }
}
