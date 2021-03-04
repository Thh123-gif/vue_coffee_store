import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/animate.min.css'
//全局注册 axios
// import axios from 'axios';
// import vueAxios from 'vue-axios';
import './plugins/vant.js'
import 'lib-flexible/flexible'
import VueCookies from 'vue-cookies'


import { NavBar,Icon,Form,Button,Field,Popup,Toast,Search,Swipe, SwipeItem,Lazyload,Tabbar, TabbarItem,Tag,GoodsAction, GoodsActionIcon, GoodsActionButton,Checkbox,SwipeCell,Stepper,SubmitBar,List,AddressList,Empty,AddressEdit,Cell,Dialog,TreeSelect,Tab,Tabs,Uploader } from 'vant';

Vue.use(NavBar).use(Icon).use(Form).use(Button).use(Field).use(Popup).use(Toast).use(Search).use(Swipe).use(SwipeItem).use(Lazyload).use(Tabbar).use(TabbarItem).use(Tag).use(GoodsAction).use(GoodsActionButton).use(GoodsActionIcon).use(Checkbox).use(SwipeCell).use(Stepper).use(SubmitBar).use(List).use(AddressList).use(Empty).use(AddressEdit).use(Cell).use(Dialog).use(TreeSelect).use(Tab).use(Tabs).use(Uploader);

// Vue.use(vueAxios).use(axios)
Vue.use(VueCookies);

axios.interceptors.request.use(config => {
  if (config.method === 'post') {
    let paramsStr = '';
    for (let key in config.data) {
      paramsStr += `${key}=${config.data[key]}&`;
    }
    config.data = paramsStr.slice(0, -1);
  }
  return config;
})

Vue.config.productionTip = false

Vue.prototype.baseURL = "http://www.kangliuyong.com:10002"
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA='

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
