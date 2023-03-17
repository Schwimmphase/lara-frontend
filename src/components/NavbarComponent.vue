<script setup lang="ts">

import {LanguageService} from '@/internationalization/LanguageService';

import {i18n} from '@/internationalization/i18n'
import {useCurrentUserStore} from '@/stores/currentUser';
import {useOpenResearchStore} from '@/stores/openResearch';
import {useOpenPaperStore} from '@/stores/openPaper';
import router from '@/router';

// Method to navigate to homeview
let navigateToHome = (): void => {
    router.push({name: 'home'});
}

// Method to navigate to adminview
let navigateToAdmin = (): void => {
    router.push({name: 'admin'});
}

// TODO If there are more languages, then add here possible options
let changeLanguage = (lang: string) => {
    i18n.global.locale.value = lang as "en" | "de";
    localStorage.setItem('lang', lang);
}

// Method for the user to logout
let logout = (): void => {
    useOpenResearchStore().resetStore();
    useOpenPaperStore().resetStore();
    useCurrentUserStore().resetStore();

    // delete token
    let inOneSecond = new Date();
    inOneSecond.setSeconds(inOneSecond.getSeconds() + 1);
    document.cookie = "lara-token=; expires " + inOneSecond.toUTCString() + "; path=/;";
}

// Helper Methods

function isUserLoggedIn(): boolean {
    return useCurrentUserStore().getCurrentUser !== null;
}

function isUserAdmin(): boolean {
    return useCurrentUserStore().getIsAdmin;
}

let languages = LanguageService.getLanguages();


// Set the language to store
if (!localStorage.getItem('lang')) {
    localStorage.setItem('lang', i18n.global.locale.value);
} else {
    i18n.global.locale.value = localStorage.getItem('lang')! as "en" | "de";
}

</script>


<template>

    <v-app-bar :elevation="5" class="lara-navbar">
        <div class="ml-6">
            <v-app-bar-title>
                <span class="lara-icon-link lara-clickable" @click="navigateToHome" id="navbar-navigation-to-home">
                    <h2 class="font-weight-bold" id="navbar-title">lara.</h2>
                </span>
            </v-app-bar-title>
        </div>
        <v-spacer></v-spacer>
        <div>
            <span class="lara-navbar-link" id="navbar-change-language">{{ $t('navbar.changeLanguage') }}</span>

            <v-menu activator="#navbar-change-language">
                <v-list>
                    <v-list-item
                    v-for="(language, index) in languages" :key="index" :value="language.abbreviation"
                    @click="changeLanguage(language.abbreviation)" class="" :class="{ 'lara-selected': (language.abbreviation === (i18n.global.locale).value), 'lara-language-option': (language.abbreviation !== (i18n.global.locale).value) }" id="navbar-language-change-button">
                        <span>{{ language.name }}</span>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
        <div class="mr-6">
            <span @click="navigateToAdmin" class="ml-6 lara-navbar-link" v-if="isUserAdmin()" id="navbar-manage-user-button">{{ $t('navbar.manageUsers') }}</span>
            <router-link class="ml-6 lara-navbar-link" v-if="isUserLoggedIn()" :to="{ name: 'home' }" id="navbar-home">
                {{ $t('navbar.home') }}
            </router-link>
            <router-link class="ml-6 lara-navbar-link" v-if="isUserLoggedIn()" :to="{ name: 'login' }"
                         @click="logout" id="navbar-logout">
                {{ $t('navbar.logout') }}
            </router-link>
        </div>
    </v-app-bar>
</template>


<style scoped>

.lara-navbar-link {
    color: #000;
    transition: color ease-in-out 0.3s;
    text-decoration: none;
}

.lara-selected {
    color: rgb(114, 114, 114);
}

.lara-language-option {
    color: #000;
}

.lara-navbar-link:hover {
    color: rgb(125, 125, 125);
    background: none;
    cursor: pointer;
}

.lara-icon-link {
    color: #000;
    text-decoration: none;
}

.lara-icon-link:hover {
    color: #000;
}

</style>