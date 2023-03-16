<script setup lang="ts">
import {AdminApiHandler} from '@/api/Admin/AdminApiHandler';

import LaraButton from '@/components/basic/LaraButton.vue';
import NewUserCategoryDialog from '@/components/dialogs/NewUserCategoryDialog.vue';
import EditUserCategoryDialog from '@/components/dialogs/EditUserCategoryDialog.vue';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';

import type {UserCategory} from '@/model/UserCategory';
import {reactive} from '@vue/reactivity';
import {i18n} from "@/internationalization/i18n";

document.title = i18n.global.t("pageTitles.admin") + " - lara";

let state: { categories: UserCategory[], initialLoading: boolean, categoryLoading: boolean } = reactive({
    categories: [],
    initialLoading: true,
    categoryLoading: true,
});


let createCategory = async (name: string, color: string) => {
    console.debug(name, color);
    await AdminApiHandler.createUserCategory(name, color);
    
    await getCategories();
}

let getCategories = async () => {
    state.categories = await AdminApiHandler.getUserCategories();
    state.categoryLoading = false;
}


let updateCategory = async (category: UserCategory, name: string, color: string) => {
    state.categoryLoading = true;
    await AdminApiHandler.updateUserCategory(category, name, color);
    await getCategories();
}

let deleteCategory = async (category: UserCategory, decision: boolean) => {
    if (!decision) return;
    state.categoryLoading = true;
    try {
        await AdminApiHandler.deleteUserCategory(category);
        await getCategories();
    } catch (ignored) {}
    state.categoryLoading = false;
}

getCategories();
state.initialLoading = false;

</script>

<template>
    <div class="d-flex justify-center" v-if="!state.initialLoading">
        <div class="mt-5 mx-5 w-75">
            <span class="text-h4 font-weight-bold">{{ $t('admin.categories.manage') }}</span>
            <div class="mt-3">
                <NewUserCategoryDialog @create="(name, color) => createCategory(name, color)">
                    <LaraButton type="primary">{{ $t('admin.categories.create') }}</LaraButton>
                </NewUserCategoryDialog>
            </div>

            <div class="mt-3" v-if="!state.categoryLoading">
                <v-card class="lara-card mt-3 pa-3 d-flex" v-for="(category) in state.categories" :key="category.toString()">
                    <v-title><span class="lara-title font-weight-bold">{{ category.name }}</span><span class="lara-id">#{{ category.id }}</span></v-title>
                    <v-spacer></v-spacer>
                    <v-avatar class="ml-4" size="30" :color="category.color"></v-avatar>
                    <EditUserCategoryDialog :category="category" @edit="(category, name, color) => updateCategory(category, name, color)">
                        <v-icon class="ml-4 lara-clickable" :title="$t('words.edit')">mdi-pencil</v-icon>
                    </EditUserCategoryDialog>
                    
                    <ConfirmDialog @close="(decision) => deleteCategory(category, decision)">
                        <v-icon color="red" class="ml-4 lara-clickable" :title="$t('words.delete')">mdi-trash-can</v-icon>
                    </ConfirmDialog>
                </v-card>
            </div>

            <div v-if="state.categoryLoading" class="mt-5 w-100 h-100 d-flex align-center justify-center">
                <v-progress-circular indeterminate></v-progress-circular>
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