<template>

    <v-container class="w-75 pt-8">
        <h1 class="text-h3 font-weight-bold">{{ $t('home.greetings', {username: currentUser!.username}) }}</h1>

        <div style="width: 300px">
            <NewResearchDialog :button-text="$t('home.startNewResearch')" @save="(title, description) => onCreateResearch(title, description)">
                <lara-button class="mt-8 mb-8" type="primary" @click="">{{ $t('home.startNewResearch') }}</lara-button>
            </NewResearchDialog>
        </div>

        <h2 class="text-h4 font-weight-bold">{{ $t('home.myResearches') }}</h2>

        <div class="mt-4 d-flex flex-wrap flex-row gap-8">
            <div v-for="research, index in state.researches" :key="index">
                <research-card v-if="research != null"
                               :id="research.id"
                               :title="research.title"
                               :description="research.comment.text"
                               :added="69"
                               :enqueued="420"
                               :started-at="research.startDate.toLocaleDateString()"
                               :research="research"
                               @data-change="(newTitle: string, newDescription: string) => onEditResearch(research, newTitle, newDescription)"
                               @delete="onDeleteResearch(research)"
                />
            </div>
        </div>
    </v-container>

</template>


<script setup lang="ts">

import ResearchCard from "@/components/cards/ResearchCard.vue";
import LaraButton from "@/components/basic/LaraButton.vue";
import type {Research} from "@/model/Research";
import {  } from "@/model/_testResearch";
import { useCurrentUserStore } from "@/stores/currentUser";
import { ResearchApiHandler } from "@/api/Research/ResearchApiHandler";
import { useOpenResearchStore } from "@/stores/openResearch";
import { useOpenPaperStore } from "@/stores/openPaper";
import NewResearchDialog from "@/components/dialogs/NewResearchDialog.vue";
import { Comment } from "@/model/Comment";
import { reactive } from "vue";

// reset open research/paper
useOpenResearchStore().resetStore();
useOpenPaperStore().resetStore();

let state: { researches: Research[] } = reactive({
    researches: []
});

let currentUser = useCurrentUserStore().getCurrentUser;

async function getResearches() {
    let researches = await ResearchApiHandler.getAllResearchesByUser();
    researches.forEach(research => {
        state.researches.push(research);
    });
}
getResearches();

async function onCreateResearch(title: string, description: string) {
    const research = await ResearchApiHandler.createResearch(title, new Comment(description));
    state.researches.push(research);
}

async function onEditResearch(research: Research, title: string, description: string) {
    const newResearch = await ResearchApiHandler.updateResearch(research, title, new Comment(description));
    state.researches[state.researches.indexOf(research)] = newResearch;
}

async function onDeleteResearch(research: Research) {
    await ResearchApiHandler.deleteResearch(research);
    state.researches.splice(state.researches.indexOf(research), 1);
}
</script>


<style>

</style>