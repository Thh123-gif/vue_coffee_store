<template>
    <div class="personal">
        <TopBackground />
        <slot name=fix></slot>
    </div>
</template>

<script>
import TopBackground from '../components/TopBackground'
    export default {
        components:{
            TopBackground
        },
        methods:{
            onClickLeft(){
                this.$router.back();
            }
        }
    }
</script>

<style lang="less" scoped>
    .personal {
        /deep/ .van-nav-bar__text , /deep/ .van-nav-bar .van-icon {
            color: #854C21;
        }
        background: #eee;
        // height: 100vh;
    }
    // .p-top-nav {
    //     width: 100%;
    //     position: fixed;
    //     top: 0;
    //     left: 0;
    // }
    .content-box {
        width: 95%;
        margin: 0 auto;
        background: #fff;
        position: relative;
        top: -20px;
        border-radius: 5px;
        overflow: hidden;
        // padding: 30px 0;
    }
</style>