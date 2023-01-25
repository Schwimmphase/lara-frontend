<template>
    <v-container class="w-75 pt-8">
        <h1 class="text-h3 font-weight-bold">Hallo {{ currentUser.username }}!</h1>

        <div style="width: 300px">
            <lara-button class="mt-8 mb-8" type="primary">Neue Recherche starten</lara-button>
        </div>

        <h2 class="text-h4 font-weight-bold">Meine Recherchen</h2>

        <div class="mt-4 d-flex flex-wrap flex-row gap-8">
            <div v-for="research in researches">
                <research-card v-if="research != null"
                               :id="research.id"
                               :title="research.title"
                               :description="research.comment.text"
                               :added="69"
                               :enqueued="420"
                               :started-at="research.started.toLocaleDateString()"
                               @data-change="(newTitle: String, newDescription: String) => onEdited(research, newTitle, newDescription)"
                />
            </div>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import ResearchCard from "@/components/cards/ResearchCard.vue";
import LaraButton from "@/components/basic/LaraButton.vue";
import type {Research} from "@/model/Research";
import { useResearchesStore } from "@/stores/researches";
import { ResearchApiHandler } from "@/api/Research/ResearchApiHandler";
import { useCurrentUserStore } from "@/stores/currentUser.js";

function onEdited(research: Research, title: String, description: String) {
    console.debug("New name and title for research: ");
    console.debug(research);
    console.debug("Title: " + title + " - description: " + description);
}

let currentUser = useCurrentUserStore().getCurrentUser;
ResearchApiHandler.getAllResearchesByUser(currentUser);
let researches = useResearchesStore().getResearches;
</script>

<style>

</style>