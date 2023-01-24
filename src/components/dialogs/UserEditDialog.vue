<template>
    <v-btn size="small" color="surface-variant" variant="text" icon="mdi-pencil">
        <v-dialog v-model="state.dialog" activator="parent" persistent>
            <v-card id="dialog">
                <v-card-title></v-card-title>
                <v-card-text>
                    <v-form v-model="valid">
                        <div class="d-flex flex-column">
                            <v-text-field class="lara-field" variant="outlined"
                                          v-model="state.username" :counter="32" label="Username"></v-text-field>
                            <v-textarea class="lara-field mt-4" variant="outlined"
                                        v-model="state.password" :counter="256" label="Password"></v-textarea>
                        </div>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-container>
                        <lara-button type="primary">Speichern</lara-button>
                    </v-container>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-btn>
</template>

<script setup lang="ts">
import {User} from "@/model/User";
import {reactive} from "vue";
import LaraButton from "@/components/basic/LaraButton.vue";

let valid = false;

const props = defineProps<{
    user: User
}>();

const emit = defineEmits<{
    save(title: String, password?: String): void
}>();

let state = reactive({
    dialog: false,
    username: props.user.username,
    password: ''
});
</script>

<style scoped>

</style>