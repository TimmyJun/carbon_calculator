import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhTw from 'element-plus/es/locale/lang/zh-tw'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 全局樣式
import './assets/styles/main.scss'

const app = createApp(App)

// 註冊所有圖標
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(store)
   .use(router)
   .use(ElementPlus, {
     locale: zhTw,
     size: 'default'
   })
   .mount('#app') 