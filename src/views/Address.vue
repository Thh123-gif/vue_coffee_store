<template>
    <div class="addree">
        <div class="top">
            <van-nav-bar
                title="地址管理"
                left-text="返回"
                left-arrow
                @click-left="onClickLeft"
            />
        </div>
        <TopBackground></TopBackground>
        <div class="dress-box">
             <van-address-list
                v-model="chosenAddressId"
                :switchable="false"
                :list="list"
                default-tag-text="默认"
                @add="onAdd"
                @edit="onEdit"
            />
        </div>
    </div>
</template>

<script>
import '../assets/less/address.less'
import TopBackground from '../components/TopBackground'
    export default {
        data() {
            return {
                chosenAddressId: '1',
                list: []
            };
        },
        components:{
            TopBackground
        },
        created(){
            this.checkAddress();
        },
        methods: {
            // 添加地址
            onAdd() {
                this.$router.push({name:'Site'});
            },
            // 编辑地址
            onEdit(address) {
                // console.log(address);//当前点击的全部地址信息
                let aid = address.aid;
                this.$router.push({name:'Site',params:{aid}});
            },
            // 返回
            onClickLeft(){
                this.$router.back();
            },
            //查询添加的地址
            checkAddress(){
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
                    url: this.baseURL + "/findAddress",
                    params: {
                        appkey:this.appkey,
                        tokenString
                    },
                }).then(data => {
                    this.$toast.clear();
                    console.log(data);
                    if(data.data.code == 700){
                        this.$toast({
                            message: data.data.msg,
                            forbidClick: true,
                            duration: 2000,
                        });
                        this.$router.push({name:'Login'});
                        return;
                    }
                    if(data.data.code == 20000){
                        let oldaddress = [];
                        data.data.result.forEach(v=>{
                            let adr = v.province+v.county+v.city;
                            oldaddress.push(
                                {
                                    id:v.id,
                                    name:v.name,
                                    tel:v.tel,
                                    address:adr,
                                    isDefault:!!v.isDefault,
                                    aid:v.aid
                                }
                            )
                        })
                        // console.log(oldaddress);
                        this.list = oldaddress;
                    }
                });
            }
        },
    }
</script>