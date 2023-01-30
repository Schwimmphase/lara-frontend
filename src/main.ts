import { createApp } from 'vue';

// Pinia for shared storage
import { createPinia } from 'pinia';
import piniaPluginPersistedState from "pinia-plugin-persistedstate";

import { i18n } from './internationalization/i18n';

import App from './App.vue';
import router from './router';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import {aliases, mdi} from "vuetify/iconsets/mdi";
import {fa} from "vuetify/iconsets/fa";
import "@mdi/font/css/materialdesignicons.css";

import './assets/main.css';

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: "mdi",
        aliases,
        sets: {
            mdi,
            fa,
        },
    }
});

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

app.use(pinia);
app.use(router);
app.use(vuetify);
app.use(i18n);

app.mount('#app');
