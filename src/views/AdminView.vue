<template>
    <v-container id="container" class="w-75">
        <h1 class="text-h3 font-weight-bold">{{ $t('admin.greeting', { name: 'Bernd' }) }}</h1>

        <div class="d-flex flex-row gap-8 mt-8">
            <lara-button type="primary" id="create-user-button" class="w-100">{{ $t('admin.createUser') }}</lara-button>
            <lara-button type="secondary" id="create-category-button">{{ $t('admin.createCategory') }}</lara-button>
        </div>

        <h2 class="text-h4 font-weight-bold mt-8">{{ $t('admin.userOverview') }}</h2>

        <organizable-list :slots="[{ id: 'users'}]">
            <template v-slot:users>
                <user-card v-for="user in users" :user="user" :deletable="true" :user-categories="categories"
                           @delete="onUserDelete(user)" @update="(username, password) => onUpdateUser(user, username, password)">
                </user-card>
            </template>
        </organizable-list>
    </v-container>
</template>
<script setup lang="ts">
import LaraButton from "@/components/basic/LaraButton.vue";
import OrganizableList from "@/components/basic/OrganizableList.vue";
import UserCard from "@/components/cards/UserCard.vue";

import {testResearch, testUserCategory} from "@/model/_testResearch";
import type {User} from "@/model/User";

const users = [testResearch.user, testResearch.user, testResearch.user];

const categories = [testUserCategory]

function onUserDelete(user: User) {
    console.debug("delete user;");
    console.debug(user);
}

function onUpdateUser(user: User, newName: String, newPassword?: String) {
    console.debug("update user: newName: " + newName + " - newPassword: " + newPassword);
    console.debug(user);
}
</script>

<style>
#container {
    min-width: 300px;
}

#create-user-button {
    max-width: 250px;
    min-width: 150px;
}

#create-category-button {
    min-width: 250px;
    max-width: 300px;
}
</style>