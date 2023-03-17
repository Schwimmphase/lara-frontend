<template>

    <v-combobox :placeholder="tagState.selectedTags.length === 0 ? $t('detailSidebar.addTags') : ''" multiple
                :hide-no-data=false v-model="tagState.selectedTags" v-model:search.sync="tagState.searchQuery"
                :items="tagState.selectableTags" @keydown.enter="multiplexOnKeyboardAction(tagState.searchQuery)">
        <!-- Selected Tags -->
        <template v-slot:selection="{ attrs, item, parent, selected }">
            <v-chip class="lara-chip" :color="getColor(item.title)" v-bind="attrs" :input-value="selected" closable
                    @click:close="removeTagFromOpenPaper(item.title)"
                    @keydown.delete="">{{ item.title }}</v-chip>
        </template>
        <!-- Selectable Tags -->
        <template v-slot:item="{ index, item, props }">
            <div class="d-flex mx-4 my-2">
                <v-chip class="lara-chip" :color="props.title.color" @click="multiplexOnMouseAction(props.title.name)">
                    {{ props.title.name }}
                </v-chip>
                <v-spacer></v-spacer>
                <v-icon class="lara-clickable" :title="$t('words.edit')"
                        @click="clickOnEdit(toRaw(props.title))">
                    mdi-pencil
                </v-icon>
                <v-icon class="ml-3 lara-clickable" :title="$t('words.delete')" color="red"
                        @click="clickOnDelete(toRaw(props).title)">
                    mdi-trash-can
                </v-icon>
            </div>
        </template>
        <!-- Create & add new Tag -->
        <template v-slot:no-data>
            <v-list-item>
                {{ $t('detailSidebar.createTag', { name: tagState.searchQuery }) }}
            </v-list-item>
        </template>
    </v-combobox>

    <edit-tag-dialog v-if="editTagState.open" :tag="editTagState.tag" @edit="(name, color) => {
        updateTagOfResearch(editTagState.tag!, name, color);
        editTagState.open = false;
        editTagState.tag = undefined; }">
    </edit-tag-dialog>
    <v-snackbar v-model="editTagState.invalidEdit" :timeout="globalErrorSnackbar.timeout">
        {{ $t('detailSidebar.editTag.invalidEdit') }}
        <template v-slot:actions>
            <v-btn color="pink" variant="text" @click="editTagState.invalidEdit = false">
                {{ $t('words.close') }}
            </v-btn>
        </template>
    </v-snackbar>

    <confirm-dialog v-if="deleteTagState.open" :open-on-default="true" @close="(decision) => {
        deleteTagFromResearch(decision, deleteTagState.tag!.name);
        deleteTagState.open = false;
        deleteTagState.tag = undefined; }">
    </confirm-dialog>

</template>


<script setup lang="ts">

import EditTagDialog from '../dialogs/EditTagDialog.vue';
import ConfirmDialog from '../dialogs/ConfirmDialog.vue';

import {reactive, toRaw, watch} from 'vue';
import type {Tag} from '@/model/Tag';
import {TagApiHandler} from '@/api/Tag/TagApiHandler';
import {PaperApiHandler} from '@/api/Paper/PaperApiHandler';
import {ResearchApiHandler} from '@/api/Research/ResearchApiHandler';
import {useOpenResearchStore} from '@/stores/openResearch';
import type {SavedPaper} from '@/model/SavedPaper';
import {globalErrorSnackbar} from "@/api/ApiErrors";


const props = defineProps<{ openPaper: SavedPaper }>();

let openPaperState: { openPaper: SavedPaper } = reactive({
    openPaper: props.openPaper
});

// watcher to synchronize changes with local storage
watch(openPaperState, (val) => {
    useOpenResearchStore().setResearchPaper(val.openPaper);
});


let tagState: { selectedTags: string[], selectableTags: Tag[], searchQuery: string } = reactive({
    selectedTags: [],
    selectableTags: [],
    searchQuery: ""
});

// state for edit tag dialog
let editTagState: { open: boolean, tag: Tag | undefined, invalidEdit: boolean } = reactive({
    open: false,
    tag: undefined,
    invalidEdit: false
});

// state for delete tag dialog
let deleteTagState: { open: boolean, tag: Tag | undefined } = reactive({
    open: false,
    tag: undefined
});


async function getTagsOfResearch() {
    // get selectable tags
    tagState.selectableTags = await ResearchApiHandler.getTags(useOpenResearchStore().getResearch!);
    
    // get selected tags
    tagState.selectedTags = openPaperState.openPaper.tags.map(tag => tag.name);

    console.debug("current selected tags: " + tagState.selectedTags);
    console.debug("current selectable tags: " + tagState.selectableTags.map(tag => tag.name));
}
getTagsOfResearch();

// method to globally create tag & add to open paper
async function addTagToResearch(name: string): Promise<void> {
    let createdTag = await TagApiHandler.createTag(useOpenResearchStore().getResearch!, name, "#000000");

    // update selectable & selected tags
    await getTagsOfResearch();

    // add tag to open paper
    await addTagToOpenPaper(createdTag.name);

    console.debug("Created Tag '" + name + "' in open research");
}

// method to globally update tag
async function updateTagOfResearch(tag: Tag, name: string, color: string): Promise<void> {
    let tagFound = tagState.selectableTags.find(tag => tag.name === name);
    if (tagFound && tagFound.id !== tag.id) {
        editTagState.invalidEdit = true;
        return;
    }

    await TagApiHandler.updateTag(tag, name, color);

    // update open paper of locally saved open research
    openPaperState.openPaper = await PaperApiHandler.getDetails(openPaperState.openPaper.paper.paperId,
        useOpenResearchStore().getResearch!.id) as SavedPaper;

    // update selectable & selected tags
    await getTagsOfResearch();

    console.debug("Updated Tag '" + name + " (" + color + ") ' of open research");
}

// method to globally delete tag
async function deleteTagFromResearch(decision: boolean, name: string): Promise<void> {
    if (!decision) return;

    const tag = tagState.selectableTags.find(tag => tag.name === name); // get tag of given name
    if (!tag) return;

    await TagApiHandler.deleteTag(tag);

    // update open paper of locally saved open research
    openPaperState.openPaper = await PaperApiHandler.getDetails(openPaperState.openPaper.paper.paperId,
        useOpenResearchStore().getResearch!.id) as SavedPaper;

    // update selectable & selected tags
    await getTagsOfResearch();

    console.debug("Deleted Tag '" + name + "' from open research");
}

// method to add tag to open paper
async function addTagToOpenPaper(name: string): Promise<void> {
    const tag = tagState.selectableTags.find(tag => tag.name === name); // get tag of given name
    if (!tag) {
        console.error("tag '" + name + "' to be added does not exist");
        return;
    }

    await PaperApiHandler.addTag(openPaperState.openPaper, tag);

    // update open paper of locally saved open research
    openPaperState.openPaper = await PaperApiHandler.getDetails(openPaperState.openPaper.paper.paperId,
        useOpenResearchStore().getResearch!.id) as SavedPaper;

    // update selectable & selected tags
    await getTagsOfResearch();

    console.debug("Added Tag '" + name + "' to open paper");
}

// method to remove tag from open paper
async function removeTagFromOpenPaper(name: string): Promise<void> {
    const tag = tagState.selectableTags.find(tag => tag.name === name); // get tag of given name
    if (!tag) return;

    await PaperApiHandler.removeTag(props.openPaper, tag);
    
    // update open paper of locally saved open research
    openPaperState.openPaper = await PaperApiHandler.getDetails(openPaperState.openPaper.paper.paperId,
        useOpenResearchStore().getResearch!.id) as SavedPaper;

    // update selectable & selected tags
    await getTagsOfResearch();

    console.debug("Removed Tag '" + name + "' from open paper");
}

// function to multiplex create/add/remove tag when typing tag
// different method needed because v-combobox element f.e. automatically adds v-chip on enter
async function multiplexOnKeyboardAction(name: string) {
    const selectedTag = tagState.selectedTags.find(tag => tag === name); // get if tag is selected
    const selectableTag = tagState.selectableTags.find(tag => tag.name === name); // get if tag is selectable

    if (name === "") return;

    if (selectedTag && selectableTag) {
        // add tag to open paper
        await addTagToOpenPaper(name);
    } else if (selectedTag) {
        // create tag & add to open paper
        await addTagToResearch(name);
    } else {
        // remove tag from open paper
        await removeTagFromOpenPaper(name);
    }
}

// function to multiplex add/remove tag when clicking tag
async function multiplexOnMouseAction(name: string) {
    const selectedTag = tagState.selectedTags.find(tag => tag === name); // get if tag is selected
    const selectableTag = tagState.selectableTags.find(tag => tag.name === name); // get if tag is selectable

    if (name === "") return;

    if (selectableTag && selectedTag) {
        // remove tag from open paper
        await removeTagFromOpenPaper(name);
    } else if (selectableTag) {
        // add tag to open paper
        await addTagToOpenPaper(name);
    }
}

function getColor(name: string) {
    const tag = tagState.selectableTags.find(tag => tag.name === name); // get tag of given name
    return tag?.color;
}

function clickOnEdit(tag: Tag) {
    editTagState.open = true;
    editTagState.tag = tag;
}

function clickOnDelete(tag: Tag) {
    deleteTagState.open = true;
    deleteTagState.tag = tag;
}

</script>
