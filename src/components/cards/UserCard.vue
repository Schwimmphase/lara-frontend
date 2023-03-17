<template>
    <v-card class="d-flex flex-column lara-card user-card" :id="getCardId(user.username)" variant="flat">
        <v-card-title class="text-h5 d-flex">
            <span class="username" :id="getCardId(user.username) + '-username'">{{ user.username }}<span class="text-grey" :id="getCardId(user.username) + '-userid'">#{{ user.userId }}</span></span>
            <v-spacer />
            <v-chip class="lara-chip user-tag" :color="user.userCategory.color" :id="getCardId(user.username) + '-category'">
                {{ user.userCategory.name }}
            </v-chip>
        </v-card-title>

        <v-card-actions class="my-2 mx-4 pa-0">
            <user-edit-dialog :user="user" @save="(username, category, password) => onDialogSave(username, category, password)"
                              :user-categories="userCategories" :button-text="$t('admin.userDialog.buttonEdit')"
                              :password-change="true">
                <lara-button type="primary" :id="getCardId(user.username) + '-edit'"  class="edit-user-button">
                    {{ $t('admin.editUser') }}
                </lara-button>
            </user-edit-dialog>

            <v-spacer></v-spacer>

            <confirm-dialog @close="decision => { if (decision) $emit('delete') }">
                <v-btn size="small" color="red" variant="text" icon="mdi-delete" :title="$t('words.delete')" v-if="deletable"
                       :id="getCardId(user.username) + '-delete'">
                </v-btn>
            </confirm-dialog>
        </v-card-actions>
    </v-card>
</template>


<script setup lang="ts">
import type {User} from "@/model/User";
import LaraButton from "@/components/basic/LaraButton.vue";
import UserEditDialog from "@/components/dialogs/UserDialog.vue";
import type {UserCategory} from "@/model/UserCategory";
import {reactive} from "vue";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";

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

function getCardId(name: string): string {
    let id = "user-card-";
    return id + name.toLowerCase();
}

</script>


<style scoped>
.user-card {
    width: 400px;
}

.username {
    width: 275px;
    overflow-x: hidden;
    text-overflow: ellipsis;
}

.user-tag {
    max-width: 100px;
    overflow-x: hidden !important;
    text-overflow: ellipsis !important;
    display: inline-block;
}

.edit-user-button {
    min-width: 150px;
}
</style>