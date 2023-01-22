import { createApp } from 'vue'

// Pinia for shared storage
import { createPinia } from 'pinia'

// i18n for internatonalization
import { createI18n } from 'vue-i18n';
import { messages } from '@/internationalization/translations';

import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import './assets/main.css'

import {aliases, mdi} from "vuetify/iconsets/mdi";
import {fa} from "vuetify/iconsets/fa";
import "@mdi/font/css/materialdesignicons.css";

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
})

const i18n = createI18n({
    legacy: false,
    locale: 'de',
    fallbackLocale: 'de',
    messages
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(i18n)

app.mount('#app')
