<script setup lang="ts">
import { reactive } from "@vue/reactivity";
import { defineEmits } from "vue";

const props = defineProps<{
    activated: boolean
    descending: boolean
}>();

let state = reactive({
    sortByYear: props.activated,
    descending: props.descending ? 'true' : 'false',
});

let emit = defineEmits<{
    (event: 'update', sortByYear: boolean, descending: boolean): void
}>();

let change = () => {
    emit('update', state.sortByYear, state.descending === 'true');
}

</script>


<template>
    <div class="d-flex align-center">
        <v-checkbox :label="$t('organizers.sortByYear')" v-model="state.sortByYear" @input="change"></v-checkbox>
        <v-radio-group v-model="state.descending" inline v-show="state.sortByYear" @input="change">
            <v-radio :label="$t('organizers.descending')" value="true"></v-radio>
            <v-radio :label="$t('organizers.ascending')" value="false" class="ml-3"></v-radio>
        </v-radio-group>
    </div>
</template>