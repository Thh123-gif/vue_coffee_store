<template>
    <!-- 底部菜单s -->
    <van-tabbar v-model="active" active-color="#854C21" inactive-color="#888" route>
        <van-tabbar-item to="/">
            <span>首页</span>
            <template #icon="props">
                <img :src="props.active ? icon.active : icon.inactive" />
            </template>
        </van-tabbar-item>
        <van-tabbar-item to="/menu" icon="shop">菜单</van-tabbar-item>
        <van-tabbar-item to="/shopbag" icon="bag" :badge="shopbagCount <= 0 ? '':shopbagCount">购物袋</van-tabbar-item>
        <van-tabbar-item to="/mine" icon="manager">我的</van-tabbar-item>
    </van-tabbar>
    <!-- 底部菜单e -->
</template>

<script>
import {mapState} from 'vuex'
    export default {
        data(){
            return {
                active:0,
                icon:{
                    active:require('../assets/images/logo_active.png'),
                    inactive:require('../assets/images/logo.png')
                }
            }
        },
        computed:{
            ...mapState(['shopbagCount']),
            shopbagCount(){
                return this.$store.state.shopbagCount;
            }
        }
    }
</script>

<style lang="less" scoped>

</style>