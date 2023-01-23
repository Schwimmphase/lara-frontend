<template>
    <v-container class="w-75 pt-8">
        <h1 class="text-h3 font-weight-bold">Hallo Sebastian!</h1>

        <div style="width: 300px">
            <lara-button class="mt-8 mb-8" type="primary">Neue Recherche starten</lara-button>
        </div>

        <h2 class="text-h4 font-weight-bold">Meine Recherchen</h2>

        <div class="mt-4 d-flex flex-wrap flex-row gap-8">
            <div v-for="research in researches">
                <research-card v-if="research != null"
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
import {useResearchStore} from "@/stores/research";
import {testResearch, testSavedPaperList} from "@/model/_testResearch";

function onEdited(research: Research, title: String, description: String) {
    console.debug("New name and title for research: ");
    console.debug(research);
    console.debug("Title: " + title + " - description: " + description);
}

// Pinia store for the research
const store = useResearchStore();

// TODO Nur zu Testzwecken drin... sobald die Research Papers gesetzt werden, kann das wieder weg
store.setOpenResearch(testResearch, testSavedPaperList);

// Get the research from the store
let research1: Research | null = store.getResearch;

let researches = [research1, research1, research1, research1];
</script>

<style>

</style>