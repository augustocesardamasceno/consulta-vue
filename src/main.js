import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'; // Import CSS do BootstrapVue 3






const app = createApp(App);

app.use(router);
app.use(Toast, { timeout: 5000 });
app.mount('#app');
