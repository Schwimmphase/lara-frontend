<script setup lang="ts">
import { reactive } from "@vue/reactivity";
import { defineEmits } from "vue";

let state = reactive({
    sortByYear: false,
    descending: 'true',
});

let emit = defineEmits(['update']);

let change = () => {
    emit('update', state.sortByYear, state.descending);
}

</script>


<template>
    <div class="d-flex align-center">
        <v-checkbox label="Nach Jahr sortieren" v-model="state.sortByYear" @input="change"></v-checkbox>
        <v-radio-group v-model="state.descending" inline v-show="state.sortByYear" @input="change">
            <v-radio label="Absteigend" value="true"></v-radio>
            <v-radio label="Aufsteigend" value="false" class="ml-3"></v-radio>
        </v-radio-group>
    </div>
</template>