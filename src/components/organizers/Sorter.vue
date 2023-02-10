<script setup lang="ts">
import { reactive } from "@vue/reactivity";
import { defineEmits } from "vue";

const props = defineProps<{
    activated: boolean
    descending: boolean
}>();

let state = reactive({
    active: props.activated,
    descending: props.descending ? 'true' : 'false',
});

let emit = defineEmits<{
    (event: 'update', active: boolean, descending: boolean): void
}>();

let change = () => {
    emit('update', state.active, state.descending === 'true');
}

</script>


<template>
    <div class="d-flex align-center">
        <v-checkbox :label="$t('words.activate')" v-model="state.active" @input="change"></v-checkbox>
        <v-radio-group v-model="state.descending" inline v-show="state.active" @input="change">
            <v-radio :label="$t('words.descending')" value="true"></v-radio>
            <v-radio :label="$t('words.ascending')" value="false" class="ml-3"></v-radio>
        </v-radio-group>
    </div>
</template>