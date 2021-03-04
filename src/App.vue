<template>
  <div id="app">
    <!-- 底部导航 -->
    <ButtomNav v-show="$route.meta.isBottom"></ButtomNav>
    <router-view />
  </div>
</template>

<script>
import ButtomNav from './components/ButtomNav'
export default {
  name: 'app',
  components: {
    ButtomNav
  },
}
</script>

<style>
/* 主题色#854C21 账号 13555622640 密码 admin1*/
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body {
  margin: 0;
  padding: 0;
}
.auto-img {
  width: 100%;
}
</style>
