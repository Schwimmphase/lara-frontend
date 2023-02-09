<script setup lang="ts">

import {reactive } from 'vue';

import LaraButton from '../basic/LaraButton.vue';

const emit = defineEmits(['update']);

let state: { selectedVenues: string[], currentVenue: string } = reactive({
    currentVenue: "",
    selectedVenues: [],
});

let addVenue = () => {
    if (state.currentVenue == "" || state.selectedVenues.includes(state.currentVenue)) {
        return;
    }

    state.selectedVenues.push(state.currentVenue);
    state.currentVenue = "";
}

</script>

<template>
    <div class="d-flex flex-column">
        <div class="lara-venues">
            <v-chip class="lara-chip ml-2 mt-2" closable v-for="(venue, index) in state.selectedVenues" :key="index">{{ venue }}</v-chip>
        </div>
        <div class="mt-5">
            <v-text-field @click:append-inner="addVenue" v-model="state.currentVenue" append-inner-icon="mdi-plus" hide-details variant="outlined" :placeholder="$t('organizers.venue')"></v-text-field>
        </div>
    </div>
</template>

<style setup>

.lara-venues {
    min-height: 50px;
    max-height: 100px;
    overflow: auto;
}

</style>