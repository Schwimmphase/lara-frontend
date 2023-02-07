<script setup lang="ts">

import LaraButton from './basic/LaraButton.vue';

import { useOpenPaperStore } from '../stores/openPaper'
import { reactive } from '@vue/reactivity';
import { watch } from 'vue';

import { ResearchApiHandler } from '@/api/Research/ResearchApiHandler';
import { PaperApiHandler } from '@/api/Paper/PaperApiHandler';

import type { SavedPaper } from '../model/SavedPaper';
import type { Paper } from '../model/Paper';
import { Comment } from '../model/Comment'
import { Tag } from '../model/Tag'
import { OpenPaper } from '../stores/model/OpenPaper';
import { SaveState } from '../model/SaveState';
import type { Research } from '../model/Research';
import { useOpenResearchStore } from '@/stores/openResearch';
import type { CachedPaper } from '@/model/CachedPaper';
import router from '@/router';
import type { Author } from '@/model/Author';
import { testTag1, testTag2 } from '@/model/_testResearch';

const MAX_NUMBER_OF_AUTHORS = 2;

// Store for the openResearch
let openResearchStore = useOpenResearchStore();

// State for the research currently opened
let researchState: { research: Research | undefined } = reactive({
    research: undefined,
});

openResearchStore.$subscribe((mutation, state) => {
    // If the research is changed, set the state for the openResearch to that new research
    console.log("RECHERCHE GEÄNDERT")
    researchState.research = state.openResearch;
});

// Use the store for the openPaper
let openPaperStore = useOpenPaperStore();

let detailState: { openPaper: OpenPaper | undefined} = reactive({
    openPaper: undefined
});

// Set the openResearch/openPaper state to the openResearch/openPaper saved in the store
researchState.research = openResearchStore.getResearch;
detailState.openPaper = openPaperStore.paper;
openResearchStore.$subscribe((mutation, state) => {
    // If the research is changed, set the state for the openResearch to that new research
    console.log("RECHERCHE GEÄNDERT");
    researchState.research = state.openResearch;
});
openPaperStore.$subscribe((mutation, state) => {
    // When a change in the paper is detected, update the state
    detailState.openPaper = state.paper;
});

// State for the comment/relevance of the openPaper
let detailSidebarState: { comment: string | undefined, tags: Tag[], relevance: number | undefined } = reactive({
    comment: detailState.openPaper?.saved ? detailState.openPaper.savedPaper?.comment.text : "",
    tags: [],
    relevance: detailState.openPaper?.saved ? detailState.openPaper.savedPaper?.relevance : 0
});


// Methods to change comment/tag/saveState/relevance of the paper currently viewed
let changeComment = async (text: string | undefined): Promise<void> => {
    if (text == undefined || detailState.openPaper == null) {
        console.error("CHANGE_COMMENT : Argument null / undefined");
        return;
    }

    if (detailState.openPaper.savedPaper == null) {
        console.error("CHANGE_COMMENT : No saved paper");
        return;
    }
    
    console.debug("Change comment", text);

    await PaperApiHandler.changeComment(detailState.openPaper.savedPaper, new Comment(text));
}

let addTag = async (tag: Tag): Promise<void> => {
    if (detailState.openPaper == null || detailState.openPaper.savedPaper == null) {
        console.error("ADD_TAG : No saved paper");
        return;
    }
    
    console.debug("Open Tag" + tag.name);
    
    await PaperApiHandler.addTag(detailState.openPaper.savedPaper, tag);
}

let deleteTag = async (tag: Tag): Promise<void> => {
    if (detailState.openPaper == null || detailState.openPaper.savedPaper == null) {
        console.error("DELETE_TAG : No saved paper");
        return;
    }
    
    console.debug("Close Tag" + tag.name);
    
    await PaperApiHandler.removeTag(detailState.openPaper.savedPaper, tag);
}

let changeRelevance = async (relevance: number | undefined): Promise<void> => {
    if (relevance == undefined || detailState.openPaper == null) {
        console.error("CHANGE_RELEVANCE : Argument null / undefined");
        return;
    }

    if (detailState.openPaper.savedPaper == null) {
        console.error("CHANGE_RELEVANCE : No saved paper");
        return;
    }

    console.debug("Change relevance:", relevance);

    await PaperApiHandler.changeRelevance(detailState.openPaper.savedPaper, relevance);
}

let changeSaveState = async (savedPaper: SavedPaper | undefined, state: SaveState): Promise<void> => {
    if (savedPaper === undefined) {
        console.error("CHANGE_SAVE_STATE : No valid savedPaper provided");
        return;
    }
    
    await PaperApiHandler.changeSaveState(savedPaper, state);
}

watch(detailSidebarState, async (value) => {
    if (value == undefined) {
        return;
    }

    changeComment(value.comment);
    changeRelevance(value.relevance);
});

watch(detailSidebarState.tags, async (newValue, oldValue) => {
    if (oldValue == undefined || newValue == undefined || newValue.length === oldValue.length) {
        return;
    }

    // TODO: vergleiche oldValue & newValue => addTag bzw. deleteTag
    console.debug(oldValue, newValue);
});


// Method to create a saved Paper from a paper with a given saveState
let createSavedPaper = async (paper: Paper | null | undefined, state: SaveState): Promise<void> => {
    if (paper == null || paper == undefined || researchState.research == null) {
        console.error("CREATE_SAVE_PAPER : Argument null / undefined");
        return;
    }
    
    console.debug("Save Paper : " + paper.paperId + " = " + state);
    
    await ResearchApiHandler.savePaper(researchState.research, paper, state);
    router.go(0); // reload the page // TODO: needed?
}


// state and methods to accumulate recommendations, citations and references of openPaper
let recommendationsStore: { recommendations: Paper[], citations: Paper[], references: Paper[] } = reactive({
    recommendations: [],
    citations: [],
    references: []
});

let getRecommendations = async () => {
    let paper = detailState.openPaper?.paper;
    let research = detailState.openPaper?.savedPaper?.research;
    if (paper == undefined || research == undefined) {
        return;
    }
    let recommendations = await PaperApiHandler.getRecommendations(paper, research, []);
    recommendationsStore.recommendations = recommendations;
}
getRecommendations();

let getCitations = async () => {
    let citations = await PaperApiHandler.getCitations(detailState.openPaper!.savedPaper!.paper, useOpenResearchStore().getResearch!, []); // TODO: add organizers?
    recommendationsStore.citations = citations;
}
getCitations();

let getReferences = async () => {
    let references = await PaperApiHandler.getReferences(detailState.openPaper!.savedPaper!.paper, useOpenResearchStore().getResearch!, []); // TODO: add organizers?
    recommendationsStore.references = references;
}
getReferences();

// Method to format the authors of the open paper
let getAuthorsString = (authors: Author[] | undefined) => {
    if (authors == undefined) {
        return "";
    } else if (authors.length > MAX_NUMBER_OF_AUTHORS) {
        return authors.slice(0, MAX_NUMBER_OF_AUTHORS).map(author => author.name).join(", ") + " et al.";
    } else {
        return authors.map(author => author.name).join(", ");
    }
}

let tags: string[] = [];
detailState.openPaper?.savedPaper?.tags.forEach(tag => tags.push(tag.name));
tags?.push(testTag1.name);
tags?.push(testTag2.name);


// test
let colors = ['green', 'purple', 'indigo', 'cyan', 'teal', 'orange']
let items = [
    { header: 'Select an option or create one' },
    new Tag('123', 'cool', 'blue'),
    new Tag('456', 'cooler', 'red')
]

let editingItem: Tag | undefined = undefined
let nonce = 1
let model = [
    new Tag('1', 'foo', 'black')
]
let searchText: string = ""

watch(model, (val ,prev) => {
    if (val.length === prev.length) return

    model = val.map(v => {
        v = new Tag(v.id , v.name, colors[nonce - 1]);
        items.push(v)
        nonce++
        return v
    });
});

function edit (index: number, item: Tag) {
    if (!editingItem) {
    editingItem = item
    index = index
    } else {
    editingItem = undefined
    index = -1
    }
}
function filter (item: Tag, queryText: string, itemText: string) {

    const hasValue = (val: string | null) => val != null ? val : ''

    const text = hasValue(itemText)
    const query = hasValue(queryText)

    return text.toString()
    .toLowerCase()
    .indexOf(query.toString().toLowerCase()) > -1
}

</script>


<template>
    <v-navigation-drawer location="right" width="400" permanent>
        <div class="mx-8 my-3">

            <!-- Information if the open paper is saved -->
            <div v-if="detailState.openPaper?.saved">
                <div>
                    <span class="text-h5">{{ $t('detailSidebar.information') }}</span><br>
                    <div>
                        <span class="font-weight-bold">{{ getAuthorsString(detailState.openPaper?.savedPaper?.paper.authors) }}</span>
                    </div>
                    <span>{{ detailState.openPaper?.savedPaper?.paper.year }} - {{ detailState.openPaper?.savedPaper?.paper.venue }} - {{ detailState.openPaper.savedPaper?.paper.citationCount }} mal zitiert - {{ detailState.openPaper.savedPaper?.paper.referenceCount }} Referenzen</span>
                    <v-divider class="my-3"></v-divider>
                </div>

                <div class="mt-4">
                    <span class="text-h5">{{ $t('detailSidebar.comments') }}</span>
                    <v-textarea hide-details variant="outlined" class="mt-2 lara-field" v-model="detailSidebarState.comment"></v-textarea>
                    <lara-button class="mt-2" type="primary" @click="changeComment(detailSidebarState.comment)">{{ $t('detailSidebar.save') }}</lara-button>
                    <v-divider class="my-3"></v-divider>
                </div>

                <div class="mt-4">
                    <span class="text-h5">{{ $t('detailSidebar.tags') }}</span>
                    <div class="mt-2">
                        <v-chip v-for="(tag, index) in detailState.openPaper?.savedPaper?.tags" :key="index" @click:close="deleteTag(tag)" closable :color="tag.color" class="lara-chip mr-2 mb-1">{{ tag.name }}</v-chip>

                        <v-combobox label="Select Tags" :items="tags" multiple chips variant="solo" :search-input.sync="searchText">
                            <!-- Create new tag -->
                            <template v-slot:append-item>
                                <v-list-tile @click="items.push(new Tag('000', searchText, 'black')), searchText=''"></v-list-tile>
                            </template>
                        </v-combobox>

                        <v-combobox
                            v-model="model"
                            :filter="filter"
                            :hide-no-data="!searchText"
                            :items="items"
                            :search-input.sync="searchText"
                            hide-selected
                            label="Search for an option"
                            multiple
                            small-chips
                            solo
                            >
                            <!-- Add new Tag -->
                            <template v-slot:append-item>
                                <v-list-tile v-if="searchText" @click="model.push(new Tag('00', searchText, 'green')), searchText=''">
                                <span class="subheading">+ Add</span>
                                <v-chip
                                    :color="`${colors[nonce - 1]} lighten-3`"
                                    label
                                    small
                                >
                                    {{ searchText }}
                                </v-chip>
                                </v-list-tile>
                            </template>
                            <!-- If no Tag -->
                            <template v-slot:no-data>
                            <v-list-tile>
                                <span class="subheading">+ Add</span>
                                <v-chip
                                :color="`${colors[nonce - 1]} lighten-3`"
                                label
                                small
                                >
                                {{ searchText }}
                                </v-chip>
                            </v-list-tile>
                            </template>
                            <!-- Display current Tags -->
                            <template v-slot:selection="{ item, parent, selected }">
                                <v-chip
                                v-if="item === Object(item)"
                                :color="`${item.color} lighten-3`"
                                :selected="selected"
                                label
                                small
                                >
                                <span class="pr-2">
                                    {{ item.name }}
                                </span>
                                <v-icon
                                    small
                                    @click="parent.selectItem(item)"
                                >close</v-icon>
                                </v-chip>
                            </template>
                            <template v-slot:item="{ index, item }">
                                <v-list-tile-content>
                                <v-text-field
                                    v-if="editingItem === item"
                                    v-model="editingItem!.name"
                                    autofocus
                                    flat
                                    background-color="transparent"
                                    hide-details
                                    solo
                                    @keyup.enter="edit(index, item)"
                                ></v-text-field>
                                <v-chip
                                    v-else
                                    :color="`${item.color} lighten-3`"
                                    dark
                                    label
                                    small
                                >
                                    {{ item.text }}
                                </v-chip>
                                </v-list-tile-content>
                                <v-spacer></v-spacer>
                                <v-list-tile-action @click.stop>
                                <v-btn
                                    icon
                                    @click.stop.prevent="edit(index, item)"
                                >
                                    <v-icon>{{ editingItem !== item ? 'edit' : 'check' }}</v-icon>
                                </v-btn>
                                </v-list-tile-action>
                            </template>
                        </v-combobox>

                        <!-- TODO: finish tag input
                        <v-container fluid>
                            <v-combobox v-model="model" v-model:search-input="search" :custom-filter="filter" :hide-no-data="!search" :items="items" hide-selected label="Search for an option" multiple small-chips variant="solo">
                                <template v-slot:no-data>
                                    <v-list-item>
                                        <span class="subheading">Create</span>
                                        <v-chip :color="`${colors[nonce - 1]} lighten-3`" label small>{{ search }}</v-chip>
                                    </v-list-item>
                                </template>
                                <template v-slot:selection="{ attrs, item, parent, selected }">
                                    <v-chip v-if="item === Object(item)" v-bind="attrs" :color="`${item.color} lighten-3`" :model-value="selected" label small>
                                        <span class="pe-2">{{ item.text }}</span>
                                        <v-icon size="small" @click="parent.selectItem(item)">$delete</v-icon>
                                    </v-chip>
                                </template>
                                <template v-slot:item="{ index, item }">
                                    <v-text-field v-if="editing === item" v-model="editing.text" autofocus flat bg-color="transparent" hide-details variant="solo" @keyup.enter="edit(index, item)"></v-text-field>
                                    <v-chip v-else :color="`${item.color} lighten-3`" dark label small>{{ item.text }}</v-chip>
                                    <v-spacer></v-spacer>
                                    <v-list-item-action @click.stop>
                                    <v-btn icon @click.stop.prevent="edit(index, item)">
                                        <v-icon>{{ editing !== item ? 'mdi-pencil' : 'mdi-check' }}</v-icon>
                                    </v-btn>
                                    </v-list-item-action>
                                </template>
                            </v-combobox>
                        </v-container>
                        -->
                    </div>
                    <v-divider class="my-3"></v-divider>
                </div>

                <div class="mt-4">
                    <span class="text-h5">{{ $t('detailSidebar.relevance') }}</span>
                    <div>
                        <v-rating
                            v-model="detailSidebarState.relevance"
                            length="3"
                            size="65"
                            full-icon="mdi-star"
                            empty-icon="mdi-star-outline"
                            color="orange"
                        ></v-rating>
                        <v-icon v-if="detailState.openPaper.savedPaper?.saveState != SaveState.hidden" class="lara-hide-button" @click="detailState.openPaper !== null ? changeSaveState(detailState.openPaper?.savedPaper, SaveState.hidden) : null">mdi-eye-off</v-icon>
                        <v-icon v-if="detailState.openPaper.savedPaper?.saveState == SaveState.hidden" class="lara-hide-button" @click="detailState.openPaper !== null ? changeSaveState(detailState.openPaper?.savedPaper, SaveState.hidden) : null">mdi-eye</v-icon>
                    </div>
                    <v-divider class="my-3"></v-divider>
                </div>
            </div>
            
            <!-- Information if the open paper is not saved -->
            <div v-else>
                <div>
                    <span class="text-h5">{{ $t('detailSidebar.information') }}</span><br>
                    <div>
                        <span class="font-weight-bold">{{ getAuthorsString(detailState.openPaper?.paper?.authors) }}</span>
                    </div>
                    <span>{{ detailState.openPaper?.paper?.year }} - {{ detailState.openPaper?.paper?.venue }} - {{ $t('detailSidebar.citationCount', { n: detailState.openPaper?.paper?.citationCount}) }} - {{ $t('detailSidebar.referenceCount', {n: detailState.openPaper?.paper?.referenceCount}) }}</span>
                    <v-divider class="my-3"></v-divider>
                </div>
                
                <div class="mt-4">
                    <lara-button type="primary" @click="detailState.openPaper !== null ? createSavedPaper( detailState.openPaper?.paper, SaveState.added) : null">{{ $t('detailSidebar.add') }}</lara-button>
                    <lara-button class="mt-2" type="secondary" @click="detailState.openPaper !== null ? createSavedPaper(detailState.openPaper?.paper, SaveState.enqueued) : null">{{ $t('detailSidebar.enqueue') }}</lara-button>
                    <lara-button class="lara-hide-button mt-2" type="outline" @click="detailState.openPaper !== null ? createSavedPaper(detailState.openPaper?.paper, SaveState.hidden) : null">
                        <v-icon>mdi-eye-off</v-icon>
                    </lara-button>
                    <v-divider class="my-3"></v-divider>
                </div>
            </div>


            <!-- Section for the recommendations, citations and references of the open paper -->
            <div class="mt-3">
                <div>
                    <span class="text-h5 font-weight-bold">{{ $t('detailSidebar.recommendations') }}</span><br>

                    <div v-for="(recommendation, index) in recommendationsStore.recommendations" :key="index">
                        <router-link class="text-h6 lara-recommendation-link" :to="{ name: 'paperDetails', query: {paper: recommendation.paperId}}" @click="openPaperStore.setPaper(new OpenPaper(recommendation, undefined, false))">{{ recommendation.title }}</router-link><br>
                    </div>
                </div>
                <div class="mt-2">
                    <span class="text-h5 font-weight-bold">{{ $t('detailSidebar.citations') }}</span><br>

                    <div v-for="(citation, index) in recommendationsStore.citations" :key="index">
                        <router-link class="text-h6 lara-recommendation-link" :to="{ name: 'paperDetails', query: {paper: citation.paperId}}" @click="openPaperStore.setPaper(new OpenPaper(citation, undefined, false))">{{ citation.title }}</router-link><br>
                    </div>
                </div>
                <div class="mt-2">
                    <span class="text-h5 font-weight-bold">{{ $t('detailSidebar.references') }}</span><br>

                    <div v-for="(reference, index) in recommendationsStore.references" :key="index">
                        <router-link class="text-h6 lara-recommendation-link" :to="{ name: 'paperDetails', query: {paper: reference.paperId}}" @click="openPaperStore.setPaper(new OpenPaper(reference, undefined, false))">{{ reference.title }}</router-link><br>
                    </div>
                </div>
            </div>
        </div>
    </v-navigation-drawer>
</template>


<style scoped>

.lara-hide-button {
    color: #000;
    transition: color ease-in-out 0.3s;
}

.lara-hide-button:hover {
    color: rgb(175, 175, 175);
}

.lara-recommendation-link {
    color: #000;
    transition: color ease-in-out 0.3s;
    text-decoration: none;
}

.lara-recommendation-link:hover {
    cursor: pointer;
    color: rgb(175, 175, 175);
    text-decoration: none;
}

</style>