<template>

    <v-combobox :label="$t('detailSidebar.addTags')" v-model="tagState.selectedTags" :items="tagState.selectableTags" v-model:search.sync="tagState.searchQuery"
            @keydown.enter="onKeyboardEdit(tagState.searchQuery)" :hide-no-data=false multiple> <!-- TODO: update local storage on backspace or remove backspace functionality -->
        <!-- Selected Tags -->
        <template v-slot:selection="{ attrs, item, parent, selected }">
            <v-chip class="lara-chip" :color="getColor(item.title)" v-bind="attrs" :input-value="selected" closable @click:close="removeTagFromOpenPaper(item.title)">{{ item.title }}</v-chip>
        </template>
        <!-- Selectable Tags -->
        <template v-slot:item="{ index, item, props }">
            <div class="d-flex mx-4">
                <v-chip class="lara-chip" :color="toRaw(props.title).color" @click="addTagToOpenPaper(toRaw(props.title).name)">{{ toRaw(props.title).name }}</v-chip>
                <v-spacer></v-spacer>
                <v-icon class="lara-clickable" @click="{ editTagState.open = true; editTagState.tag = toRaw(props.title) }">mdi-pencil</v-icon>
                <v-icon class="ml-3 lara-clickable" @click="{ deleteTagState.open = true; deleteTagState.tag = toRaw(props.title) }" color="red">mdi-trash-can</v-icon>
            </div>
        </template>
        <!-- Create & add new Tag -->
        <template v-slot:no-data>
            <v-list-item>
                Create <strong>{{  tagState.searchQuery }}</strong>
            </v-list-item>
        </template>
    </v-combobox>

    <edit-tag-dialog v-if="editTagState.open" :tag="editTagState.tag" @edit="(name, color) => { editTagState.open = false; updateTag(editTagState.tag!, name, color) }"></edit-tag-dialog>

    <confirm-dialog v-if="deleteTagState.open" :open-on-default="true" @close="(decision) => deleteTag(decision, deleteTagState.tag!.name)"></confirm-dialog> <!-- TODO: only works once per reload -->

</template>


<script setup lang="ts">

import EditTagDialog from '../dialogs/EditTagDialog.vue';
import ConfirmDialog from '../dialogs/ConfirmDialog.vue';

import { reactive, toRaw, watch } from 'vue';
import { Tag } from '@/model/Tag';
import { TagApiHandler } from '@/api/Tag/TagApiHandler';
import { PaperApiHandler } from '@/api/Paper/PaperApiHandler';
import { ResearchApiHandler } from '@/api/Research/ResearchApiHandler';
import { useOpenResearchStore } from '@/stores/openResearch';
import type { SavedPaper } from '@/model/SavedPaper';


const props = defineProps<{ openPaper: SavedPaper }>();

watch(props.openPaper, (val, prev) => {
    useOpenResearchStore().setReserachPaper(val);
});


let tagState: { selectedTags: string[], selectableTags: Tag[], searchQuery: string} = reactive({
    selectedTags: [],
    selectableTags: [],
    searchQuery: ""
});

// state for edit tag dialog
let editTagState: { open: boolean, tag: Tag | undefined } = reactive({
    open: false,
    tag: undefined
});

// state for delete tag dialog
let deleteTagState: { open: boolean, tag: Tag | undefined } = reactive({
    open: false,
    tag: undefined
});


async function getTags() {
    // get selectable tags
    const tags = await ResearchApiHandler.getTags(useOpenResearchStore().getResearch!);
    tagState.selectableTags = tags;
    
    // get selected tags
    tagState.selectedTags = props.openPaper.tags.map(tag => tag.name); // TODO: no tags even if tags in local storage (bc prop didn't get updated on change of local storage in detailSidebarComponent?)
}
getTags();

// method to globally create tag & add to open paper
async function addTag(name: string): Promise<void> {
    const newTag = await TagApiHandler.createTag(useOpenResearchStore().getResearch!, name, "#000000");

    // update open paper of locally saved open research
    props.openPaper.tags.push(newTag);

    // update selectable & selected tags
    getTags();

    console.debug("Created Tag '" + name + "' in open research");
}

// method to globally update tag
async function updateTag(tag: Tag, name: string, color: string): Promise<void> {
    await TagApiHandler.updateTag(tag, name, color);

    // update open paper of locally saved open research
    let index = props.openPaper.tags.indexOf(tag);
    if (index !== -1) {
        let newTag = new Tag(tag.id, name, color);
        props.openPaper.tags[index] = newTag;
    }

    // update selectable & selected tags
    getTags();

    console.debug("Updated Tag '" + name + " (" + color + ") ' of open research");
}

// method to globally delete tag
async function deleteTag(decision: boolean, name: string): Promise<void> {
    if (!decision) return;

    const tag = tagState.selectableTags.find(tag => tag.name === name); // get tag of given name
    if (!tag) return;

    await TagApiHandler.deleteTag(tag);

    // update open paper of locally saved open research
    let index = props.openPaper.tags.indexOf(tag);
    if (index !== -1) {
        props.openPaper.tags.splice(index, 1);
    }

    // update selectable & selected tags
    getTags();

    console.debug("Deleted Tag '" + name + "' from open research");
}

// method to add tag to open paper
async function addTagToOpenPaper(name: string): Promise<void> {
    const tag = tagState.selectableTags.find(tag => tag.name === name); // get tag of given name
    let tagSelected = tagState.selectedTags.find(tag => tag === name); // get if tag of given name has been selected 
    if (!tag || tagSelected) return;

    await PaperApiHandler.addTag(props.openPaper, tag);

    // update open paper of locally saved open research
    props.openPaper.tags.push(tag);

    // update selectable & selected tags
    getTags();

    console.debug("Added Tag '" + name + "' to open paper");
}

// method to remove tag from open paper
async function removeTagFromOpenPaper(name: string): Promise<void> {
    const tag = tagState.selectableTags.find(tag => tag.name === name); // get tag of given name
    if (!tag) return;

    await PaperApiHandler.removeTag(props.openPaper, tag);

    // update open paper of locally saved open research
    props.openPaper.tags.splice(props.openPaper.tags.indexOf(tag), 1);

    // update selectable & selected tags
    getTags();

    console.debug("Removed Tag '" + name + "' from open paper");
}


// watch if tags have been added/removed via keyboard inputs
function onKeyboardEdit(name: string) {
    const selectedTag = tagState.selectedTags.find(tag => tag === name); // get if tag of given name was selected
    if (!selectedTag && name !== "") {
        // if tag was selected: remove tag from open paper
        props.openPaper.tags.splice(props.openPaper.tags.map(tag => tag.name).indexOf(name), 1);
        console.debug("Removed existing tag '" + name + "' from open paper");
    } else {
        // if tag was not selected: add new/existing tag to open paper 
        const selectableTag = tagState.selectableTags.find(tag => tag.name === name); // get tag of given name
        if (selectableTag) {
            // if tag does exist: add tag to open paper
            props.openPaper.tags.push(selectableTag);
            console.debug("Added existing tag '" + name + "' to open paper");
        } else if (name !== "") {
            // if tag does not exist: create tag & add to open paper
            addTag(name);
        }
    }
}

function getColor(name: string) {
    const tag = tagState.selectableTags.find(tag => tag.name === name); // get tag of given name

    return tag?.color;
}

</script>
