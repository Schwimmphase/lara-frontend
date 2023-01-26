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
import LaraButton from '@/components/basic/LaraButton.vue';
import { reactive } from 'vue';
import { AuthApiHandler } from '@/api/Auth/AuthApiHandler';
import { plainToInstance } from 'class-transformer';
import { User } from '@/model/User';
import router from '@/router';
import { useCurrentUserStore } from '@/stores/currentUser';

let loginData = reactive({
    userId: "",
    password: "",
});

async function login() {
    const response = await AuthApiHandler.login(loginData.userId, loginData.password);
    const token = response[0] as string;
    const user = plainToInstance(User.constructor(), response[1]);
    
    // create cookie for token
    let date = new Date();
    date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
    document.cookie = "lara-token=" + token + ";expires=" + date.toUTCString() + ";path=/";
    console.log(atob(token.split(".")[1]));
    
    // store user & redirect to HomeView
    useCurrentUserStore().setCurrentUser(plainToInstance(User.constructor(), user) as unknown as User);
    router.push({ name: 'home'});
}
</script>

<style>
#login-form {
    width: 300px;
}
</style>
