<script setup lang="ts">

import {reactive, watch, ref } from 'vue';

const emit = defineEmits(['update']);

const props = defineProps<{
    selectedVenues: string[]
}>();

let selectedState:{ value: string[] } = ref([]);

let currentState: { currentVenue: string } = reactive({
    currentVenue: "",
});

selectedState.value = props.selectedVenues;

// Method to watch if the selectedVenues have changed
watch(selectedState, (newState, oldState) => {
    emit('update', selectedState.value);
});

// Method to add a venue
let addVenue = () => {
    if (currentState.currentVenue == "" || selectedState.value.includes(currentState.currentVenue)) {
        return;
    }

    selectedState.value.push(currentState.currentVenue);
    // Clear the textfield on success
    currentState.currentVenue = "";

    emit('update', selectedState.value);
}

// Method to remove a venue from the list of selected venues
let remove = (venue: string[] | string) => {
    // Filter the venues, so that the venue to remove gets filtered out
    selectedState.value = selectedState.value.filter((remove) => {
        return (remove != venue);
    });
}

</script>

<template>
    <div class="d-flex flex-column">
        <div>
            <v-text-field class="lara-field" @click:append-inner="addVenue" v-model="currentState.currentVenue" append-inner-icon="mdi-plus" hide-details variant="outlined" :placeholder="$t('organizers.venue')"></v-text-field>
        </div>
        <div class="lara-venues">
            <v-chip class="lara-chip ml-2 mt-2" v-for="(venue, index) in selectedState" :key="venue + index" closable @click:close="remove(venue)" id="venue-sorter-closer">{{ venue }}</v-chip>
        </div>
    </div>
</template>

<style>

.lara-venues {
    min-height: 50px;
    max-height: 100px;
    overflow: auto;
}

</style>