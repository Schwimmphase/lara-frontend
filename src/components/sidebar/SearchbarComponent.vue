<script setup lang="ts">

import { reactive } from "@vue/reactivity";
import router from '../../router';

let props = defineProps({
    inputString: String,
});

const state: { searchQuery: string | undefined } = reactive({
    searchQuery: props.inputString,
});

// Method to navigate to the search view
let navigateToSearch = (): void => {
    router.push({ name: 'search', query: {search : state.searchQuery }});
}

</script>


<template>
    <div>
        <v-text-field @keypress.enter="navigateToSearch" hide-details @click:append-inner="navigateToSearch" v-model="state.searchQuery" :label="$t('sidebar.searchBar')" variant="outlined" append-inner-icon="mdi-magnify"></v-text-field>
    </div>
</template>