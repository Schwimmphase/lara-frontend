<template>
    <v-container id="container" class="w-75">
        <h1 class="text-h3 font-weight-bold">{{ $t('admin.greeting', { name: currentUser!.username }) }}</h1>

        <div class="d-flex flex-row gap-8 mt-8">
            <user-dialog :button-text="$t('admin.userDialog.buttonCreate')" :password-change="false"
                         :user-categories="categories"
                         @save="(username, category, password) => onUserCreate(username, category, password)">
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
                              :selected-organizers="selectedOrganizers" @organize="onOrganize"
                              @remove-organizer="(name) => onRemoveOrganizer(name)">
                <template v-slot:users>
                    <user-card v-for="(user,index) in state.users" :user="user" :key="index" :deletable="true" :user-categories="categories"
                               @delete="onUserDelete(user)"
                               @update="(username, category, password) => onUpdateUser(user, username, category, password)">
                    </user-card>
                </template>

                <template v-slot:organizer-tags>
                    <div id="tag-select" class="mt-4">
                        <v-select class="lara-field" :label="$t('admin.organize.userCategories')"
                                  variant="outlined" :items="userCategoriesStrings" multiple clearable>
                            <template v-slot:selection="{ item, index }">
                                <v-chip class="lara-chip" :color="categories.filter(category => category.name === item.title)[0].color">
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

import {testResearch, testUserCategory} from "@/model/_testResearch";
import type {User} from "@/model/User";
import {computed, reactive} from "vue";
import UserDialog from "@/components/dialogs/UserDialog.vue";
import type {UserCategory} from "@/model/UserCategory";
import { useCurrentUserStore } from "@/stores/currentUser";
import { useOpenPaperStore } from "@/stores/openPaper";
import { useOpenResearchStore } from "@/stores/openResearch";
import { AdminApiHandler } from "@/api/Admin/AdminApiHandler";
import type { Organizer } from "@/model/Organizer";

// reset open research/paper store
useOpenResearchStore().resetStore();
useOpenPaperStore().resetStore();

const categories = [testUserCategory];

const organizeSlots = [{ id: "organizer-tags", name: "Tags" }];

const selectedOrganizers = [{ name: "Tag", value: "Cooler Typ, Das ist ein sehr sehr sehr langer Tag-Name" }];

const userCategoriesStrings = computed<string[]>(() => {
    let strings: string[] = [];
    for (let userCategory of categories) {
        strings.push(userCategory.name)
    }
    return strings;
})

let currentUser = useCurrentUserStore().getCurrentUser;

let state: { loading: boolean, users: User[] } = reactive({
    loading: true,
    users: []
});

let getUsers = (organizers: Organizer[]) => {
    let response = AdminApiHandler.getUsers([]);

    console.log(response);
}

getUsers([]);

function onUserCreate(username: string, userCategory: UserCategory, password?: string) {
    console.debug("new user: username: " + username + " - category: " + userCategory.name + " - password: " + password);

    if (password == undefined) {
        console.error("Password is not defined");
        return;
    }

    AdminApiHandler.createUser(username, password, userCategory)
}

function onUserDelete(user: User) {
    console.debug("delete user:");
    console.debug(user);
}

function onUpdateUser(user: User, newName: string, userCategory: UserCategory, newPassword?: string) {
    console.debug("update user: newName: " + newName + " - newPassword: " + newPassword);
    console.debug(user);
}

function onOrganize() {
    console.debug("organize");
}

function onRemoveOrganizer(name: string) {
    console.debug("organizer removed: " + name);
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
