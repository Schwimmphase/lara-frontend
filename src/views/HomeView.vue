<template>

    <v-container class="w-75 pt-8">
        <h1 class="text-h3 font-weight-bold">{{ $t('home.greetings', {username: currentUser!.username}) }}</h1>

        <div style="width: 300px">
            <NewResearchDialog :button-text="$t('home.startNewResearch')" @save="(title, description) => newResearchCreated(title, description)">
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
                               @data-change="(newTitle: String, newDescription: String) => onEdited(research, newTitle, newDescription)"
                               @delete="deleteResearch(research)"
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

let researches: Research[] = []
let currentUser = useCurrentUserStore().getCurrentUser;
async function getResearches() {
    // get username & researches of user
    researches = await ResearchApiHandler.getAllResearchesByUser();
    researches.forEach(research => {
        //useResearchesStore().addResearch(research);
        state.researches.push(research);
        console.log(research.comment)
    });
    //let researches = useResearchesStore().getResearches;
}
getResearches();

async function newResearchCreated(title: string, description: string) {
    const research = await ResearchApiHandler.createResearch(title, new Comment(description));
    state.researches.push(research);
    //useResearchesStore().addResearch(research);
    //researches = useResearchesStore().getResearches;
}

function onEdited(research: Research, title: String, description: String) {
    console.debug("New name and title for research: ");
    console.debug(research);
    console.debug("Title: " + title + " - description: " + description);
}

async function deleteResearch(research: Research) {
    await ResearchApiHandler.deleteResearch(research);
    state.researches.splice(state.researches.indexOf(research), 1);
}
</script>


<style>

</style>