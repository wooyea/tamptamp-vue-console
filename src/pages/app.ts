import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import App from './app.vue';
import router from '../router';

const app = createApp(App);

app.use(Antd);
app.use(router);
app.mount('#app');
