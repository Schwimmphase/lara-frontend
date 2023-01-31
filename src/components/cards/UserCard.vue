<template>
    <v-card class="d-flex flex-column lara-card" id="user-card" variant="flat">
        <v-card-title class="text-h5 d-flex">
            <span>{{ user.username }}<span class="text-grey">#{{ user.userId }}</span></span>
            <v-spacer />
            <v-chip class="lara-chip" :color="user.userCategory.color">{{ user.userCategory.name }}</v-chip>
        </v-card-title>

        <v-card-actions class="my-2 mx-4 pa-0">
            <lara-button type="primary" id="edit-button">{{ $t('admin.editUser') }}</lara-button>

            <v-spacer></v-spacer>

            <user-edit-dialog :user="user" @save="(username, password) => onDialogSave(username, password)"
                              :user-categories="userCategories" :button-text="$t('admin.userDialog.buttonEdit')"
                              :password-change="true">
                <v-btn size="small" color="surface-variant" variant="text" icon="mdi-pencil"></v-btn>
            </user-edit-dialog>
            <v-btn size="small" color="red" variant="text" icon="mdi-delete"
                   v-if="deletable" @click="$emit('delete')">
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import type {User} from "@/model/User";
import LaraButton from "@/components/basic/LaraButton.vue";
import UserEditDialog from "@/components/dialogs/UserDialog.vue";
import type {UserCategory} from "@/model/UserCategory";
import {reactive} from "vue";

const state = reactive({
    editDialog: false
})

defineProps<{
    user: User,
    deletable: boolean,
    userCategories: UserCategory[]
}>();

const emits = defineEmits<{
    (e: 'delete'): void
    (e: 'update', username: String, userCategory: UserCategory, password?: String): void
}>();

function onDialogSave(username: String, userCategory: UserCategory, password?: String) {
    state.editDialog = false;
    emits('update', username, userCategory, password);
}
</script>

<style scoped>
#user-card {
    width: 400px;
}

#edit-button {
    min-width: 150px;
}
</style>