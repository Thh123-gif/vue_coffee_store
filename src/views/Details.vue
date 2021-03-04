<template>
  <div class="details-box">
    <div class="top-nav">
         <van-nav-bar
      title="商品详情"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    </div>
    <div class="show-img">
      <img class="auto-img" :src="detailsData.small_img" />
    </div>
    <div class="show-msg">
      <div class="title">
        <h3>{{ detailsData.name }}</h3>
        <p>{{ detailsData.enname }}</p>
        <h2>￥{{ detailsData.price }}</h2>
      </div>
      <div class="select">
        <h3>选择规格</h3>
        <div
          class="templete"
          v-for="(item, index) in detailsData.selectOptions"
          :key="index+4"
        >
          <span class="s-title">{{ item.title }}</span>
          <ul>
            <li
              :class="item.currentIndex == index2? 'active':''"
              v-for="(item2, index2) in item.rule"
              :key="index2+2"
              @click="select(item, index2)"
            >
              {{item2.title}}
            </li>
          </ul>
        </div>
        <div class="select-num">
            <h4>数量选择</h4>
            <van-stepper class="p-num" v-model="seleNum" theme="round" button-size="20" disable-input />
        </div>
        <h4>商品描述</h4>
        <p class="mess" v-for="(msg,i) in detailsData.desc" :key="i">{{i+1}}、{{msg}}</p>
      </div>
    </div>
    <!-- 底部结算 -->
    <van-goods-action>
      <van-goods-action-icon icon="bag" color="#999" text="购物袋" :badge="productCount  <= 0 ? '':productCount" @click="gotoShopbag"/>
      <van-goods-action-icon icon="like" :color="likestatus?'#854C21':'#999'" :text="likestatus?'已收藏':'收藏'" @click="islike" />
      <van-goods-action-button
        color="#b37647"
        type="warning"
        text="加入购物袋"
        @click="addShopbag"
      />
      <van-goods-action-button color="#854C21" type="danger" text="立即购买"  @click="buynow" />
    </van-goods-action>
  </div>
</template>

<script>
import "../assets/less/details.less";
import { mapMutations, mapState } from 'vuex';
export default {
  name: "Details",
  data() {
    return {
      detailsData: {},//详情页的数据
      likestatus:false,//收藏的状态
      seleNum:1,//商品选择的数量
    };
  },
  methods: {
    ...mapMutations(['changeShopbagCount']),//结构vuex改变商品数目的方法
    //   获取详情页的数据
    getDetailsData() {
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        });
      this.axios({
        method: "GET",
        url: this.baseURL + "/productDetail",
        params: {
          appkey: this.appkey,
          pid: this.$route.params.pid,
        },
      }).then((data) => {
          this.$toast.clear();
        if (data.data.code == 600) {
          let productData = data.data.result[0];
          // console.log(this.productData);
          let specifications = ["cream", "tem", "sugar", "milk"];

          productData.selectOptions = [];

          specifications.forEach((v) => {
            if (!productData[v]) {
              return;
            }
            let splitText = productData[v].split("/");

            let formatData = {
              title: productData[v + "_desc"],
              currentIndex: 0,
              rule: [],
            };

            splitText.forEach((item) => {
              let o = {
                title: item,
              };
              formatData.rule.push(o);
            });
            productData.selectOptions.push(formatData);
          });

          // 处理描述信息
          productData.desc = productData.desc.split(/\n/);
          this.detailsData = productData;
          // console.log(productData);
        }
      });
    },
    // 返回按钮
    onClickLeft() {
    //   this.$router.back();
        this.$router.go(-1);
    },
    // 选中规格
    select(item, index) {
        if(item.currentIndex == index){
            return;
        }
        item.currentIndex = index;
    },
    // 收藏
    islike(){
        // console.log(this.likestatus);
        if(this.likestatus){
            this.unlike();
        }else{
            this.like();
        }
    },
    like(){
        // 如果cookies不存在token值,则跳转到登录界面
        let tokenString = this.$cookies.get('tokenString');
        if(!tokenString){
            this.$toast.loading({
                message: '请先登录',
                forbidClick: true,
                duration: 2000
            });
            setTimeout(()=>{
                this.$router.push({name:'Login'});
            },2000);
            //未登录直接return ,不执行下面的代码
            return;
        }
        // 通过后方可收藏
        this.$axios({
            url:this.baseURL+'/like',
            method:'POST',
            data:{
                appkey:this.appkey,
                pid:this.$route.params.pid,
                tokenString
            }
        }).then(data=>{
            // console.log(data);
            // token值错误执行的方法
            if(data.data.code == 700){
                this.$toast({
                    message:data.data.msg,
                    forbidClick:true,
                    duration:2000,
                });
                this.$router.push({name:'Login'});
                return;
            }else if(data.data.code == 800){//已收藏成功
                this.likestatus = true;
                this.$toast({
                    message:data.data.msg,
                    forbidClick:true,
                    duration:2000,
                });
            }else{
                this.$toast({
                    message: data.data.msg,
                    forbidClick: true,
                    duration: 1000,
                });
            }
        })
    },
    unlike(){
        let tokenString = this.$cookies.get('tokenString');
        this.$axios({
            url:this.baseURL+'/notlike',
            method:'POST',
            data:{
                appkey:this.appkey,
                pid:this.$route.params.pid,
                tokenString
            }
        }).then(data=>{
            // console.log(data);
            if(data.data.code == 700){
                //错误信息
                this.$toast({
                    message: data.data.msg,
                    forbidClick: true,
                    duration: 1000,
                });
                this.$router.push({name:'Login'});
                return ;
            }else if(data.data.code == 900 && data.data.result == 1){
                this.likestatus = false;
                this.$toast({
                    message:data.data.msg,
                    forbidClick:true,
                    duration:1000,
                });
            }
        })
    },
    // 每次进来查询用户是否已经收藏
    checkLike(){
        let tokenString = this.$cookies.get('tokenString');
        // token不存在
        if(!tokenString){
            return;
        }
        this.axios({
            method:'GET',
            url:this.baseURL+'/findlike',
            params:{
                appkey:this.appkey,
                pid:this.$route.params.pid,
                tokenString
            }
        }).then(data=>{
            // console.log(data);
            if(data.data.code == 1000){
                if(data.data.result.length > 0){
                    this.likestatus = true;
                }
            }
        })
    },
    //添加购物袋商品
    addShopbag(){
        let tokenString = this.$cookies.get('tokenString');
        if (!tokenString) {
            this.$router.push({ name: "Login" });
            return;
        }
        let rules = [];
        let data = this.detailsData.selectOptions;
        data.forEach(v=>{
            rules.push(v.rule[v.currentIndex].title);
        })
        this.axios({
            method:'POST',
            url:this.baseURL+'/addShopcart',
            data:{
                appkey:this.appkey,
                pid:this.$route.params.pid,
                count:this.seleNum,
                rule:rules.join('/'),
                tokenString
            }
        }).then(data=>{
            // console.log(data);
            if (data.data.code == 700) {
                this.$toast({
                message: data.data.msg,
                forbidClick: true,
                duration: 3000,
                });
                return this.$router.push({ name: "Login" });
            }
            //成功添加到购物袋
            if(data.data.code == 3000){
                if(data.data.status == 1){//等于1就重新添加，等于0就执行数量+1
                    this.changeShopbagCount(this.productCount+1);
                }
            }
        })
    },
    // 点击去到购物袋界面
    gotoShopbag(){
        this.$router.push({name:'Shopbag'});
    },
    //获取购物袋的数目
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
    // 立即购买
    buynow(){
      //先添加到购物袋中获取sid
      let tokenString = this.$cookies.get('tokenString');
      if (!tokenString) {
          this.$router.push({ name: "Login" });
          return;
      }
      let rules = [];
      let data = this.detailsData.selectOptions;
      data.forEach(v=>{
          rules.push(v.rule[v.currentIndex].title);
      })
      this.axios({
          method:'POST',
          url:this.baseURL+'/addShopcart',
          data:{
              appkey:this.appkey,
              pid:this.detailsData.pid,
              count:this.seleNum,
              rule:rules.join('/'),
              tokenString
          }
      }).then(data=>{
          if (data.data.code == 700) {
              this.$toast({
              message: data.data.msg,
              forbidClick: true,
              duration: 3000,
              });
              return this.$router.push({ name: "Login" });
          }
          //成功添加到购物袋
          if(data.data.code == 3000){
            let sids = data.data.sid;
            console.log('details里的sids',sids);
            this.$router.push({name:'Pay',query:{sids}});
          }
      })
    }
  },
  computed:{
      ...mapState(['shopbagCount']),
      productCount(){//商品数量
          return this.shopbagCount
      }
  },
  created() {
    //获取商品数据
    this.getDetailsData();
    //获取用户收藏当前商品的信息
    this.checkLike();
    //获取购物袋商品数目
    this.getShopbagCount();
    // console.log(this.$route.params.pid);
  },
};
</script>