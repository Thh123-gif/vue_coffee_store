<template>
  <div class="home">
    <div class="top-bg">
      <div class="fil-bg"></div>
    </div>
    <!-- 顶部搜索框s -->
    <TopNav></TopNav>
    <!-- 顶部搜索框e -->
    <!-- 热搜s -->
    <div class="push">
      <span>热搜：</span>
      <ul class="hot-searchList">
        <li>咖啡机</li>
        <li>咖啡豆</li>
        <li>拉花教程</li>
        <li>附近好店</li>
      </ul>
    </div>
    <!-- 热搜e -->
    <!-- 轮播图s -->
    <div class="banner-box">
      <van-swipe @change="onChange" autoplay="4000">
        <van-swipe-item v-for="(img,index) in images" :key="index">
          <img class="auto-img" :src="img.bannerImg" @click="goDetail(img.pid)"/>
        </van-swipe-item>
        <template #indicator>
          <div class="banner-items">
            <div v-for="(item,i) in images.length" :key="i" :class="current == i ? 'active':'banner-square'"></div>
          </div>
        </template>
      </van-swipe>
    </div>
    <!-- 轮播图e -->
    <!-- 导航栏s -->
    <div class="icon-nav">
      <ul class="icon-list">
        <li>
          <a href="javascript:;"></a>
          <p>咖啡豆品</p>
        </li>
        <li>
          <a href="javascript:;"></a>
          <p>罐装咖啡</p>
        </li>
        <li>
          <a href="javascript:;"></a>
          <p>咖啡容器</p>
        </li>
        <li>
          <a href="javascript:;"></a>
          <p>零食蛋糕</p>
        </li>
        <li>
          <a href="javascript:;"></a>
          <p>拿铁系列</p>
        </li>
      </ul>
    </div>
    <!-- 导航栏e -->
    <!-- 热门推荐s -->
    <div class="nav-list">
      <van-tabs v-model="active">
        <van-tab :title="n.title" v-for="(n,i) in navList" :key="i">
          <GoodsList ></GoodsList>
        </van-tab>
      </van-tabs>
    </div>
    <!-- 热门推荐e -->
  </div>
</template>

<script>
import '../assets/less/copyhome.less'
import TopNav from '../components/TopNav'
import GoodsList from '../components/GoodsList'
import {mapMutations} from 'vuex'
export default {
  name: 'Home',
  data(){
    return {
      images: [],//轮播图图片
      current:0,//当前轮播图的下标
      active:0,//商品分类的下标
      navIndex:0,//导航栏下标
      navList:[],//导航栏信息
    }
  },
  created(){
    //获取轮播图
    this.getBannerImg();
    // 保持导航页的内容切换时不变
    this.changnavIndex(this.navIndex);
    // 获取购物袋数量
    this.getShopbagCount();
    // 获取类型
    this.getProductType();
  },
  components: {
    TopNav,
    GoodsList
  },
  methods:{
    ...mapMutations(['changeShopbagCount']),//结构vuex改变商品数目的方法
    // 轮播图事件
    onChange(index) {
      this.current = index;
    },
    // 获取轮播图图片
    getBannerImg(){
      this.axios({
          method:'GET',
          url:this.baseURL + '/banner',
          params:{
              appkey:this.appkey
          }
      }).then(data=>{
        if(data.data.code == 300){
          this.images = data.data.result
        }
        // console.log(data);
      })
    },
    //动态赋值导航栏
    changnavIndex(index){
      if(this.navIndex == index){
        return;
      }
      this.navIndex = index;
      // console.log(this.navList[index]);
      this.$router.push(this.navList[index].to);
    },
    // 从轮播图去到商品详情页
    goDetail(pid){
      this.$router.push({name:'Details',params:{pid}});
    },
    // 进入首页查询购物袋的数量
    getShopbagCount() {
      let tokenString = this.$cookies.get("tokenString");
      if (!tokenString) {
        return;
      }
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: this.baseURL + "/shopcartRows",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      }).then(data => {
          this.$toast.clear();
          if (data.data.code == 700) {
            return;
          }
          if (data.data.code === 8000) {
            this.changeShopbagCount(data.data.result);
          }
        }).catch((err) => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },
    getProductType(){// 查询商品类型
       this.axios({
            method:'GET',
            url:this.baseURL + '/type',
            params:{
                appkey:this.appkey,
            }
        }).then(data=>{
            console.log(data);
            if(data.data.code == 400){
              data.data.result.forEach(v=>{
                this.navList.push({type:v.type,title:v.typeDesc});
              })
            }
        })
    }
  }
}
</script>
