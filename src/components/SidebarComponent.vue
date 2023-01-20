<script setup lang="ts">

import type { SavedPaper } from '../model/SavedPaper';

import { useResearchStore } from '../stores/research'

import '../model/_testResearch';
import { testSavedPaper1 } from '../model/_testResearch';
import { testSavedPaper2 } from '../model/_testResearch';
import { testSavedPaper3 } from '../model/_testResearch';

const store = useResearchStore();

// TDOD Nur zu Testzwecken drin... sobald die Research Papers gesetzt werden, kann das wieder weg 
store.setOpenResearch("id12345", [testSavedPaper1, testSavedPaper2, testSavedPaper3]);


let researchPapers: SavedPaper[] = store.getResearchPapers; 

console.log("respap", researchPapers)


</script>




<template>
    <div>
        <v-navigation-drawer>
            <v-list>
                <v-list-item v-bind:key="index" v-for="(paper, index) in researchPapers">
                    {{ paper.paper.title }}
                </v-list-item>

            </v-list>
        </v-navigation-drawer>
    </div>
</template>