import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhTw from 'element-plus/es/locale/lang/zh-tw'

// 全局樣式
import './assets/styles/main.scss'

const app = createApp(App)

app.use(store)
   .use(router)
   .use(ElementPlus, {
     locale: zhTw,
     size: 'default'
   })
   .mount('#app') 