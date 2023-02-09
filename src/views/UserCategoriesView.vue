<script setup lang="ts">
import { AdminApiHandler } from '@/api/Admin/AdminApiHandler';
import { PaperApiHandler } from '@/api/Paper/PaperApiHandler';
import { Organizer } from '@/model/Organizer';

import LaraButton from '@/components/basic/LaraButton.vue';
import NewUserCategoryDialog from '@/components/dialogs/NewUserCategoryDialog.vue';
import EditUserCategoryDialog from '@/components/dialogs/EditUserCategoryDialog.vue';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';

import type { UserCategory } from '@/model/UserCategory';
import { reactive } from '@vue/reactivity';

let state: { categories: UserCategory[] } = reactive({
    categories: []
});

let createCategory = async (name: string, color: string) => {
    console.debug(name, color);
    let response = await AdminApiHandler.createUserCategory(name, color);
    
    getCategories();
}

let getCategories = async () => {
    let response: UserCategory[] = await AdminApiHandler.getUserCategories();
    state.categories = response;
}


let updateCategory = async (category: UserCategory, name: string, color: string) => {
    let response = await AdminApiHandler.updateUserCategory(category, name, color);
    
    getCategories();
}

let deleteCategory = async (category: UserCategory, decision: boolean) => {
    if (!decision) return;
    let response = await AdminApiHandler.deleteUserCategory(category);

    getCategories();
}

getCategories();

</script>

<template>
    <div class="d-flex justify-center">
        <div class="mt-5 mx-5 w-75">
            <span class="text-h4 font-weight-bold">{{ $t('admin.categories.manage') }}</span>
            <div class="mt-3">
                <NewUserCategoryDialog @create="(name, color) => createCategory(name, color)">
                    <LaraButton type="primary">{{ $t('admin.categories.create') }}</LaraButton>
                </NewUserCategoryDialog>
            </div>

            <div class="mt-3">
                <v-card class="lara-card mt-3 pa-3 d-flex" v-for="(category) in state.categories" :key="category.toString()">
                    <v-title><span class="lara-title font-weight-bold">{{ category.name }}</span><span class="lara-id">#{{ category.id }}</span></v-title>
                    <v-spacer></v-spacer>
                    <v-avatar class="ml-4" size="30" :color="category.color"></v-avatar>
                    <EditUserCategoryDialog :category="category" @edit="(category, name, color) => updateCategory(category, name, color)">
                        <v-icon class="ml-4 lara-clickable">mdi-pencil</v-icon>
                    </EditUserCategoryDialog>
                    
                    <ConfirmDialog @close="(decision) => deleteCategory(category, decision)">
                        <v-icon color="red" class="ml-4 lara-clickable">mdi-trash-can</v-icon>
                    </ConfirmDialog>
                </v-card>
                
                
            </div>
        </div>
    </div>
</template>

<style scoped>

.lara-id {
    color: #bcbcbc;
}

.lara-title, .lara-id {
    font-size: 18px;
}


</style>