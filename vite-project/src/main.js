import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import i18n from './i18n';
import { createPinia } from 'pinia'


const app = createApp(App)
const pinia = createPinia()


app.use(router)
app.use(i18n)
app.use(pinia)


router.isReady().then(() => {
    app.mount('#app');
});