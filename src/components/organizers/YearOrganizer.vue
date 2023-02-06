<script setup lang="ts">

import { reactive, ref, watch, defineEmits } from "vue";

import LaraButton from "../basic/LaraButton.vue";

const emit = defineEmits(['year-change']);

const props = defineProps<{
    min: number,
    max: number
}>();

let extremas = reactive({ min: props.min, max: props.max });
let state = ref([extremas.min + 20, extremas.max - 20]);

const extremaInterval = 50;
const maxYear = 3000;

let updateParent = () => {
    emit('year-change', state.value[0], state.value[1]);
}

updateParent();

watch(state, (newState, oldState) => {
    console.log("moniasd")
    updateParent();
});

// Method for the user to increase the max by button click
let increaseMax = () => {
    if (extremas.max <= maxYear - extremaInterval) {
        extremas.max += extremaInterval;
        state.value[1] = extremas.max;
    }

    updateParent();
}

// Method for the user to decrease the min by button click
let decreaseMin = () => {
    if (extremas.min >= extremaInterval) {
        extremas.min -= extremaInterval;
        state.value[0] = extremas.min;
    }

    updateParent();
}

</script>


<template>
    <div class="d-flex">
        <v-range-slider @change:modelValue="updateParent" v-model:model-value="state" :step="1" strict :min="extremas.min" :max="extremas.max" thumb-label="always">
            <template v-slot:prepend>
                <lara-button icon="mdi-calendar" @click="decreaseMin" type="outline">früher</lara-button>
            </template>

            <template v-slot:append>
                <lara-button icon="mdi-calendar" @click="increaseMax" type="outline">später</lara-button>
            </template>

            <!-- TODO: behalten oder nicht?
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
            -->
        </v-range-slider>
    </div>
    
</template>


<style scoped>

@import '../../assets/main.css';

</style>