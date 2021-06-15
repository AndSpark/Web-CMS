import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';

import router from './router'
import store from './store'

const app = createApp(App)
	.use(store)
	.use(router)
	.use(ElementPlus)
	.mount('#app')


export default app
