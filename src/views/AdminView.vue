<template>
    <v-container id="container" class="w-75">
        <h1 class="text-h3 font-weight-bold">{{ $t('admin.greeting', { name: state.currentUser?.username }) }}</h1>

        <div v-if="!state.loading && state.categories != undefined" class="d-flex flex-row gap-8 mt-8">
            <user-dialog :button-text="$t('admin.userDialog.buttonCreate')" :password-change="false"
                         :user-categories="state.categories"
                         @save="(username, category, password) => onCreateUser(username, category, password)">
                <lara-button type="primary" id="create-user-button" class="w-100">{{ $t('admin.createUser') }}</lara-button>
            </user-dialog>

            <router-link :to="{ name: 'userCategories' }">
                <lara-button type="secondary" id="create-category-button">{{ $t('admin.editCategories') }}</lara-button>
            </router-link>
        </div>

        <h2 class="text-h4 font-weight-bold mt-8">{{ $t('admin.userOverview') }}</h2>

        <div class="mt-4" v-if="state.loading">
            <v-progress-circular indeterminate size="70"></v-progress-circular>
        </div>


        <div class="mt-4" v-if="!state.loading">
            <organizable-list :slots="[{ id: 'users'}]" :organize-slots="organizeSlots"
                              :selected-organizers="organizerState.selectedOragnizers" @organize="onOrganize"
                              @remove-organizer="(name) => onRemoveOrganizer(name)">
                <template v-slot:users v-if="state.users != undefined && state.categories != undefined">
                    <user-card v-for="(user,index) in state.users" :user="user" :key="index" :deletable="true" :user-categories="state.categories"
                               @delete="onDeleteUser(user)"
                               @update="(username, category, password) => onUpdateUser(user, username, category, password)">
                    </user-card>
                </template>

                <template v-slot:organizer-tags>
                    <div id="tag-select" class="mt-4">
                        <v-select class="lara-field" :label="$t('admin.organize.userCategories')"
                                  variant="outlined" :items="userCategoriesStrings" multiple clearable v-model="organizerState.tags">
                            <template v-slot:selection="{ item, index }">
                                <v-chip class="lara-chip" :color="state.categories?.filter(category => category.name === item.title)[0].color">
                                    {{ item.title }}
                                </v-chip>
                            </template>
                        </v-select>
                    </div>
                </template>
            </organizable-list>
        </div>
    </v-container>
</template>


<script setup lang="ts">

import LaraButton from "@/components/basic/LaraButton.vue";
import OrganizableList from "@/components/basic/OrganizableList.vue";
import UserCard from "@/components/cards/UserCard.vue";

import { testUserCategory1, testUserCategory2} from "@/model/_testResearch";
import type { User } from "@/model/User";
import {computed, reactive} from "vue";
import UserDialog from "@/components/dialogs/UserDialog.vue";
import type {UserCategory} from "@/model/UserCategory";
import { useCurrentUserStore } from "@/stores/currentUser";
import { useOpenPaperStore } from "@/stores/openPaper";
import { useOpenResearchStore } from "@/stores/openResearch";
import { AdminApiHandler } from "@/api/Admin/AdminApiHandler";
import { Organizer } from "@/model/Organizer";

const userCategories = [testUserCategory1, testUserCategory2];

const organizeSlots = [{ id: "organizer-tags", name: "Tags" }];

const userCategoriesStrings = computed<string[]>(() => {
    let strings: string[] = [];
    for (let userCategory of state.categories) {
        strings.push(userCategory.name)
    }
    return strings;
})

let state: { loading: boolean, users: User[], categories: UserCategory[], currentUser: User | null } = reactive({
    loading: true,
    currentUser: useCurrentUserStore().currentUser,
    users: [],
    categories: [],
});

let organizerState: { tags: string[], selectedOragnizers: Organizer[] } = reactive({
    tags: [],
    selectedOragnizers: []
});

let getUsers = async (organizers: Organizer[]) => {
    let users = await AdminApiHandler.getUsers(organizers);
    state.users = users;

    console.log(users);
}

let getCategories = async () => {
    let response = await AdminApiHandler.getUserCategories();
    state.categories = response;

    console.log(state.categories)
}
 
getCategories();
getUsers([]);
state.loading = false;

function onCreateUser(username: string, userCategory: UserCategory, password?: string) {
    if (!username || !password || !userCategory) {
        if (!username) console.error("Username was not defined");
        if (!password) console.error("Password was not defined");
        if (!userCategory) console.error("User Category was not defined");
        return;
    }

    console.log("pass")
    console.log(password);
    
    AdminApiHandler.createUser(username, password, userCategory);

    // TODO Organizers einfügen
    getUsers([]);
}

function onDeleteUser(user: User) {
    confirm("Are you sure?"); // TODO: add "are you sure?" alert
    console.debug("delete user:", user);
    state.users.splice(state.users.indexOf(user), 1); // TODO: check if this removes the correct user
    console.debug(state.users);
    AdminApiHandler.deleteUser(user);
}

function onUpdateUser(user: User, newName: string, newUserCategory: UserCategory, newPassword?: string) {
    console.debug("update user: newName:", newName, "- newPassword:", newPassword, "- newUserCategory:", newUserCategory.name);

    user.username = newName;
    user.userCategory = newUserCategory;
    if (newPassword == undefined) {
        AdminApiHandler.updateUser(user, newName, user.password, newUserCategory);
    } else {
        AdminApiHandler.updateUser(user, newName, newPassword, newUserCategory);
        user.password = newPassword;
    }

    console.debug(user);
}

function onOrganize() {
    // clear currently selected oranizers
    organizerState.selectedOragnizers = [];

    // build tags organizer
    let tagsValue = "";
    let separator = "";
    organizerState.tags.forEach(element => {
        tagsValue += separator;
        tagsValue += element;
        
        separator = ",";
    });

    let tagsFilter = new Organizer("tags-filter", tagsValue); // TODO Komma mit Leerzeichen oder ohne??

    organizerState.selectedOragnizers.push(tagsFilter);

    console.debug(tagsFilter);



    getUsers(organizerState.selectedOragnizers);

    console.debug("organize");
}

function onRemoveOrganizer(name: string) {
    let newOrganizers = organizerState.selectedOragnizers.filter((organizer) => {
        return name !== organizer.name;
    });

    organizerState.selectedOragnizers = newOrganizers;
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

#tag-select {
    width: 100%;
    min-width: 250px;
    max-width: 350px;
}

</style>