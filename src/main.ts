import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/css/global.css';
import './assets/css/variables.css';
import 'ant-design-vue/dist/antd.css';
import Antd from 'ant-design-vue';

createApp(App).use(store).use(router).use(Antd).mount('#app')
