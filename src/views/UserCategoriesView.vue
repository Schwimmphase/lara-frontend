<script setup lang="ts">
import { AdminApiHandler } from '@/api/Admin/AdminApiHandler';
import { PaperApiHandler } from '@/api/Paper/PaperApiHandler';
import { Organizer } from '@/model/Organizer';

import LaraButton from '@/components/basic/LaraButton.vue';
import NewUserCategoryDialog from '@/components/dialogs/NewUserCategoryDialog.vue';
import type { UserCategory } from '@/model/UserCategory';
import { reactive } from '@vue/reactivity';

let state: { categories: UserCategory[] } = reactive({
    categories: []
});

let createCategory = (name: string, color: string) => {
    console.debug(name, color);
    let response = AdminApiHandler.createUserCategory(name, color);
    console.log(response);
}

let getCategories = async () => {
    let response: UserCategory[] = await AdminApiHandler.getUserCategories();
    state.categories = response;
}

getCategories();


</script>

<template>
    <div class="mt-5 mx-5">
        <span class="text-h4 font-weight-bold">{{ $t('admin.categories.manage') }}</span>
        <div class="mt-3">
            <NewUserCategoryDialog @create="(name, color) => createCategory(name, color)">
                <LaraButton type="primary">{{ $t('admin.categories.create') }}</LaraButton>
            </NewUserCategoryDialog>
        </div>

        <div class="mt-3 d-flex">
            <v-card class="lara-card mr-3 pa-3" v-for="(categorie, index) in state.categories" :key="index">
                <v-title><span class="lara-title font-weight-bold">{{ categorie.name }}</span><span class="lara-id">#{{ categorie.id }}</span></v-title>
                <v-avatar class="ml-4" size="30" :color="categorie.color"></v-avatar>
                <v-icon class="ml-4" @click="">mdi-pencil</v-icon>
            </v-card>
            
            
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