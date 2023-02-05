<script setup lang="ts">
import { AdminApiHandler } from '@/api/Admin/AdminApiHandler';
import { PaperApiHandler } from '@/api/Paper/PaperApiHandler';
import { Organizer } from '@/model/Organizer';

import LaraButton from '@/components/basic/LaraButton.vue';
import NewUserCategoryDialog from '@/components/dialogs/NewUserCategoryDialog.vue';

let createCategory = (name: string, color: string) => {
    let response = AdminApiHandler.createUserCategory(name, color);
    console.log(response);
}

let getCategories = async () => {
    console.debug("User Categories")
    let response = AdminApiHandler.getUserCategories();
    console.log(response)

    // TODO backenddddd
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
    </div>

</template>