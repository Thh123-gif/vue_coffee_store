<template>
    <div class="site">
        <div class="top">
            <van-nav-bar
                :title="!!aid ?'修改地址':'添加地址'"
                left-text="返回"
                left-arrow
                @click-left="onClickLeft"
            />
        </div>
        <div class="ipt-box">
            <van-address-edit
            :area-list="areaList"
            :show-delete="!!aid"
            show-postal
            show-set-default
            :address-info="defaultInfo"
            :area-columns-placeholder="['请选择', '请选择', '请选择']"
            @save="onSave"
        />
        </div>
    </div>
</template>

<script>
import '../assets/less/site.less';
import areas from '../assets/js/area';
    export default {
        data(){
            return {
                areaList:areas,//地区
                aid:'',//用于判断是新增地址还是编辑地址
                defaultInfo:{}
            }
        },
        created(){
            this.getStatus();
        },
        methods:{
            // 返回按钮
            onClickLeft(){
                this.$router.back();
            },
            //新增地址
            add(value){
                let tokenString = this.$cookies.get("tokenString");
                if (!tokenString) {
                    this.$router.push({name:'Login'});
                    return;
                }

                // 处理数据格式
                let iptValue = {...value,appkey:this.appkey,tokenString};
                delete iptValue.country;
                iptValue.isDefault = Number(iptValue.isDefault);
                // console.log(iptValue);

                this.$toast.loading({
                    message: "加载中...",
                    forbidClick: true,
                    duration: 0,
                });
                //可以请求了
                this.axios({
                    method: "POST",
                    url: this.baseURL + "/addAddress",
                    data: {
                      ...iptValue
                    },
                }).then(data => {
                    this.$toast.clear();
                    // console.log(data);
                    if(data.data.code == 9000){
                        this.$router.push({name:'Address'});
                    }
                });
            },  
            // 编辑地址
            edit(value){
                let tokenString = this.$cookies.get("tokenString");
                if (!tokenString) {
                    this.$router.push({name:'Login'});
                    return;
                }
                let status = false;
                for(let i in this.defaultInfo){
                    if(this.defaultInfo[i] !== value[i]){
                        status = true;
                        break;
                    }
                }
                if(status){
                    // 处理数据格式
                    let iptValue = {};
                    iptValue.aid = this.aid;
                    iptValue.name = value.name;
                    iptValue.tel = value.tel;
                    iptValue.province = value.province;
                    iptValue.city = value.city;
                    iptValue.county = value.county;
                    iptValue.addressDetail = value.addressDetail;
                    iptValue.areaCode = value.areaCode;
                    iptValue.postalCode = value.postalCode;
                    iptValue.isDefault = Number(value.isDefault);
                    // console.log(iptValue);
                    // console.log('xaxa',this.defaultInfo);
                 
    
                    this.$toast.loading({
                        message: "加载中...",
                        forbidClick: true,
                        duration: 0,
                    });
                    //可以请求了
                    this.axios({
                        method: "POST",
                        url: this.baseURL + "/editAddress",
                        data: {
                            appkey:this.appkey,
                            tokenString,
                            ...iptValue
                        },
                    }).then(data => {
                        this.$toast.clear();
                        // console.log(data);
                        if(data.data.code == 700){
                            this.$router.push({name:'Login'});
                            return;
                        }
                        if(data.data.code == 30000){
                            this.$toast({
                                message: data.data.msg,
                                forbidClick: true,
                                duration: 1000,
                            });
                            this.$router.push({name:'Address'});
                        }
                    });
                }else {
                    this.$router.push({name:'Address'});
                    return
                }
            },
            // 保存按钮
            onSave(value){
                if(this.aid){
                    console.log("编辑地址");
                    this.edit(value);
                }else {
                    console.log("新增地址");
                    this.add(value);
                }
            },
            // 查询是编辑状态还是新增状态
            getStatus(){
                this.aid = this.$route.params.aid;
                if(this.aid){
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
                        url: this.baseURL + "/findAddressByAid",
                        params: {
                            aid:this.aid,
                            appkey:this.appkey,
                            tokenString
                        },
                    }).then(data => {
                        this.$toast.clear();
                        // console.log(data);
                        if(data.data.code == 40000){
                            data.data.result[0].isDefault = Boolean(data.data.result[0].isDefault);
                            this.defaultInfo = (data.data.result[0]);
                        }
                    });
                }
            }

        }
    }
</script>