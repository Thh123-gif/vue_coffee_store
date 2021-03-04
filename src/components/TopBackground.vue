<template>
    <div class="topBackground">
        <div class="img-box"></div>
    </div>
</template>

<script>
    export default {
        name:'TopBackground'
    }
</script>

<style lang="less" scoped>
    .topBackground {
        margin-top: 46px;
        .img-box {
            width: 100%;
            height: 100px;
            background: url(../assets/images/top.webp);
        }
    }
</style>