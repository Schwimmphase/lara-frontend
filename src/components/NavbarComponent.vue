<!--
    Komponente der Navbar, <UIC1&2>
    Bietet seitenunabhängige Navigation und Funktionen
-->

<script setup lang="ts">

import router from '../router';

import { LanguageService } from '../internationalization/LanguageService';
import type { Language } from '../internationalization/Language';

import { i18n } from '../internationalization/i18n'

// Function to logout the user
function logout(): void {
    // TODO Implement: Log out the user
    console.log("logout");

    // Navigate to the login view
    router.push({ name: 'login' });
}

// Method to check, if the user is a admin
function checkAdmin(): boolean {
    let isAdmin: boolean = true;
    
    console.log("Check admin");

    return isAdmin;
}

let changeLanguage = (lang: string) => {
    console.log(lang)

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

let showLogout: boolean = true;

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
            <router-link class="ml-6 lara-navbar-link" v-if="checkAdmin()" :to="{ name: 'admin' }">{{ $t('navbar.manageUsers') }}</router-link>
            <router-link class="ml-6 lara-navbar-link" :to="{ name: 'home' }">{{ $t('navbar.home') }}</router-link>
            <span v-if="showLogout" class="ml-6 lara-navbar-link" @click="logout()">{{ $t('navbar.logout') }}</span>
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