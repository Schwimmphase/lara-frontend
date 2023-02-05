<template>
    <v-card class="d-flex flex-column lara-card" id="user-card" variant="flat">
        <v-card-title class="text-h5 d-flex">
            <span id="user-card-title">{{ user.username }}<span class="text-grey">#{{ user.userId }}</span></span>
            <v-spacer />
            <v-chip class="lara-chip" :color="user.userCategory.color">{{ user.userCategory.name }}</v-chip>
        </v-card-title>

        <v-card-actions class="my-2 mx-4 pa-0">
            <user-edit-dialog :user="user" @save="(username, password) => onDialogSave(username, password)"
                              :user-categories="userCategories" :button-text="$t('admin.userDialog.buttonEdit')"
                              :password-change="true">
                <lara-button type="primary" id="edit-button">{{ $t('admin.editUser') }}</lara-button>
            </user-edit-dialog>

            <v-spacer></v-spacer>

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
    (e: 'update', username: string, userCategory: UserCategory, password?: string): void
}>();

function onDialogSave(username: string, userCategory: UserCategory, password?: string) {
    state.editDialog = false;
    emits('update', username, userCategory, password);
}
</script>


<style scoped>
#user-card {
    width: 400px;
}

#user-card-title {
    width: 275px;
    overflow-x: hidden;
    text-overflow: ellipsis;
}

#edit-button {
    min-width: 150px;
}
</style>