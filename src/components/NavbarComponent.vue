<!--
    Komponente der Navbar, <UIC1&2>
    Bietet seitenunabhängige Navigation und Funktionen
-->

<script setup lang="ts">

import { LanguageService } from '../internationalization/LanguageService';

import { i18n } from '../internationalization/i18n'
import { useCurrentUserStore } from '@/stores/currentUser';
import { useOpenResearchStore } from '@/stores/openResearch';
import { useOpenPaperStore } from '@/stores/openPaper';

// function to logout the user
function logout(): void {
    useOpenResearchStore().resetStore();
    useOpenPaperStore().resetStore();
    useCurrentUserStore().resetStore();

    // delete token
    let inOneSecond = new Date();
    inOneSecond.setSeconds(inOneSecond.getSeconds() + 1);
    document.cookie = "lara-token=; expires " + inOneSecond.toUTCString() + "; path=/;";
}

function isUserLoggedIn(): boolean {
    return useCurrentUserStore().getCurrentUser !== null;
}

function isUserAdmin(): boolean {
    return useCurrentUserStore().getIsAdmin;
}

let changeLanguage = (lang: string) => {
    switch (lang) {
        case 'de':
            i18n.global.locale.value = 'de';        
            break;

        case 'en':
            i18n.global.locale.value = 'en';        
            break;
        
        default:
            i18n.global.locale.value = 'en';
    }
}

let languages = LanguageService.getLanguages();

</script>


<template>

    <v-app-bar :elevation="5" class="lara-navbar">
        <div class="ml-6">
            <v-app-bar-title>
                <router-link :to="{ name: 'home' }" class="lara-icon-link">
                    <h2 class="font-weight-bold">lara.</h2>
                </router-link>
            </v-app-bar-title>
        </div>
        <v-spacer></v-spacer>
        <div>
            <span id="menu-activator" class="lara-navbar-link">{{ $t('navbar.changeLanguage') }}</span>
            <!--<v-btn id="menu-activator" class="lara-navbar-link">{{ $t('navbar.changeLanguage') }}</v-btn>-->

            <v-menu activator="#menu-activator">
                <v-list>
                    <v-list-item
                    v-for="(language, index) in languages" :key="index" :value="language.abbreviation"
                    @click="changeLanguage(language.abbreviation)"
                    >
                        <span>{{ language.name }}</span>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
        <div class="mr-6">
            <router-link class="ml-6 lara-navbar-link" v-if="isUserAdmin()" :to="{ name: 'admin' }">{{ $t('navbar.manageUsers') }}</router-link>
            <router-link class="ml-6 lara-navbar-link" v-if="isUserLoggedIn()" :to="{ name: 'home' }">{{ $t('navbar.home') }}</router-link>
            <router-link class="ml-6 lara-navbar-link" v-if="isUserLoggedIn()" :to="{ name: 'login' }" @click.native="logout">{{ $t('navbar.logout') }}</router-link>
        </div>
    </v-app-bar>

</template>


<style scoped>

.lara-navbar-link {
    color: #000;
    transition: color ease-in-out 0.3s;
    text-decoration: none;
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