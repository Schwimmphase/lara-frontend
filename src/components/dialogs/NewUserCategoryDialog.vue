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
        <v-card id="dialog">
            <v-card-title>{{ $t('admin.categories.create') }}</v-card-title>
            <v-container>
                <v-row>
                    <v-col>
                        <v-card-text>
                            <v-form>
                                <div class="d-flex flex-column gap-4">
                                    <v-text-field class="lara-field" variant="outlined"
                                      v-model="state.title" :counter="32"
                                      :label="$t('admin.categories.name')">
                                    </v-text-field>  
                                </div>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-container>
                                <lara-button type="primary" @click="closeDialog">{{ $t('admin.categories.finish') }}</lara-button>
                            </v-container>
                        </v-card-actions>
                    </v-col>
                    <v-col>
                        <v-color-picker
                            hide-inputs
                            mode="hexa"
                            dot-size="25"
                            v-model="state.color"
                        ></v-color-picker>
                    </v-col>
                </v-row>
            </v-container>
            
            
            
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