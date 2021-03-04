<template>
    <div class="pay">
        <div class="p-top-nav">
            <van-nav-bar
                title="订单结算"
                left-text="返回"
                left-arrow
                @click-left="onClickLeft"
            />
        </div>
        <div class="select-address">
            <div class="pa-address">
                <div class="pa-sele">
                    <div class="pa-top-se">
                        <span @click="selectAddress">选择收货地址</span>
                        <van-icon class="arrow" name="arrow" />
                        <div class="pa-user">
                            <span class="po-us-name">{{sureAddress.name}}</span>
                            <span>{{sureAddress.tel}}</span>
                            <span v-show="sureAddress.isDefault" class="default">默认</span>
                        </div>
                        <div class="pa-show-address">
                            {{sureAddress.address}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="pay-content-box">
            <div class="product-box">
                <OrderList :myOrderList="orderCountAndPrice">
                <template #title>
                        <span>订单信息</span>
                </template>
                <template #product-item>
                      <div class="or-goods-msg" v-for="item in myOrderList" :key="item.sid">
                        <div class="or-img-box">
                            <img class="auto-img" :src="item.small_img" />
                        </div>
                        <div class="or-right-content">
                            <div class="right-content-title">
                                <span>{{item.name}}</span>
                                <span>{{item.rule}}</span>
                            </div>
                            <p>{{item.enname}}</p>
                            <div class="or-price-box">
                                <span class="or-price">￥{{item.price}}</span>
                                <span class="or-number">x{{item.count}}</span>
                            </div>
                        </div>
                    </div>
                </template>
            </OrderList>
            </div>
        </div>
        <van-popup v-model="isShowAddress" closeable round position="bottom">
            <div class="pay-bottom-box">
                <van-address-list
                    v-model="chosenAddressId"
                    :list="list"
                    default-tag-text="默认"
                    @select = "selectOptions"
                    @add="onAdd"
                    />
            </div>
        </van-popup>
        <van-button round block @click="settlement">立即结算</van-button>
    </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import '../assets/less/pay.less'
import OrderList from '../components/OrderList'
    export default {
        components:{
            OrderList
        },
        data(){
            return {
                active:0,
                chosenAddressId:1,
                // 地址列表
                list: [
                    // {
                    //     id: '1',
                    //     name: '张三',
                    //     tel: '13000000000',
                    //     address: '浙江省杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室',
                    //     isDefault: true,
                    // }
                ],
                isShowAddress:false,//地址弹出层
                sureAddress:{},// 最终确认的地址信息
                myOrderList:[],//订单信息
                orderCountAndPrice:{// 商品总数目和总价格
                    count:0,
                    total:0
                },
            }
        },
        computed:{
            ...mapState(['shopbagCount'])
        },
        methods:{
            ...mapMutations(['changeShopbagCount']),
            // 获取订单的数据
            getOrderData(){
                let sids = this.$route.query.sids.split('-');
                // console.log('pay页面sids',sids);
                let tokenString = this.$cookies.get("tokenString");
                if (!tokenString) {
                    this.$router.push({name:'Login'});
                    return;
                }
                this.$toast.loading({
                    message: "加载中...",
                    forbidClick: true,
                    duration: 0,
                });
                
                this.axios({
                    method: "GET",
                    url: this.baseURL + "/commitShopcart",
                    params: {
                        appkey: this.appkey,
                        tokenString,
                        sids:JSON.stringify(sids)
                    },
                }).then(data => {
                    // console.log('订单信息',data);
                    this.$toast.clear();
                    if (data.data.code == 700) {
                        this.$router.push({name:'Login'});
                        return;
                    }
                    if(data.data.code == 50000){

                        if (data.data.result.length === 0) {
                            this.$router.push({path: '/'});
                            return ;
                        }
                        data.data.result.forEach(v=>{
                            this.orderCountAndPrice.total += v.price * v.count;
                            this.orderCountAndPrice.count += parseInt(v.count);
                        })
                        this.myOrderList = data.data.result;
                    }
                }).catch((err) => {
                        this.$toast.clear();
                });
            },
            //返回按钮
            onClickLeft(){
                this.$router.back();
            },
            // 地址选择
            selectAddress(){
                this.isShowAddress = true;
                this.list = [];
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
                    method:'GET',
                    url:this.baseURL + '/findAddress',
                    params:{
                        appkey:this.appkey,
                        tokenString,
                    }
                    }).then(data=>{
                        this.$toast.clear();
                        // console.log(data);
                        data.data.result.forEach(v=>{
                            this.list.push({
                                id:v.id,
                                name:v.name,
                                tel:v.tel,
                                address:v.province+v.county+v.city+v.addressDetail,
                                isDefault:Boolean(v.isDefault),
                            })
                        })
                        // console.log(this.list);
                    })
            },
            // 添加地址
            onAdd() {
                this.$router.push({name:'Site'});
            },
            // 地址选中
            selectOptions(item,index){
                // console.log(item,index);
                this.sureAddress = {...item};
                this.isShowAddress = false;
            },
            // 立即结算
            settlement(){
                let tokenString = this.$cookies.get("tokenString");
                if (!tokenString) {
                    this.$router.push({ name: "Login" });
                    return ;
                }
                // console.log(this.sureAddress);
                if(!this.sureAddress.id){
                    this.$toast({
                        message:'未选择收货地址',
                        forbidClick:true,
                        duration:1000,
                    })
                    return;
                }

                this.$toast.loading({
                    message: "加载中...",
                    forbidClick: true,
                    duration: 0,
                });

                let sids = this.$route.query.sids.split('-');

                this.$axios({
                    method:'POST',
                    url:this.baseURL + '/pay',
                    data:{
                        appkey:this.appkey,
                        tokenString,
                        sids:JSON.stringify(sids),
                        phone:this.sureAddress.tel,
                        address:this.sureAddress.address,
                        receiver:this.sureAddress.name
                    }
                    }).then(data=>{
                        this.$toast.clear();
                        // console.log(data);
                        if(data.data.code == 6000){
                            this.$toast({
                                message: data.data.msg,
                                forbidClick: true,
                                duration: 1000,
                            });
                            this.changeShopbagCount(this.shopbagCount - sids.length);
                        }
                        setTimeout(()=>{
                            this.$router.push({name:'MyOrder'});
                        },1000)
                        
                    })
            },
            // 查询是否有默认地址
            checkDefault(){
                 this.list = [];
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
                    method:'GET',
                    url:this.baseURL + '/findAddress',
                    params:{
                        appkey:this.appkey,
                        tokenString,
                    }
                    }).then(data=>{
                        this.$toast.clear();
                        // console.log(data);
                        data.data.result.forEach(v=>{
                            this.list.push({
                                id:v.id,
                                name:v.name,
                                tel:v.tel,
                                address:v.province+v.county+v.city+v.addressDetail,
                                isDefault:Boolean(v.isDefault),
                            })
                            if(v.isDefault){
                                this.chosenAddressId = v.id;
                                this.sureAddress = {
                                    id:v.id,
                                    name:v.name,
                                    tel:v.tel,
                                    address:v.province+v.county+v.city+v.addressDetail,
                                    isDefault:Boolean(v.isDefault),
                                };
                            }
                        })
                        // console.log(this.list);
                    })
            }
        },
        created(){
            // 获取订单的数据
            this.getOrderData();
            // 查询默认地址
            this.checkDefault();
        }
    }
</script>