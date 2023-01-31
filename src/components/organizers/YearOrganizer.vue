<script setup lang="ts">

import { ref, watch } from "vue";

import LaraButton from "../basic/LaraButton.vue";

const min = 1950;
const max = 2023;

let state = ref({ value: [1980, 2023] });


watch(state, (newState) => {
    console.log("ödwenanwd");
});


let test = () => {
    console.log(state.value);
}

</script>

<template>
    <div class="d-flex">
        <v-range-slider v-model:model-value="state.value" :step="1" strict :min="min" :max="max" thumb-label="always"></v-range-slider>
        <LaraButton class="ml-6" @click="test" type="outline">Aktualisieren</LaraButton>
    </div>
    
</template>