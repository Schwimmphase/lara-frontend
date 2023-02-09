<template>

    <v-combobox label="Tags" v-model="tagState.selectedTags" :items="tagState.selectableTags" v-model:search="tagState.searchQuery"
            @keydown.enter="onEdit(tagState.searchQuery)" :hide-no-data=false multiple chips closable-chips> <!-- TODO: why doesn't v-model accept tagState.selectedTags.map(tag => tag.name) ? -->
        <!-- Create & add new Tag -->
        <template v-slot:no-data>
            <v-list-item>
                Create <strong>{{  tagState.searchQuery }}</strong>
            </v-list-item>
        </template>
        <!-- Selectable Tags -->
        <template v-slot:item="{ index, item, props }">
            <v-chip :color="toRaw(props.title).color" @click="addTagToOpenPaper(toRaw(props.title))" @click:close="removeTagFromOpenPaper(toRaw(props.title))" small>{{ toRaw(props.title).name }}</v-chip>
            <edit-tag-dialog :tag="toRaw(props.title)" @edit="(tag, name, color) => updateTag(tag, name, color)">
                <v-icon class="ml-4 lara-clickable">mdi-pencil</v-icon>
            </edit-tag-dialog>
            <confirm-dialog @close="(decision) => deleteTag(decision, toRaw(props.title))">
                <v-icon color="red" class="ml-4 lara-clickable">mdi-trash-can</v-icon>
            </confirm-dialog>
        </template>
        <!--<template v-slot:selection="{ attrs, tag, parent, selected }">
            <v-chip v-bind="attrs" :key="JSON.stringify(tag)" :input-value="selected" :color="tag.color" @click:close="removeTagFromOpenPaper(tag)"></v-chip>
            <edit-tag-dialog @edit="(tag, name, color) => updateTag(tag, name, color)">
                <v-icon class="ml-4 lara-clickable">mdi-pencil</v-icon>
            </edit-tag-dialog>
            <confirm-dialog @close="(decision: boolean) => deleteTag(decision, tag)">
                <v-icon color="red" class="ml-4 lara-clickable">mdi-trash-can</v-icon>
            </confirm-dialog>
        </template>-->
    </v-combobox>

</template>


<script setup lang="ts">

import EditTagDialog from '../dialogs/EditTagDialog.vue';
import ConfirmDialog from '../dialogs/ConfirmDialog.vue';

import { reactive, toRaw } from 'vue';
import type { Tag } from '@/model/Tag';
import { TagApiHandler } from '@/api/Tag/TagApiHandler';
import { PaperApiHandler } from '@/api/Paper/PaperApiHandler';
import { ResearchApiHandler } from '@/api/Research/ResearchApiHandler';
import { useOpenPaperStore } from '@/stores/openPaper';
import { useOpenResearchStore } from '@/stores/openResearch';


let openResearch = useOpenResearchStore().getResearch!;
let openSavedPaper = useOpenPaperStore().getPaper!.savedPaper!;

let tagState: { selectedTags: Tag[], namesOfSelectedTags: string[], selectableTags: Tag[], namesOfSelectableTags: string[],  searchQuery: string} = reactive({
    selectedTags: [],
    namesOfSelectedTags: [], // updated automatically
    selectableTags: [],
    namesOfSelectableTags: [],
    searchQuery: ""
});

// method to get tags
async function getTags() {
    let tags = await ResearchApiHandler.getTags(openResearch);
    tagState.selectableTags = tags;
    tagState.namesOfSelectableTags = tags.map(tag => tag.name);

    tagState.selectedTags = openSavedPaper.tags;
}
getTags();

// method to globally add tag
async function addTag(name: string): Promise<void> {
    let newTag = await TagApiHandler.createTag(openResearch, name, "#474747");
    openSavedPaper.tags.push(newTag);
    getTags();

    console.debug("Added Tag", name);
}

// method to globally update tag
async function updateTag(tag: Tag, name: string, color: string): Promise<void> {
    await TagApiHandler.updateTag(tag, name, color);
    getTags(); // TODO: needed?

    console.debug("Updated Tag", name, color);
}

// method to globally delete tag
async function deleteTag(decision: boolean, tag: Tag): Promise<void> {
    console.debug(decision);

    if (!decision) return;

    await TagApiHandler.deleteTag(tag);
    getTags(); // TODO: needed?

    console.debug("Deleted Tag", tag.name);
}

async function addTagToOpenPaper(tag: any): Promise<void> {
    console.warn(tag);

    await PaperApiHandler.addTag(openSavedPaper, tag);
    getTags();

    console.debug("Added Tag", tag, "to", openSavedPaper);
}

// method to remove tag from open paper
async function removeTagFromOpenPaper(tag: Tag): Promise<void> {
    await PaperApiHandler.removeTag(openSavedPaper, tag);
    getTags(); // TODO: needed?

    console.debug("Removed Tag", tag.name, "from", openSavedPaper);
}

// watch if new Tags have been added
function onEdit(name: string) {
    const tag = tagState.selectableTags.find(tag => tag.name === name);
    if (tag) {
        console.debug("added not new tag", tag.name);
        openSavedPaper.tags.push(tag);
    } else if (name !== "") {
        addTag(name);
    }
}

</script>
