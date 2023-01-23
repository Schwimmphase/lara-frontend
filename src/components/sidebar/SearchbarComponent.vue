<script setup lang="ts">

import { reactive } from "@vue/reactivity";
import router from '../../router';

const state: { searchQuery: string } = reactive({
    searchQuery: ""
});

// Method to navigate to the search view
let navigateToSearch = (): void => {
    router.push({ name: 'search', query: {search : state.searchQuery }});
}


</script>

<template>
    <div>
        <v-text-field hide-details @click:append-inner="navigateToSearch" v-model="state.searchQuery" label="Suche..." variant="outlined" append-inner-icon="mdi-magnify"></v-text-field>
    </div>
</template>