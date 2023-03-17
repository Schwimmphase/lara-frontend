<script setup lang="ts">

import {defineEmits, reactive, ref, watch} from "vue";

import LaraButton from "../basic/LaraButton.vue";

const emit = defineEmits(['year-change']);

const props = defineProps<{
    min: number,
    max: number
}>();

let extremas = reactive({ min: props.min, max: props.max });
let state = ref([extremas.min, extremas.max]);

const extremaInterval = 50;
const maxYear = 3000;

let updateParent = () => {
    emit('year-change', state.value[0], state.value[1]);
}

watch(state, (newState, oldState) => {
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
        <v-range-slider @change:modelValue="updateParent" v-model:model-value="state" :step="1" strict
                        :min="extremas.min - 20" :max="extremas.max + 20" thumb-label="always">
            <template v-slot:prepend>
                <lara-button icon="mdi-calendar" @click="decreaseMin" type="outline" id="year-organizer-earlier">
                    {{ $t('organizers.earlier') }}
                </lara-button>
            </template>

            <template v-slot:append>
                <lara-button icon="mdi-calendar" @click="increaseMax" type="outline" id="year-organizer-later">
                    {{ $t('organizers.later') }}
                </lara-button>
            </template>
        </v-range-slider>
    </div>
    
</template>


<style scoped>

@import '../../assets/main.css';

</style>