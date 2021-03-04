<template>
    <div class="menu">
        <van-search
            shape="round"
            placeholder="请输入搜索关键词"
            @focus = focusFun
        />
        <!-- <div class="menu-banner-box"></div> -->
        <van-popup v-model="show" position="top"  :style="{ height: '50%' }">
            <van-search
                v-model="searchValue"
                shape="round"
                placeholder="请输入搜索关键词"
                @focus = focusFun
                @search = searchFun
                :autofocus="true"
                @blur = blurFun
            />
            <div class="search-show">
                <div class="box" v-if="searchList.length > 0">
                    <div class="goodsList" @click="goDetailsPage(item)" v-for="item in searchList" :key="item.id">
                        <img class="auto-img" :src="item.smallImg" />
                        <div class="men-content-box">
                            <div class="men-title">
                                <div class="men-g-name">{{item.name}}</div>
                                <div class="men-g-enname van-ellipsis">{{item.enname}}</div>
                            </div>
                            <div class="men-price">￥{{item.price}}</div>
                        </div>
                    </div>
                </div>
                <div class="emp-box" v-else>
                    <van-empty description="暂无内容" />
                </div>
            </div>
        </van-popup>
        <van-tree-select
            :items="items"
            height="90vh"
            @click-nav="toggleNav"
            :active-id.sync="activeId"
            :main-active-index.sync="activeIndex"
        >
            <template #content>
                <div class="box">
                    <div class="goodsList" @click="goDetailsPage(item)" v-for="item in goodsData" :key="item.id">
                        <img class="auto-img" :src="item.smallImg" />
                        <div class="men-content-box">
                            <div class="men-title">
                                <div class="men-g-name">{{item.name}}</div>
                                <div class="men-g-enname van-ellipsis">{{item.enname}}</div>
                            </div>
                            <div class="men-price">￥{{item.price}}</div>
                        </div>
                    </div>
                </div>
            </template>
        </van-tree-select>
    </div>
</template>

<script>
import '../assets/less/menu.less'
    export default {
        data() {
            return {
                // 导航栏数据s
                items:[],
                activeId: 1,
                activeIndex: 0,
                // 导航栏数据e
                content:0,// 商品导航下标
                goodsType:[],// 商品类型
                goodsData:[],//商品数据
                isOne:false,//是否是第一次进来的推荐
                show:false,// 搜索弹出层
                searchValue:'',//搜索的内容
                searchList:[],//搜索的结果

            };
        },
        created(){
            this.getCommendData();
        },
        methods:{
            // 切换导航条
            toggleNav(index){
                // console.log(index);
                this.content = index;
                this.requestGoods(index);
            },
            //获取商品信息      
            getCommendData(){
                this.$toast.loading({
                    message: "加载中...",
                    forbidClick: true,
                    duration: 0,
                });

                this.isOne = true;

                this.axios({
                    method: "GET",
                    url: this.baseURL + "/type",
                    params: {
                        appkey: this.appkey,
                    },
                }).then(data => {
                    this.$toast.clear();
                    // console.log(data);
                    if(data.data.code == 400){
                        this.items.push({text:'推荐'});
                        this.goodsType = data.data.result;
                        data.data.result.forEach(v=>{
                            this.items.push({text:v.typeDesc});
                        })
                        if(this.isOne){
                            this.requestGoods(0);
                        }
                    }
                })
            },
            // 切换导航条时请求不同的商品
            requestGoods(value){
                this.$toast.loading({
                    message: "加载中...",
                    forbidClick: true,
                    duration: 0,
                });


                if(this.content == 0){
                    this.axios({
                        method:'GET',
                        url:this.baseURL + '/typeProducts',
                        params:{
                            appkey:this.appkey,
                            key:'isHot',
                            value:1
                        }
                    }).then(data=>{
                        this.$toast.clear();
                        // console.log(data);
                        if(data.data.code == 500){
                            this.goodsData = data.data.result;
                        }
                    });
                }else {
                    this.axios({
                         method:'GET',
                         url:this.baseURL + '/typeProducts',
                         params:{
                             appkey:this.appkey,
                             key:'type',
                             value:this.goodsType[value-1].type
                         }
                     }).then(data=>{
                         this.$toast.clear();
                        //  console.log(data);
                         if(data.data.code == 500){
                             this.goodsData = data.data.result;
                         }
                     });
                }

            },
            // 点击去到商品详情页
            goDetailsPage(item){
                // console.log(item);
                this.$router.push({name:'Details',params:{pid:item.pid}});
            },
            // 搜索
            focusFun(){
                this.show = true;
            },
            // 搜索失去焦点
            blurFun(){
                this.searchValue = '';
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
            }
        }
    }
</script>