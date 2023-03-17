<template>
    <v-container class="w-75 pt-8" id="home-view">
        <h1 class="text-h3 font-weight-bold" id="user-greeting">{{ $t('home.greetings', {username: currentUser!.username}) }}</h1>

        <div style="width: 300px">
            <NewResearchDialog :button-text="$t('home.startNewResearch')" @save="(title, description) => onCreateResearch(title, description)">
                <lara-button class="mt-8 mb-8" type="primary" id="new-research-button">{{ $t('home.startNewResearch') }}</lara-button>
            </NewResearchDialog>
        </div>

        <h2 class="text-h4 font-weight-bold" id="home-title">{{ $t('home.myResearches') }}</h2>

        <div class="mt-4 d-flex flex-wrap flex-row gap-8">
            <div v-for="research, index in state.researches" :key="index">
                <research-card v-if="research != null"
                               :id="research.id"
                               :title="research.title"
                               :description="research.comment"
                               :added="69"
                               :enqueued="420"
                               :started-at="research.startDate.toLocaleDateString()"
                               :research="research"
                               @data-change="(newTitle: string, newDescription: string) => onUpdateResearch(research, newTitle, newDescription)"
                               @delete="onDeleteResearch(research)"
                />
            </div>
        </div>
    </v-container>
</template>


<script setup lang="ts">

import type {Research} from "@/model/Research";

import ResearchCard from "@/components/cards/ResearchCard.vue";
import LaraButton from "@/components/basic/LaraButton.vue";
import NewResearchDialog from "@/components/dialogs/NewResearchDialog.vue";

import { useCurrentUserStore } from "@/stores/currentUser";
import { ResearchApiHandler } from "@/api/Research/ResearchApiHandler";
import { useOpenResearchStore } from "@/stores/openResearch";
import { useOpenPaperStore } from "@/stores/openPaper";
import { reactive } from "vue";
import {i18n} from "@/internationalization/i18n";

document.title = i18n.global.t("pageTitles.home") + " - lara";

// Reset open research/paper, in Home view there is no open Paper / open Research
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

async function onCreateResearch(title: string, description: string) {
    const research = await ResearchApiHandler.createResearch(title, description);
    state.researches.push(research);
}

async function onUpdateResearch(research: Research, title: string, description: string) {
    const newResearch = await ResearchApiHandler.updateResearch(research, title, description);
    state.researches[state.researches.indexOf(research)] = newResearch;
}

async function onDeleteResearch(research: Research) {
    await ResearchApiHandler.deleteResearch(research);
    state.researches.splice(state.researches.indexOf(research), 1);
}

getResearches();

</script>


<style>

</style>