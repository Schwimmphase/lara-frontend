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
import { User } from '@/model/User';
import router from '@/router';
import { useCurrentUserStore } from '@/stores/currentUser';
import { UserCategory } from '@/model/UserCategory';

let loginData = reactive({
    userId: "",
    password: "",
});

async function login() {
    const response = await AuthApiHandler.login(loginData.userId, loginData.password);
    console.log(response);
    const token = response[0] as string;
    const user = JSON.parse(response[1] as string);
    
    // create cookie for token
    let date = new Date();
    date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
    document.cookie = "lara-token=" + token + ";expires=" + date.toUTCString() + ";path=/";
    console.log(atob(token.split(".")[1]));
    
    // store user & redirect to HomeView
    useCurrentUserStore().setCurrentUser(new User(user.username, user.userId, user.password, new UserCategory(user.UserCategory.id, user.UserCategory.color, user.UserCategory.name)));
    console.log(useCurrentUserStore().getCurrentUser);
    router.push({ name: 'home'});
}
</script>

<style>
#login-form {
    width: 300px;
}
</style>
