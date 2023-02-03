<script setup lang="ts">

import { reactive, ref, watch } from "vue";

import LaraButton from "../basic/LaraButton.vue";

const emit = defineEmits(['year-change']);

let extremas = reactive({ min: 1950, max: (new Date()).getFullYear()});
let state = ref([extremas.min + 20, extremas.max - 20]);

let updateParent = () => {
    emit('year-change', state.value[0], state.value[1]);
}

watch(state, (newState, oldState) => {
    updateParent();
});

let calcChange = () => {
    if (state.value[0] < extremas.min) {
        extremas.min = state.value[0];
    }

    if (state.value[1] > extremas.max) {
        extremas.max = state.value[1];
    }

    updateParent();
}


let test = () => {
    console.log("MOin");
}

</script>

<template>
    <div class="d-flex">
        <v-range-slider @change:modelValue="updateParent" v-model:model-value="state" :step="1" strict :min="extremas.min" :max="extremas.max" thumb-label="always">
            <template v-slot:prepend>
                <v-text-field
                    v-model:model-value="state[0]"
                    @input="calcChange"
                    hide-details
                    single-line
                    type="number"
                    variant="outlined"
                    density="compact"
                    style="width: 90px"
                    readonly
                ></v-text-field>
            </template>
            <template v-slot:append>
                <v-text-field
                    v-model:model-value="(state[1])"
                    hide-details
                    single-line
                    type="number"
                    variant="outlined"
                    style="width: 90px"
                    density="compact"
                    @input="calcChange"
                    
                ></v-text-field>
            </template>
        </v-range-slider>
    </div>
    
</template>