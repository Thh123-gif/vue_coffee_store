import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    shopbagCount:0
  },
  getters:{
  },
  mutations: {
    // 改变商品数目
    changeShopbagCount(state,value){
      state.shopbagCount = value;
    }
  },
  actions: {
  },
  modules: {
  }
})
