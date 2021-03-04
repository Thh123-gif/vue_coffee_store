<template>
  <div class="top-box">
    <!-- 顶部背景 -->
    <div class="top-bg">
      <div class="fil-bg"></div>
    </div>
    <!-- 顶部搜索框s -->
     <van-search
      v-model="iptSearch"
      shape="round"
      show-action
      placeholder="请输入搜索关键词"
    >
      <template #left>
        <input ref="camera" class="ipt-camera" type="file" capture="camera" accept="image/*" multiple>
        <div class="scan-icon" @click="openCamera">
          <van-icon name="scan" size="2em" />
          <div>扫一扫</div>
        </div>
      </template>
      <template #action>
        <div class="mes-icon">
          <van-icon name="chat-o" badge="3" size="2em" />
          <div>消息</div>
        </div>
      </template>
    </van-search>
  </div>
  <!-- 顶部搜索框e -->
</template>

<script>
export default {
    props:['iptSearch'],
    methods:{
      openCamera(){
        this.$refs.camera.click();
      }
    }
}
</script>

<style lang="less" scoped>
.top-box {
    width: 100%;
    height:60px;
  .top-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    z-index: -1;
    overflow: hidden;
    .fil-bg {
      width: 100%;
      height: 100px;
      background: url(../assets/images/banner04.jpg);
      background-size: cover;
      transform: scale(1.2);
      filter: blur(2px);
    }
  }
  .van-search {
    background-color: transparent;
  }
  .ipt-camera {
    width: 40px;
    height: 40px;
    display: none;
  }
  .scan-icon {
    text-align: center;
    width: 40px;
    font-size: 12px;
    color: #eee;
  }
  .van-search__action {
      line-height: 14px;
  }
  .mes-icon {
    text-align: center;
    font-size: 12px;
    color: #eee;
    margin-right: 5px;
  }
}
</style>