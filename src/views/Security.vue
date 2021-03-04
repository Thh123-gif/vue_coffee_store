<template>
  <div class="security">
    <div class="p-top-nav">
      <van-nav-bar
        title="安全中心"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
    </div>
    <User>
      <template #fix>
        <div class="content-box">
          <van-cell is-link @click="showPopup" title="修改密码" />
          <van-cell is-link @click="detoryLogin" title="注销账号" />
        </div>
        <div class="bottom-box">
          <van-button color="#854C21" round block @click="logout">退出登录</van-button>
        </div>
      </template>
    </User>
    <van-popup v-model="show" position="bottom" closeable>
      <div class="i-title">修改密码</div>
      <div class="ipt-box">
        <van-field
          v-model="password.oldpass"
          label="旧密码"
          placeholder="旧密码(首字母为字母且5~16位)"
          @click-right-icon="toggleisoText"
          :type="isoText ? 'text' : 'password'"
          :right-icon="isoText ? 'eye-o' : 'closed-eye'"
        />
        <van-field
          v-model="password.newpass"
          label="新密码"
          placeholder="新密码(首字母为字母且5~16位)"
          @click-right-icon="toggleisnText"
          :type="isnText ? 'text' : 'password'"
          :right-icon="isnText ? 'eye-o' : 'closed-eye'"
        />
        <van-button class="sunbmit-btn" round block @click="refixpass">提交</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import TopBackground from '../components/TopBackground'
import User from '../components/User'
    export default {
        data(){
            return {
                show:false,//修改密码弹出层
                password:{//修改密码的数据
                    oldpass:'',
                    newpass:''
                },
                isoText:false,//旧密码是否明文
                isnText:false,//新密码是否明文
            }
        },
        components:{
            TopBackground,
            User
        },
        methods:{
            // 返回按钮
            onClickLeft(){
                this.$router.back();
            },
            // 显示修改密码弹出层
            showPopup(){
                this.show = !this.show;
            },
            // 旧密码切换文本类型
            toggleisoText(){
                this.isoText = !this.isoText;
            },
            // 新密码切换文本类型
            toggleisnText(){
                this.isnText = !this.isnText;
            },
            // 销毁账号
            detoryLogin(){
                this.alertshow = !this.alertshow;
                this.$dialog.confirm({
                    title: '注销账号',
                    message: '是否确定注销账号，一旦注销无法恢复！',
                }).then(() => {
                    // console.log("确认");
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
                        url: this.baseURL + "/destroyAccount",
                        data: {
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
                        if (data.data.code === 'G001') {
                            this.$toast({
                                message:data.data.msg,
                                duration:2000
                            });
                        }
                    }).catch((err) => {
                          this.$toast.clear();
                          console.log("err ==> ", err);
                          this.$toast({
                              message:'销毁账户失败，请重试！',
                              duration:2000
                          });
                    });
                }).catch(() => {
                    // on cancel
                    console.log("取消");
                })
            },
            //修改密码
            refixpass(){
                // console.log(this.password);
                 let tokenString = this.$cookies.get("tokenString");
                    if (!tokenString) {
                        this.$router.push({name:'Login'});
                        return;
                    }
                    
                    if(this.password.oldpass == '' || this.password.newpass == ''){
                      this.$toast({
                        message: "密码不能为空",
                        forbidClick: true,
                        duration: 1000,
                      });
                      return;
                    }
                    this.$toast.loading({
                        message: "加载中...",
                        forbidClick: true,
                        duration: 0,
                    });

                    this.axios({
                        method: "POST",
                        url: this.baseURL + "/updatePassword",
                        data: {
                            appkey: this.appkey,
                            tokenString,
                            password:this.password.newpass,
                            oldPassword:this.password.oldpass
                        },
                    }).then(data => {
                        // console.log(data);
                        this.$toast.clear();
                        if (data.data.code == 700) {
                          this.$router.push({name:'Login'});
                           this.$toast({
                                message:data.data.msg,
                                duration:2000
                          });
                          return;
                        }
                        if (data.data.code === 'E001') {
                            this.$toast({
                                message:data.data.msg,
                                duration:2000
                            });
                            this.show = false;
                            setTimeout(()=>{
                              this.$toast({
                                  message:'请重新登录',
                                  duration:2000
                              });
                              this.$router.push({name:'Login'});
                            },2000)
                        }
                    }).catch((err) => {
                            this.$toast.clear();
                            // console.log("err ==> ", err);
                            // this.$toast({
                            //     message:'修改密码错误',
                            //     duration:2000
                            // });
                    });
            },
            // 退出登录
            logout(){
                 let tokenString = this.$cookies.get("tokenString");
                    if (!tokenString) {
                        this.$toast.loading({
                            message: "尚未登录",
                            forbidClick: true,
                            duration: 0,
                        });
                        return;
                    }
                    this.$toast.loading({
                        message: "加载中...",
                        forbidClick: true,
                        duration: 0,
                    });

                    this.axios({
                        method: "POST",
                        url: this.baseURL + "/logout",
                        data: {
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
                        if (data.data.code === 'F001') {
                            this.$toast({
                                message:data.data.msg,
                                duration:2000
                            });
                            setTimeout(()=>{
                              this.$router.push({name:'Login'});
                            },2000)
                        }
                    }).catch((err) => {
                        this.$toast.clear();
                        console.log("err ==> ", err);
                    });
            },
        },
        created(){
        }
    }
</script>

<style lang="less" scoped>
.security {
  /deep/ .van-nav-bar__text,
  /deep/ .van-nav-bar .van-icon {
    color: #854c21;
  }
  height: calc(100vh - 46px);
  background: #eee;
  .p-top-nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    margin-bottom: 46px;
  }
  .bottom-box {
    position: fixed;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
  }
  .i-title {
    margin-top: 10px;
    margin-left: 10px;
    font-size: 16px;
    color: #666;
  }
  .ipt-box {
    padding: 20px 0;
    .sunbmit-btn {
      width: 90%;
      margin: 20px auto 0;
    }
  }
}
</style>