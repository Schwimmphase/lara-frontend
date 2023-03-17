<script setup lang="ts">
import { Tag } from "@/model/Tag";
import { reactive } from "@vue/reactivity";
import { defineEmits } from 'vue';

import LaraButton from "../basic/LaraButton.vue";

const props = defineProps({
    tag: Tag,
});

let state: { color: string | undefined, name: string | undefined } = reactive({
    name: props.tag?.name,
    color: props.tag?.color
});

let model = true;

const emits = defineEmits(['edit']);

let closeDialog = () => {
    emits('edit', state.name, state.color);
    state.name = props.tag?.name;
    state.color = props.tag?.color;
}

</script>


<template>
    <v-dialog v-model="model" id="edit-tag-dialog">
        <v-card>
            <v-container>
                <v-row>
                    <v-col>
                        <v-card-text>
                            <v-form>
                                <div class="d-flex flex-column gap-4">
                                    <v-text-field class="lara-field" variant="outlined"
                                      v-model="state.name" :counter="32"
                                      :label="$t('detailSidebar.editTag.name')">
                                    </v-text-field>  
                                </div>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-container>
                                <lara-button type="primary" @click="closeDialog" id="edit-tag-close-dialogue">{{ $t('detailSidebar.save') }}</lara-button>
                            </v-container>
                        </v-card-actions>
                    </v-col>
                    <v-col>
                        <v-color-picker
                            hide-inputs
                            mode="hex"
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

#edit-tag-dialog {
    min-width: 300px;
    max-width: 750px;
    border-radius: 0;
}

</style>