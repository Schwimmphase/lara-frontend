<template>

    <v-combobox label="Tags" v-model="tagState.namesOfSelectedTags" :items="tagState.namesOfSelectableTags" v-model:search="tagState.search" :hide-no-data=false multiple chips closable-chips outlined autocomplete>
        <!-- Create & add new Tag -->
        <template v-slot:no-data>
            <v-list-item>
                <v-list-item-tile>Create <strong>{{  tagState.search }}</strong></v-list-item-tile>
            </v-list-item>
        </template>
        <!-- Selectable Tags -->
        <template v-slot:selection="data">
            <v-chip v-bind="data.attrs" :key="JSON.stringify(data.item)" :input-value="data.selected" :color="data.item.color" @click:close="deleteTag(data)"></v-chip>
            <edit-tag-dialog @edit="(tag, name, color) => updateTag(tag, name, color)">
                <v-icon class="ml-4 lara-clickable">mdi-pencil</v-icon>
            </edit-tag-dialog>
        </template>
    </v-combobox>

</template>


<script setup lang="ts">

import { reactive, watch } from 'vue';
import type { Tag } from '@/model/Tag';
import { TagApiHandler } from '@/api/Tag/TagApiHandler';
import { ResearchApiHandler } from '@/api/Research/ResearchApiHandler';
import { useOpenResearchStore } from '@/stores/openResearch';
import EditTagDialog from '../dialogs/EditTagDialog.vue';
import { testTag1 } from '@/model/_testResearch';

let openResearch = useOpenResearchStore().getResearch!;

let tagState: { selectedTags: Tag[], namesOfSelectedTags: string[], selectableTags: Tag[], namesOfSelectableTags: string[],  search: string} = reactive({
    selectedTags: [testTag1],
    namesOfSelectedTags: [testTag1.name],
    selectableTags: [],
    namesOfSelectableTags: [],
    search: ""
});
let tags = await ResearchApiHandler.getTags(openResearch);
tagState.selectableTags = tags;
tags.forEach(tag => tagState.namesOfSelectableTags.push(tag.name));

async function addTag(name: string): Promise<void> {
    console.debug("Added Tag:", name);
    tagState.selectableTags.push(await TagApiHandler.createTag(openResearch, name, "#474747"));
}

async function updateTag(tag: Tag, name: string, color: string): Promise<void> {
    console.debug("Updated Tag", tag + ':', name, color);
    await TagApiHandler.updateTag(tag, name, color);
}

async function deleteTag(tag: Tag): Promise<void> {
    await TagApiHandler.deleteTag(tag);
}

watch(tagState, (val, prev) => {
    let newTags = val.selectedTags.filter(tag => !val.selectableTags.includes(tag));
    newTags.forEach(newTag => addTag(newTag.name));
});

</script>
