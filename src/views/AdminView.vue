<template>
    <v-container id="container" class="w-75">
        <h1 class="text-h3 font-weight-bold">{{ $t('admin.greeting', { name: currentUser!.username }) }}</h1>

        <div class="d-flex flex-row gap-8 mt-8">
            <user-dialog :button-text="$t('admin.userDialog.buttonCreate')" :password-change="false"
                         :user-categories="userCategories"
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
                              :selected-organizers="selectedOrganizers" @organize="onOrganize"
                              @remove-organizer="(name) => onRemoveOrganizer(name)">
                <template v-slot:users>
                    <user-card v-for="(user,index) in state.users" :user="user" :key="index" :deletable="true" :user-categories="userCategories"
                               @delete="onDeleteUser(user)"
                               @update="(username, category, password) => onUpdateUser(user, username, category, password)">
                    </user-card>
                </template>

                <template v-slot:organizer-tags>
                    <div id="tag-select" class="mt-4">
                        <v-select class="lara-field" :label="$t('admin.organize.userCategories')"
                                  variant="outlined" :items="userCategoriesStrings" multiple clearable>
                            <template v-slot:selection="{ item, index }">
                                <v-chip class="lara-chip" :color="userCategories.filter(category => category.name === item.title)[0].color">
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

const userCategories = [testUserCategory1, testUserCategory2];

const organizeSlots = [{ id: "organizer-tags", name: "Tags" }];

const selectedOrganizers = [{ name: "Tag", value: "Cooler Typ, das ist ein sehr sehr sehr langer Tag-Name" }];

const userCategoriesStrings = computed<string[]>(() => {
    let strings: string[] = [];
    for (let userCategory of userCategories) {
        strings.push(userCategory.name)
    }
    return strings;
})

let currentUser = useCurrentUserStore().getCurrentUser;

let state: { loading: boolean, users: User[] } = reactive({
    loading: true,
    users: []
});

let getUsers = async (organizers: Organizer[]) => {
    let users = await AdminApiHandler.getUsers(organizers);
    console.log(users)
    users.forEach(user => state.users.push(user));
    state.loading = false;
}
getUsers([]);

function onCreateUser(username: string, userCategory: UserCategory, password?: string) {
    if (!username || !password || !userCategory) {
        if (!username) console.error("Username was not defined");
        if (!password) console.error("Password was not defined");
        if (!userCategory) console.error("User Category was not defined");
        return;
    }
    
    console.debug("new user: username:", username, "- password:", password, "- userCategory:", userCategory.name);
    
    AdminApiHandler.createUser(username, password, userCategory);
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
