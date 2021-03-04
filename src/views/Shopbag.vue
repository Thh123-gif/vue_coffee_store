<template>
    <div class="shopbag">
        <van-nav-bar
        class="top-nav"
        title="购物袋"
        left-text="返回"
        :right-text="isEdit?'完成编辑':'编辑'"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
        />
        <div class="products-list" v-if="shopbagGoodslist.length > 0 ">
                <van-list
                    v-model="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    offset="100"
                    @load="loadShopbagData"
                    >
                    <van-cell v-for="(items,index) in shopbagGoodslist" :key="items.sid">
                        <div class="products">
                            <div class="check">
                                <van-checkbox v-model="items.isChecked" @click="Onechecked"></van-checkbox>
                            </div>
                            <div class="slide-box">
                                <van-swipe-cell>
                                    <template #default>
                                        <div class="default-box">
                                            <div class="img-box" @click="goDetails(items.pid)">
                                                <img class="auto-img" :src="items.small_img" alt="">
                                            </div>
                                            <div class="content">
                                                <p class="c-title">
                                                    <span class="t-title">{{items.name}}</span>
                                                    <span class="s-msg">{{items.rule}}</span>
                                                </p>
                                                <p class="enname">{{items.enname}}</p>
                                                <div class="counts">
                                                    <div class="price">￥{{items.price}}</div>
                                                    <div class="num-select">
                                                        <van-stepper v-model="items.count" theme="round" button-size="22" disable-input @change="updateShopbagCount(items.sid,items.count)"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                    <template #right>
                                        <van-button square text="删除" type="danger" class="delete-button" @click="detele(items.sid,index)"/>
                                    </template>
                                </van-swipe-cell>
                            </div>
                        </div>
                    </van-cell>
                </van-list>
        </div>
        <div class="empty" v-else>
            <van-empty
                class="custom-image"
                image="https://img.yzcdn.cn/vant/custom-empty-image.png"
                description="购物车暂无商品,先逛一逛吧"
            />
            <div class="empty-show">
                <GoodsList :itemsData="recommendList"></GoodsList>
            </div>
        </div>

        <van-submit-bar v-show="!isEdit" class="sub-box" :price="totalPrice" button-color="rgb(198 123 67)" button-text="提交订单" @submit="submitOrder">
            <van-checkbox v-model="checked" @click="seleAll">全选</van-checkbox>
        </van-submit-bar>

        <van-submit-bar v-show="isEdit" class="sub-box" button-text="删除" @submit="delSelect">
            <div class="check-box">
                <van-checkbox v-model="checked" @click="seleAll">全选</van-checkbox>
            </div>
        </van-submit-bar>
    </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import '../assets/less/shopbag.less'
import GoodsList from '../components/GoodsList'
    export default {
        name:'Shopbag',
        data(){
            return {
                numValue:1,//商品选择的数量
                isEdit:false,//是否处于编辑状态
                checked:false,// 底部提交的全选状态
                shopbagAllData:[],//购物袋的全部商品
                shopbagGoodslist: [],//购物袋的懒加载商品
                loading: true,//加载下一页
                finished: false,//是否完成全部数据加载
                start:0,//开始截取的数据下标
                count:3,//每次截取的商品数目
                delList:[],// 多选删除的商品
                totalPrice:0,//商品总价格
                recommendList:[],// 购物车为空时显示的推荐商品
            }
        },
        created(){
            this.getShopbagData();
            this.showCommend();
        },
        components:{
            GoodsList
        },
        computed:{
            ...mapState(['shopbagCount'])
        },
        methods:{
            ...mapMutations(['changeShopbagCount']),
            // 返回按钮
            onClickLeft(){
                this.$router.back();
            },
            // 点击商品回到详情页面确认查看
            goDetails(pid){
                // console.log(pid);
                this.$router.push(`/details/${pid}`);
            },
            // 选择全部
            seleAll(){
          
                // 这里组件自己有取反，不需要再写取反
                this.shopbagAllData.forEach((v)=>{
                    v.isChecked = this.checked;
                })      
                this.sum();
            },
            // 单选框
            Onechecked(){
                this.sum();
                for(let i = 0 ; i < this.shopbagAllData.length; i++){
                    if(!this.shopbagAllData[i].isChecked){//判断只要有一个没选中，就将全选按钮修改为false
                        this.checked = false;
                        return ;
                    }
                }
                //如果执行完上面的循环都没改为fasle,则修改为true
                this.checked = true;
            },
            // 切换编辑状态
            onClickRight(){
                this.isEdit = !this.isEdit;
            },
            //获取购物袋数据
            getShopbagData() {
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

            this.axios({
                //请求方式
                method: "GET",
                url: this.baseURL + "/findAllShopcart",
                params: {
                    appkey: this.appkey,
                    tokenString,
                },
            }).then(data => {
                // console.log(data);
                this.$toast.clear();
                if (data.data.code == 700) {
                    this.$toast({
                    message: data.data.msg,
                    forbidClick: true,
                    duration: 3000,
                    });
                    this.$router.push({ name: "Login" });
                    return ;
                }
                if (data.data.code === 5000) {
                    data.data.result.forEach((v) => {
                        v.isChecked = false;
                    });

                    this.shopbagAllData = data.data.result;

                    this.shopbagGoodslist = this.shopbagAllData.slice(this.start,this.start + this.count);

                    this.start += this.count;
                    // console.log(this.shopbagGoodslist);

                    //下次触底进行懒加载
                    this.loading = false;
                } else {
                    this.$toast({
                        message: data.data.msg,
                        forbidClick: true,
                        duration: 3000,
                    });
                }
                }).catch((err) => {
                    this.$toast.clear();
                    console.log("err ==> ", err);
                });
            },
            //加载中
            loadShopbagData() {
                setTimeout(() => {//延时器模拟显示加载中
                    let data = this.shopbagAllData.slice(this.start,this.start + this.count);
                    this.shopbagGoodslist.push(...data);
                    this.start += this.count;

                    //当数据不足够截取时，则显示加载完成
                    if (data.length < this.count) {
                        this.finished = true;
                        return;
                    }
                    //下次进行触底懒加载
                    this.loading = false;
                }, 1000);
            },
            // 更新商品数据
            updateShopbagCount(sid,count){
                let tokenString = this.$cookies.get("tokenString");
                if (!tokenString) {
                    this.$router.push({ name: "Login" });
                    return ;
                }
                this.axios({
                    //请求方式
                    method: "POST",
                    url: this.baseURL + "/modifyShopcartCount",
                    data: {
                        appkey: this.appkey,
                        tokenString,
                        sid,
                        count
                    },
                }).then(data => {
                    // console.log(data);
                    if(!data.data.code == 6000){
                        this.$toast({
                            message:data.data.msg,
                            duration:1000
                        })
                    }
                });
                this.sum();
            },
            //删除商品
            detele(sid,index){
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

                this.axios({
                    //请求方式
                    method: "POST",
                    url: this.baseURL + "/deleteShopcart",
                    data: {
                        appkey: this.appkey,
                        tokenString,
                        sids:JSON.stringify([sid])
                    },
                }).then(data => {
                    // console.log(data);
                    this.$toast.loading({
                        message: data.data.msg,
                        duration: 1000,
                    });
                    if(data.data.code == 7000){
                        // 单删
                        if(index != undefined){
                            this.shopbagGoodslist.splice(index,1);
                            //改变全局变量的购物袋数量
                            this.changeShopbagCount(this.shopbagCount - 1);
                        }else {//多删
                            // console.log("多删");
                            for(let k = 0; k < this.shopbagGoodslist.length; k++){
                                if(this.shopbagGoodslist[k].isChecked){
                                    this.shopbagGoodslist.splice(k,1);
                                    k--;//下标会变化
                                }
                            }
                            //改变全局变量的购物袋数量
                            this.changeShopbagCount(this.shopbagCount - sid.length);
                        }
                        // 判断如果商品的数量为0，就将全选按钮变为false
                        if(this.shopbagGoodslist.length <= 0){
                            this.checked = false;
                        }
                        this.sum();
                    }
                });
            },
            // 删除选中的商品
            delSelect(){
                let del = [];
                for(let i = 0; i < this.shopbagGoodslist.length; i++){
                    if(this.shopbagGoodslist[i].isChecked){
                        del.push(this.shopbagGoodslist[i].sid);
                    }
                };
                if(del.length == 0){
                    this.$toast({
                        message:'未选择任何商品',
                        duration:1000,
                    });
                    return;
                }
                this.detele(del);
                this.sum();
            },
            // 计算价格
            sum(){
                let total = 0;
                for(let m = 0 ; m < this.shopbagGoodslist.length; m ++){
                    if(this.shopbagGoodslist[m].isChecked){
                        total+= this.shopbagGoodslist[m].count * this.shopbagGoodslist[m].price;
                    }
                }
                this.totalPrice = total * 100;
            },
            // 显示推荐商品
            showCommend(){
                let tokenString = this.$cookies.get('tokenString');
                if(!tokenString){
                    this.$router.push({name:'Login'});
                }

               this.axios({
                    method:'GET',
                    url:this.baseURL + '/typeProducts',
                    params:{
                        appkey:this.appkey,
                        key:'type',
                        value:'coffee'
                    }
                }).then(data=>{
                    if(data.data.code == 500){
                        this.recommendList = data.data.result
                    }
                })
            },
            // 提交订单
            submitOrder(){
                let submitGoods = [];
                this.shopbagAllData.forEach(v=>{
                    if(v.isChecked){
                        submitGoods.push(v.sid);
                    }
                })
                this.$router.push({name: 'Pay', query: {sids: submitGoods.join('-')}});
            }
        }
    }
</script>