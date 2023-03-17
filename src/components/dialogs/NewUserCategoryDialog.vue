<script setup lang="ts">

import { reactive } from "@vue/reactivity";
import { defineEmits } from 'vue';

import LaraButton from "../basic/LaraButton.vue";

let state = reactive({
    dialog: false,
    title: "",
    color: "#fcba03"
});

const emits = defineEmits(['create']);

let closeDialog = () => {
    emits('create', state.title, state.color);
    state.dialog = false;
    state.title = "";
    state.color = "fcba03";
}

</script>


<template>
    <div @click="state.dialog = true">
        <slot></slot>
    </div>
    <v-dialog v-model="state.dialog">
        <v-card class="dialog">
            <div class="mx-4">
                <v-card-title class="font-weight-bold text-h4 mt-4">{{ $t('admin.categories.create') }}</v-card-title>
                <v-container>
                    <v-row>
                        <v-col>
                            <v-form>
                                <div class="d-flex flex-column gap-4">
                                    <v-text-field class="lara-field" variant="outlined"
                                        v-model="state.title" :counter="32"
                                        :label="$t('admin.categories.name')">
                                    </v-text-field>  
                                </div>
                                <lara-button type="primary" @click="closeDialog" id="create-new-user-category-button">{{ $t('admin.categories.finish') }}</lara-button>
                            </v-form>
                        </v-col>
                        <v-col>
                            <div class="d-flex justify-center">
                                <v-color-picker
                                hide-inputs
                                mode="hexa"
                                dot-size="25"
                                v-model="state.color"
                                ></v-color-picker>
                            </div>
                        </v-col>
                    </v-row>
                </v-container>
            </div>
        </v-card>
    </v-dialog>
</template>

<style scoped>

.dialog {
    min-width: 300px;
    max-width: 750px;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    border-radius: 0;
}

</style>