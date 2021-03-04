<template>
    <div class="personal">
         <div class="p-top-nav">
            <van-nav-bar
                title="个人资料"
                left-text="返回"
                left-arrow
                @click-left="onClickLeft"
            />
        </div>
        <User>
              <template #fix>
                <div class="content-box">
                    <van-cell @click="fixuserImg" title="头像" class="l-height">
                        <div class="u-img">
                           <div class="per-img-box">
                                <img class="auto-img" :src="personalMsg.userImg" />
                                <div class="fix-user-img">
                                    <van-uploader v-model="fileList" multiple :max-count="1" :max-size="500 * 1024" :before-read="beforeRead" :after-read="afterRead" @oversize="onOversize"/>
                                </div>
                           </div>
                        </div>
                    </van-cell>
                    <van-cell title="用户ID" :value="personalMsg.userId" />
                    <van-cell @click="fixnickName" title="昵称" :value="personalMsg.nickName" />
                    <van-cell @click="fixMsg" title="简介" :value="personalMsg.desc" />
                </div>
            </template>
        </User>
        <van-popup position="bottom" round v-model="show" :style="{ height: '30%' }">
           <div class="p-fix-show">
                <p>修改{{fixName}}</p>
                <van-field v-model="iptValue" :label="fixName+'：'" :placeholder="'请输入'+fixName" />
                <div class="p-sure-btn">
                    <van-button round block @click="fixSure">确定</van-button>
                </div>
           </div>
        </van-popup>
    </div>
</template>

<script>
import TopBackground from '../components/TopBackground'
import User from '../components/User'
    export default {
        components:{
            TopBackground,
            User
        },
        data(){
            return {
                personalMsg:[],//个人资料数据
                show:false,//弹出层
                fixName:'',//弹出层的标题
                iptValue:'',//修改输入框
                fileList : [],//图片信息
                supportType:['jpg','jpeg','png','gif','webp'],//支持的图片格式
                supportFlag:false,//文件受支持状态
            }
        },
        methods:{
            // 返回按钮
            onClickLeft(){
                this.$router.back();
            },
            // 获取个人资料信息
            getPersonalData(){
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
                        url: this.baseURL + "/findAccountInfo",
                        params: {
                            appkey: this.appkey,
                            tokenString,
                        },
                    }).then(data => {
                        console.log(data);
                        this.$toast.clear();
                        if (data.data.code == 700) {
                          this.$router.push({name:'Login'});
                          return;
                        }
                        if (data.data.code === 'B001') {
                            this.personalMsg = data.data.result[0];
                        }
                    }).catch((err) => {
                            this.$toast.clear();
                    });
            },
            // 修改昵称
            fixnickName(){
                this.fixPopOut('昵称');
                if(this.iptValue == ''){
                    return;
                }
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
                        method: "POST",
                        url: this.baseURL + "/updateNickName",
                        data: {
                            appkey: this.appkey,
                            tokenString,
                            nickName:this.iptValue
                        },
                    }).then(data => {
                        console.log(data);
                        this.$toast.clear();
                        if (data.data.code == 700) {
                          this.$router.push({name:'Login'});
                          return;
                        }
                        if (data.data.code === 'C001') {
                            this.$toast({
                                message: data.data.msg,
                                forbidClick: true,
                                duration: 1000,
                            });
                            this.personalMsg.nickName = data.data.nickName;
                        }
                    }).catch((err) => {
                            this.$toast.clear();
                    });
            },
            //修改信息的弹出层
            fixPopOut(name){
                this.show = true;
                this.fixName = name;
            },
            // 修改头像
            fixuserImg(){
                this.showImg = true;
            },
            // 超过图片上传限制大小
            onOversize(file){
                console.log(file);
                this.$toast({
                    message:'文件大小不能超过 500kb',
                    duration:2000
                });
            },
            // 图片上传前进行认证
            beforeRead(file){
                // console.log(file);
                let fileType = file.type.split('/')[1];
                if(fileType == 'undefined'){
                    this.supportFlag = false;
                    return false;
                }
                this.supportType.forEach(v=>{
                    if(fileType == v){
                        this.supportFlag = true;
                        return true;
                    }
                })

                if(!this.supportFlag){
                    this.$toast({
                        message: "暂不支持该文件",
                        forbidClick: true,
                        duration: 1000,
                    });
                    return false;
                }else {
                    return true;
                }
            },
            // 图片上传完成后
            afterRead(){
                // console.log(this.fileList);
                if(this.fileList == ''){
                    this.$toast({
                        message: "未选择图片",
                        forbidClick: true,
                        duration: 1000,
                    });
                    return;
                }
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

                let baseimg = this.fileList[0].content.split(',')[1];
                let imgType = this.fileList[0].content.split('/')[1];
                
                // console.log(this.supportFlag);
                // 文件格式通过后才发起请求
                if(this.supportFlag){
                    this.axios({
                    method: "POST",
                    url: this.baseURL + "/updateAvatar",
                    data: {
                        appkey: this.appkey,
                        tokenString,
                        imgType,
                        serverBase64Img:baseimg
                    },
                    }).then(data => {
                        // console.log(data);
                        this.$toast.clear();
                        if (data.data.code == 700) {
                            this.$router.push({name:'Login'});
                            return;
                        }
                        if (data.data.code === 'H001') {
                            this.$toast({
                                message: data.data.msg,
                                forbidClick: true,
                                duration: 1000,
                            });
                            this.personalMsg.userImg = data.data.userImg;
                            this.fileList = [];//重置
                        }
                        this.showImg = false;
                    }).catch((err) => {
                            this.$toast.clear();
                    });
                }


            },
            // 修改简介
            fixMsg(name){
                this.fixPopOut('简介');
                  if(this.iptValue == ''){
                    return;
                }
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
                        method: "POST",
                        url: this.baseURL + "/updateDesc",
                        data: {
                            appkey: this.appkey,
                            tokenString,
                            desc:this.iptValue
                        },
                    }).then(data => {
                        console.log(data);
                        this.$toast.clear();
                        if (data.data.code == 700) {
                          this.$router.push({name:'Login'});
                          return;
                        }
                        if (data.data.code === 'D001') {
                            this.$toast({
                                message: data.data.msg,
                                forbidClick: true,
                                duration: 1000,
                            });
                            this.personalMsg.desc = data.data.desc;
                        }
                    }).catch((err) => {
                            this.$toast.clear();
                    });
            },
            // 确认修改
            fixSure(){
                if(this.fixName == '昵称'){
                    this.fixnickName();
                }else if(this.fixName == '简介'){
                    this.fixMsg();
                }
                this.iptValue = '';
                this.show = false;
            }
        },
        created(){
            this.getPersonalData();
        }
    }
</script>

<style lang="less" scoped>
    .personal {
        /deep/ .van-nav-bar__text , /deep/ .van-nav-bar .van-icon {
            color: #854C21;
        }
        /deep/ .van-cell__title {
            flex: .5;
        }
        /deep/ .van-cell__value {
            flex: 1;
        }
        background: #eee;
        height: calc(100vh - 46px);
        .p-top-nav {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
        }
        .l-height {
            line-height: 40px;
        }
        .u-img {
            width: 100%;
            .per-img-box {
                width: 50px;
                height: 50px;
                margin-left: auto;
                position: relative;
                img {
                    width: 100%;
                    vertical-align: middle;
                    border-radius: 50%;
                    margin-left: auto;
                }
                .fix-user-img {
                    width: 50px;
                    height: 50px;
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 9;
                    opacity: 0;
                    /deep/ .van-uploader, /deep/ .van-uploader__upload ,/deep/ .van-uploader__input {
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
        .p-fix-show {
            padding: 10px;
            box-sizing: border-box;
            p {
                margin: 10px;
                font-size: 17px;
            }
            .p-sure-btn {
                padding-top: 50px;
            }
        }
        .updata-img-box {
            text-align: center;
            padding: 10px;
            box-sizing: border-box;
        }
    }
</style>