<template>
    <div class="findpass-box">
        <div class="login-top-box">
            <van-nav-bar title="找回密码" left-arrow >
            <template #left>
                <van-icon name="arrow-left" size="17px" color="#000"/>
            </template>
        </van-nav-bar>
        </div>
        <!-- 背景层 -->
        <TopBackground />
        <!-- 输入框表单 -->
        <div class="fild-box">
            <div class="find-form-box">
                <van-form>
                    <van-cell-group>
                    <van-field
                        label="手机号"
                        left-icon="phone-o"
                        v-model="userFindPass.tel"
                        placeholder="请输入手机号"
                    />
                    <van-field
                        v-model="userFindPass.newpass"
                        clearable
                        label="新密码"
                        :type="isText?'text':'password'"
                        left-icon="edit"
                        :right-icon="isText?'eye-o':'closed-eye'"
                        placeholder="请输入新密码"
                        @click-right-icon="isShowText"
                    />
                    <van-field
                        label="邮箱"
                        left-icon="envelop-o"
                        v-model="userFindPass.iptEmail"
                        placeholder="请输入邮箱"
                    />
                    <van-field
                        v-model="userFindPass.sms"
                        center
                        clearable
                        label="短信验证码"
                        placeholder="请输入短信验证码"
                        >
                        <template #button>
                            <van-button size="small" @click="sendCode" :color="isColor?'gray':'#b87f54'">{{msmMsg}}</van-button>
                        </template>
                    </van-field>
                    </van-cell-group>
                    <div class="sure-btn">
                        <van-button block round type="default" @click="findpass">找回密码</van-button>
                    </div>
                </van-form>
            </div>
        </div>
    </div>
</template>

<script>
import '../assets/less/find.less'
import { utils } from '../assets/js/utils'
import TopBackground from '../components/TopBackground'
    export default {
        name:'findpass',
        components:{
            TopBackground
        },
        data(){
            return {
                //找回密码信息
                userFindPass:{
                    tel:'',
                    newpass:'',
                    sms:'',//验证码
                    iptEmail:'',
                },
                msmMsg:'发送验证码',//发送验证码的文本
                isText:false,//密码输入框是否显示明文
                isColor:false,//控制发送验证码按钮的颜色
                isClick:true,//发送验证码是否可以被点击
                isSuccess:false,// 验证码是否验证成功
            }
        },
        methods:{
            // 是否明文显示
            isShowText(){
                this.isText = !this.isText;
            },
            // 确认找回密码
            findpass(){
                this.checkCode();
                let o = {
                    tel:{
                        value:this.userFindPass.tel,
                        reg:/^1[3-9]\d{9}$/,
                        errorMsg:'手机号码格式不正确'
                    },
                    newpass:{
                        value:this.userFindPass.newpass,
                        reg:/^[A-Za-z]\w{5,15}$/,
                        errorMsg:'密码支持数字字母下划线且要以字母开头'
                    },
                    sms:{
                        value:this.userFindPass.sms,
                        reg:/^[A-Za-z0-9]{6}$/,
                        errorMsg:'验证码错误'
                    },
                    iptEmail:{
                        value:this.userFindPass.iptEmail,
                        reg:/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
                        errorMsg:'邮箱地址格式错误'
                    }
                }
                if(!utils.RegIpt(o) || this.isSuccess){
                    return;
                };
                // 所有验证通过后可以发起请求了

                this.axios({
                    method:'post',
                    url:this.baseURL + '/retrievePassword',
                    data:{
                        appkey:this.appkey,
                        phone:this.userFindPass.tel,
                        password:this.userFindPass.newpass
                    }
                }).then(data=>{
                    console.log('找回密码',data);
                    if(data.data.code == 'L001'){
                        this.$toast({
                            message:data.data.msg+'请重新登录',
                            forbidClick:true,
                            duration:2000,
                        })
                        setTimeout(()=>{
                            this.$router.push({name:'Login'});
                        },2000)
                    }
                });
            },
            // 验证验证码
            // 1903433855
            checkCode(){
                this.axios({
                    method:'post',
                    url:this.baseURL + '/checkValidCode',
                    data:{
                        appkey:this.appkey,
                        validCode:this.userFindPass.sms
                    }
                }).then(data=>{
                    // console.log('验证密码',data);
                    if(data.data.code == 'K001'){
                        this.isSuccess = true;//记得将值重置为false
                    }else {
                        this.$toast({
                            message:data.data.msg,
                            forbidClick:true,
                            duration:1000,
                        })
                    }
                });
            },
            // 发送验证码
            sendCode(){
                if(!this.isClick){
                    return ;
                }

                if(!this.userFindPass.iptEmail){
                    this.$toast({
                            message:'请输入邮箱',
                            forbidClick:true,
                            duration:1000,
                        })
                    return ;
                }
                let  reg = new RegExp(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/);

                if(reg.test(this.userFindPass.iptEmail)){
                    this.axios({
                        method:'post',
                        url:this.baseURL + '/emailValidCode',
                        data:{
                            appkey:this.appkey,
                            email:this.userFindPass.iptEmail
                        }
                    }).then(data=>{
                        // console.log('发送验证码',data);
                        let num = 60;
                        this.isColor = true;
                        let Timer = null;
                        if(this.isClick){
                            this.isClick = false;
                            Timer = setInterval(()=>{
                                num --;
                                this.msmMsg = '还剩'+num+'秒';
                                if(num <= 0){
                                    this.msmMsg = '发送验证码';
                                    clearInterval(Timer);
                                    this.isColor = false;
                                    this.isClick = true;
                                }
                            },1000)
                            if(data.data.code == 'J001'){
                                this.$toast({
                                    message:data.data.msg,
                                    forbidClick:true,
                                    duration:1000,
                                })
                            }
                        }
                    });
                }

            }
        }
    }
</script>
