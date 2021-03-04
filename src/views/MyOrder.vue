<template>
    <div class="mylike">
        <div class="p-top-nav">
            <van-nav-bar
                title="我的订单"
                left-text="返回"
                left-arrow
                @click-left="onClickLeft"
            />
        </div>
        <User>
              <template #fix>
                <div class="content-box">
                        <van-tabs v-model="active" @change="toggleContent" color="#854C21">
                            <van-tab :title="navName.title" v-for="navName in navLists" :key="navName.status">
                                <div v-if="orderMsg.length > 0">
                                    <div class="product-box" v-for="(item,index) in orderMsg" :key="index">
                                        <OrderList :myOrderList="item.proInfo">
                                            <template #title>
                                                    <span class="order-number">{{item.oid}}</span>
                                                    <div class="myor-title" v-if="item.status == 2">
                                                        <div class="settings">
                                                            <span>已完成</span>
                                                            <i @click="delOrder(item.oid,index)">
                                                                <van-icon name="delete-o" />
                                                            </i>
                                                        </div>
                                                    </div>
                                                    <div class="myor-title" v-if="item.status == 1">
                                                        <div class="settings">
                                                            <span @click="suerGet(item,index)">确认收货</span>
                                                        </div>
                                                    </div>
                                            </template>
                                            <template #product-item>
                                            <div class="or-goods-msg" v-for="(value,i) in item.data" :key="i">
                                                <div class="or-img-box">
                                                    <img class="auto-img" :src="value.smallImg" />
                                                </div>
                                                <div class="or-right-content">
                                                    <div class="right-content-title">
                                                        <span>{{value.name}}</span>
                                                        <span>{{value.rule}}</span>
                                                    </div>
                                                    <p>{{value.enname}}</p>
                                                    <div class="or-price-box">
                                                        <span class="or-price">￥{{value.price}}</span>
                                                        <span class="or-number">x{{value.count}}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                        </OrderList>
                                    </div>
                                </div>
                                <div v-else>
                                    <van-empty description="没有该状态的订单" />
                                </div>
                            </van-tab>
                        </van-tabs>
                </div>
            </template>
        </User>
    </div>
</template>

<script>
import User from '../components/User'
import OrderList from '../components/OrderList'
import '../assets/less/order.less'
    export default {
        components:{
            User,
            OrderList
        },
        data(){
            return {
                active:0,//激活的下标
                 navLists: [//导航栏信息
                    {
                        title: "全部",
                        status: 0,
                    },
                    {
                        title: "进行中",
                        status: 1,
                    },
                    {
                        title: "已完成",
                        status: 2,
                    },
                ],
                orderMsg:[],// 订单的内容
            }
        },
        methods:{
            // 获取订单的数据
            getOrderData(){
                 let tokenString = this.$cookies.get("tokenString");
                if (!tokenString) {
                    this.$router.push({name:'Login'})
                    return;
                }
                this.$toast.loading({
                    message: "加载中...",
                    forbidClick: true,
                    duration: 0,
                });

                this.axios({
                    method: "GET",
                    url: this.baseURL + "/findOrder",
                    params: {
                        appkey: this.appkey,
                        tokenString,
                        status:this.active
                    },
                }).then(data => {
                    this.$toast.clear();
                    // console.log(data);
                    if(data.data.code == 70000){
                        // 处理同一订单的数据
                        let orderNumber = [];
                        let products = [];
                        data.data.result.forEach(v=>{
                            if(orderNumber.indexOf(v.oid) ==  -1){
                                 let o = {
                                    oid: v.oid,
                                    status: v.status,
                                    proInfo: {
                                        date: v.updatedAt,
                                        count: 0,
                                        total: 0,
                                    },
                                    data: []
                                    };
                                orderNumber.push(v.oid);
                                products.push(o);
                            }
                        })
                        // console.log('orderNumber',orderNumber);
                        // 通过oid查找相应的订单商品
                        products.forEach(v=>{
                            data.data.result.forEach(item =>{
                                if(v.oid == item.oid){
                                    v.data.push(item);
                                    v.proInfo.count += item.count;
                                    v.proInfo.total += item.count * item.price;
                                }
                            })
                        })
                        // console.log('procucts',products);
                        this.orderMsg = products;
                    }
                })
            },
            //返回按钮
            onClickLeft(){
                this.$router.back();
            },
            // 切换内容
            toggleContent(value){
                // console.log(value);
                this.orderMsg = [];
                this.getOrderData();
                this.active = value;
            },
            // 删除订单
            delOrder(oid,index){
                let tokenString = this.$cookies.get("tokenString");
                if (!tokenString) {
                    this.$router.push({ name: "Login" });
                    return ;
                }

                this.$toast.loading({
                    message: "加载中...",
                    forbidClick: true,
                    duration: 0,
                });

                this.$axios({
                    method:'POST',
                    url:this.baseURL + '/removeOrder',
                    data:{
                        appkey:this.appkey,
                        tokenString,
                        oid
                    }
                }).then(data=>{
                    this.$toast.clear();
                    // console.log('删除订单',data);
                    if(data.data.code == 90000){
                        this.$toast({
                            message:data.data.msg,
                            forbidClick: true,
                            duration: 1000,
                        });
                    }
                    this.orderMsg.splice(index,1);
                })
            },
            // 确认收货
            suerGet(item,index){
                let tokenString = this.$cookies.get("tokenString");
                if (!tokenString) {
                    this.$router.push({ name: "Login" });
                    return ;
                }

                this.$toast.loading({
                    message: "加载中...",
                    forbidClick: true,
                    duration: 0,
                });

                this.$axios({
                    method:'POST',
                    url:this.baseURL + '/receive',
                    data:{
                        appkey:this.appkey,
                        tokenString,
                        oid:item.oid
                    }
                }).then(data=>{
                    this.$toast.clear();
                    console.log('确认收货',data);
                    if(data.data.code == 80000){
                        item.status = 2;
                        this.$toast({
                            message: data.data.msg,
                            forbidClick: true,
                            duration: 1000,
                        });
                    }
                })
            },
        },
        created(){
            // 获取订单内容
            this.getOrderData();
        }
    }
</script>

<style lang="less" scoped>
    .p-top-nav {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 99;
    }
    .product-box {
        margin: 10px 0;
    }
    .content-box {
        background: #eee;
    }
    .order-number {
        padding: 5px 0;
        box-sizing: border-box;
    }
    .myor-title {
        padding: 2px 0;
        box-sizing: border-box;
        display: flex;
        color: #888;
        margin-left: auto;
        .settings {
            span {
                margin-right: 10px;
            }
            i {
                vertical-align: -1.5px;
            }
        }
    }
</style>