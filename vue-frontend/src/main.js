import {createApp} from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura';
import './style.css'
import {definePreset, palette} from "@primeuix/themes";
import ToastService from "primevue/toastservice";
import router from "./router";


const app = createApp(App)

const AuraBlue = definePreset(Aura, {
    semantic: {
        primary: palette('{blue}')
    }
});
app.use(PrimeVue, {
    theme: {
        preset: AuraBlue,
        options: {
            prefix: 'p',
            darkModeSelector: 'system',
            cssLayer: false
        }
    }
});

app.use(ToastService);
app.use(router)


app.mount('#app')
