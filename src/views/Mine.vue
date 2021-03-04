<template>
    <div class="top-box">
        <div class="u-bg" :style="`backgroundImage:url(${myMsg.userBg});backgroundSize:100%`"></div>
        <div class="u-changebg">
             <van-uploader v-model="fileList" multiple :max-count="1" :max-size="500 * 1024" :before-read="beforeRead" :after-read="afterRead" @oversize="onOversize"/>
        </div>
        <div class="user-box">
           <div class="user-info">
                <div class="user-img">
                    <img class="auto-img" :src="myMsg.userImg"/>
                </div>
                <div class="u-msg">
                    <div class="u-name">{{myMsg.nickName}}</div>
                    <p>{{myMsg.desc}}</p>
                </div>
           </div>
        </div>
        <div class="content-box">
            <div class="sett">
                <van-cell icon="contact" to="/personal" title="个人资料" is-link />
                <van-cell icon="orders-o" to="/myorder" title="我的订单" is-link />
                <van-cell icon="goods-collect-o" to="/mylike" title="我的收藏" is-link />
                <van-cell icon="location-o" to="/address" title="地址管理" is-link />
                <van-cell icon="setting-o" to="/security" title="安全中心" is-link />
            </div>
        </div>
    </div>
</template>

<script>
import '../assets/less/mine.less'
    export default {
        data(){
            return {
                myMsg:{},//我的信息
                fileList:[],//背景图片信息
                supportType:['jpg','jpeg','png','gif','webp'],//支持的图片格式
                supportFlag:false,//文件受支持状态
            }
        },
        methods:{
            // 返回按钮
            onClickLeft(){
                this.$router.back();
            },
            // 获取我的信息
            checkMy(){
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
                        url: this.baseURL + "/findMy",
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
                        if (data.data.code === 'A001') {
                            this.myMsg = data.data.result[0];
                            this.myMsg.userBg = data.data.result[0].userBg;
                        }
                    }).catch((err) => {
                            this.$toast.clear();
                            console.log("err ==> ", err);
                    });
            },
            // 改变背景图片
            changeBg(){
               let tokenString = this.$cookies.get("tokenString");
                if (!tokenString) {
                    this.$router.push({name:'Login'});
                    return;
                }
                // console.log(this.fileList);
                let baseimg = this.fileList[0].content.split(',')[1];
                let imgType = this.fileList[0].file.type.split('/')[1];
                
                // console.log(this.supportFlag);
                // 文件格式通过后才发起请求
                if(this.supportFlag){
                    this.axios({
                    method: "POST",
                    url: this.baseURL + "/updateUserBg",
                    data: {
                        appkey: this.appkey,
                        tokenString,
                        imgType,
                        serverBase64Img:baseimg
                    },
                    }).then(data => {
                        console.log('修改背景图片',data);
                        this.$toast.clear();
                        if (data.data.code == 700) {
                            this.$router.push({name:'Login'});
                            return;
                        }
                        if (data.data.code === 'I001') {
                            this.$toast({
                                message: data.data.msg,
                                forbidClick: true,
                                duration: 1000,
                            });
                            this.myMsg.userBg = data.data.userBg;
                            this.fileList = [];
                        }
                    }).catch((err) => {
                            this.$toast.clear();
                    });
                }
            },
             // 图片上传前进行认证
            beforeRead(file){
                console.log(file);
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
            afterRead(file){
                this.changeBg();
            },
            // 超过图片上传限制大小
            onOversize(file){
                // console.log(file);
                this.supportFlag = false;
                this.$toast({
                    message:'文件大小不能超过 500kb',
                    duration:2000
                });
            },
        },
        created(){
            //获取我的信息
            this.checkMy();
        }
    }
</script>