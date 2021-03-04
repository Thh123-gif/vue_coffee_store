<template>
  <div class="home">
    <div class="top-bg">
      <div class="fil-bg"></div>
    </div>
    <!-- 顶部搜索框s -->
      <div class="top-search-box">
        <!-- 顶部背景 -->
        <div class="top-search-bg">
          <div class="top-search-fil-bg"></div>
        </div>
        <!-- 顶部搜索框s -->
        <van-search
          v-model="iptSearch"
          shape="round"
          show-action
          @focus = focusFun
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
    <!-- 热搜s -->
    <div class="push">
      <span>热搜：</span>
      <ul class="hot-searchList">
        <li v-for="(p,i) in pushList" :key="i" @click="hotSearch(p.title)">{{p.title}}</li>
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
      <ul class="items-name">
        <!-- <router-link v-for="(items,index) in navList" :key="index" :to="items.to" :class="navIndex == index ? 'active' : ''" tag="li" @click="changnavIndex(index)">{{items.title}}</router-link> -->
        <li v-for="(items,index) in navList" :key="index" :class="navIndex == index ? 'active':''" @click="changnavIndex(index)">{{items.title}}</li>
      </ul>
    </div>
    <div class="nav-content">
        <transition enter-active-class="animate__animated animate__fadeInLeft" >
        <router-view></router-view>
      </transition>
    </div>
    <!-- 热门推荐e -->
    <!-- 搜索框弹出层e -->
    <van-popup v-model="show" position="top" @close="close"  :style="{ height: '50%' }">
           <div class="pop-top-search">
              <van-search
                v-model="searchValue"
                shape="round"
                placeholder="请输入搜索关键词"
                @focus = focusFun
                @search = searchFun
                :autofocus="true"
                @blur = blurFun
            />
           </div>
            <div class="pop-search-show">
                <div class="pop-box" v-if="searchList.length > 0">
                    <div class="pop-goodsList" @click="goDetailsPage(item)" v-for="item in searchList" :key="item.id">
                        <img class="auto-img" :src="item.smallImg" />
                        <div class="pop-men-content-box">
                            <div class="pop-men-title">
                                <div class="pop-men-g-name">{{item.name}}</div>
                                <div class="pop-men-g-enname van-ellipsis">{{item.enname}}</div>
                            </div>
                            <div class="pop-men-price">￥{{item.price}}</div>
                        </div>
                    </div>
                </div>
                <div class="pop-emp-box" v-else>
                    <van-empty description="暂无内容" />
                </div>
            </div>
    </van-popup>
    <!-- 搜索框弹出层s -->
  </div>
</template>

<script>
import '../assets/less/home.less'
import {mapMutations} from 'vuex'
export default {
  name: 'Home',
  data(){
    return {
      images: [],//轮播图图片
      current:0,//当前轮播图的下标
      pushList:[//热搜列表
        {
          title:'咖啡豆'
        },
        {
          title:'拿铁'
        },
        {
          title:'瑞纳冰'
        },
        {
          title:'水果茶'
        }
      ],
      navList:[//导航列表
        {
          title:'推荐',
          to:'/'
        },
         {
          title:'拿铁',
          to:'/latte'
        },
         {
          title:'咖啡',
          to:'/coffee'
        },
         {
          title:'瑞纳冰',
          to:'/ruinaice'
        }
      ],
      navIndex:0,//导航栏下标
      iptSearch:'',//页面搜索框的内容
      show:false,// 搜索弹出层
      searchValue:'',//弹出层搜索的内容
      searchList:[],//搜索的结果
    }
  },
  created(){
    //获取轮播图
    this.getBannerImg();
    // 保持导航页的内容切换时不变
    this.changnavIndex(this.navIndex);
    // 获取购物袋数量
    this.getShopbagCount();
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
    // 热搜列表点击事件
    hotSearch(content){
      // console.log(content);
      this.show = true;
      this.iptSearch = content;
      this.searchValue = content;
      this.searchFun(content);
    },
     // 点击去到商品详情页
    goDetailsPage(item){
        // console.log(item);
        this.$router.push({name:'Details',params:{pid:item.pid}});
    },
    // 搜索弹出层
    focusFun(){
        this.show = true;
    },
    // 搜索框失去焦点
    blurFun(){
        this.searchValue = '';
        this.iptSearch = '';
        this.searchList = [];
    },
    // 确认搜索
    searchFun(value){
        // console.log(value);
        this.axios({
            method:'GET',
            url:this.baseURL + '/search',
            params:{
                appkey:this.appkey,
                name:value
            }
        }).then(data=>{
            this.$toast.clear();
            // console.log(data);
            if(data.data.code == 'Q001'){
                this.searchList = data.data.result;
            }
        });
    },
    // 遮罩层关闭重置数据
    close(){
        this.searchValue = '';
        this.iptSearch = '';
        this.searchList = [];
    },
    // 打开照相机
    openCamera(){
      this.$refs.camera.click();
    }
  }
}
</script>
