<template>
    <v-container id="login-form">
        <h1 class="text-h3 mt-16 text-sm-center font-weight-bold">{{ $t('login.login') }}</h1>

        <v-form class="mt-8">
            <v-text-field class="lara-field" variant="outlined" :label=" $t('login.userId') "
                          v-model="loginData.userId" @keyup.enter="login"></v-text-field>
            <v-text-field class="lara-field" variant="outlined" :label=" $t('login.password') "
                          v-model="loginData.password" @keyup.enter="login"></v-text-field>
            <lara-button type="primary" @click="login">{{ $t('login.button') }}</lara-button>
        </v-form>
    </v-container>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import LaraButton from '@/components/basic/LaraButton.vue';
import { AuthApiHandler } from '@/api/Auth/AuthApiHandler';
import { plainToInstance } from 'class-transformer';
import { User } from '@/model/User';
import { useCurrentUserStore } from '@/stores/currentUser';
import router from '@/router';

let loginData = reactive({
    userId: "",
    password: "",
});

async function login() {
    const [token, user] = await AuthApiHandler.login(loginData.userId, loginData.password);

    // create cookie for token
    let date = new Date();
    date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
    document.cookie = "lara-token=" + token + ";expires=" + date.toUTCString() + ";path=/";
    
    // store user & redirect to HomeView
    console.log(atob(token.split(".")[1]));
    useCurrentUserStore().setCurrentUser(user);
    router.push({ name: 'home'});
}
</script>

<style>
#login-form {
    width: 300px;
}
</style>
