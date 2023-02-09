<template>

    <v-combobox :label="$t('detailSidebar.addTags')" v-model="tagState.selectedTags" :items="tagState.selectableTags" v-model:search.sync="tagState.searchQuery"
            @keydown.enter="onEdit(tagState.searchQuery)" :hide-no-data=false multiple>
        <!-- Selected Tags -->
        <template v-slot:selection="{ attrs, item, parent, selected }">
            <v-chip class="lara-chip" :color="getColor(item.title)" v-bind="attrs" :input-value="selected" :closable="true" @click:close="removeTagFromOpenPaper(item.title)">{{ item.title }}</v-chip>
        </template>
        <!-- Selectable Tags -->
        <template v-slot:item="{ index, item, props }">
            <div class="d-flex mx-4">
                <v-chip class="lara-chip h-100" big :color="toRaw(props.title).color" @click="addTagToOpenPaper(toRaw(props.title).name)">{{ toRaw(props.title).name }}</v-chip>
                <v-spacer></v-spacer>
                <v-icon class="ml-4 lara-clickable" @click="{ editTagState.open = true; editTagState.tag = toRaw(props.title) }">mdi-pencil</v-icon>
                <v-icon class="ml-4 lara-clickable" @click="{ deleteTagState.open = true; deleteTagState.tag = toRaw(props.title) }" color="red">mdi-trash-can</v-icon>
            </div>
        </template>
        <!-- Create & add new Tag -->
        <template v-slot:no-data>
            <v-list-item>
                Create <strong>{{  tagState.searchQuery }}</strong>
            </v-list-item>
        </template>
    </v-combobox>

    <edit-tag-dialog v-if="editTagState.open" :tag="editTagState.tag" @edit="(name, color) => { editTagState.open = false; updateTag(editTagState.tag!, name, color) }">
    </edit-tag-dialog>

    <confirm-dialog v-if="deleteTagState.open" :open-on-default="true" @close="(decision) => deleteTag(decision, deleteTagState.tag!.name)">
    </confirm-dialog>

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


let openResearch = useOpenResearchStore().getResearch!;

const props = defineProps<{ openPaper: SavedPaper }>();

watch(props.openPaper, (val, prev) => {
    useOpenResearchStore().setReserachPaper(val);
});

let tagState: { selectedTags: string[], selectableTags: Tag[], searchQuery: string} = reactive({
    selectedTags: [],
    selectableTags: [],
    searchQuery: ""
});

let editTagState: { open: boolean, tag: Tag | undefined } = reactive({
    open: false,
    tag: undefined
});

let deleteTagState: { open: boolean, tag: Tag | undefined } = reactive({
    open: false,
    tag: undefined
});

// method to get tags
async function getTags() {
    // get selectable tags
    let tags = await ResearchApiHandler.getTags(openResearch);
    tagState.selectableTags = tags;
    
    // get selected tags
    tagState.selectedTags = props.openPaper.tags.map(tag => tag.name);
}
getTags();

//console.debug("tag", await PaperApiHandler.getDetails(props.openPaper.paper.paperId, openResearch.id))

// method to globally add tag
async function addTag(name: string): Promise<void> {
    let newTag = await TagApiHandler.createTag(openResearch, name, "#000000");
    props.openPaper.tags.push(newTag);
    getTags();

    console.debug("Added Tag", name, "to open research");
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

    console.debug("Updated Tag", name, '(' + color + ')', "to open research");
}

// method to globally delete tag
async function deleteTag(decision: boolean, name: string): Promise<void> {
    if (!decision) return;

    // get tag object of given name
    let tag = tagState.selectableTags.find(tag => tag.name === name);
    if (!tag) return;

    await TagApiHandler.deleteTag(tag);

    // update open paper of locally saved open research
    let index = props.openPaper.tags.indexOf(tag);
    if (index !== -1) {
        props.openPaper.tags.splice(index, 1);
    }

    // update selectable & selected tags
    getTags();

    console.debug("Deleted Tag", tag.name, "from open research");
}

async function addTagToOpenPaper(name: string): Promise<void> {
    let tag = tagState.selectableTags.find(tag => tag.name === name); // get tag object of given name
    let tagSelected = tagState.selectedTags.find(tag => tag === name); // get if tag of given name has been selected 
    if (!tag || tagSelected) return;

    await PaperApiHandler.addTag(props.openPaper, tag);

    // update open paper of locally saved open research
    props.openPaper.tags.push(tag);

    // update selectable & selected tags
    getTags();

    console.debug("Added Tag", tag, "to open paper");
}

// method to remove tag from open paper
async function removeTagFromOpenPaper(name: string): Promise<void> {
    // get tag object of given name
    let tag = tagState.selectableTags.find(tag => tag.name === name);
    if (!tag) return;

    await PaperApiHandler.removeTag(props.openPaper, tag);

    // update open paper of locally saved open research
    props.openPaper.tags.splice(props.openPaper.tags.indexOf(tag), 1);

    // update selectable & selected tags
    getTags();

    console.debug("Removed Tag", name, "from open paper");
}

// watch if new Tags have been added
function onEdit(name: string) {
    const tag = tagState.selectableTags.find(tag => tag.name === name);

    if (tag) {
        console.debug("added not new tag", tag.name);
        props.openPaper.tags.push(tag);
    } else if (name !== "") {
        addTag(name);
    }
}

function getColor(name: string) {
    const tag = tagState.selectableTags.find(tag => tag.name === name);
    return tag?.color;
}

</script>
