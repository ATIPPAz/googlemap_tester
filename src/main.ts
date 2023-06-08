import './assets/main.css'
import 'vuetify/dist/vuetify.min.css'
// import Vuetify from 'vuetify'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {} from '@/plugin/googlemap'
const app = createApp(App)
// app.use(Vuetify)

app.use(router)

app.mount('#app')
