import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import i18n from './i18n';
import { createPinia } from 'pinia' 
//Import Mixpanel SDK
import mixpanel from "mixpanel-browser";
 
// Near entry of your product, init Mixpanel
mixpanel.init("d41fbc564b7544ce2d7c92cb6d8beb63", {
  debug: true,
  track_pageview: true,
  persistence: "localStorage",
});


const app = createApp(App)
const pinia = createPinia()


app.use(router)
app.use(i18n)
app.use(pinia)


router.isReady().then(() => {
    app.mount('#app');
});