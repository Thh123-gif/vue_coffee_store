<template>
    <div class="login-box">
        <div class="login-top-box">
            <van-nav-bar title="登录" left-arrow >
            <template #left>
                <van-icon name="arrow-left" size="17px" color="#000"/>
            </template>
            <template #right>
                <div class="right-content" @click="goto">先逛一逛</div>
            </template>
        </van-nav-bar>
        </div>
        <!-- 背景层 -->
        <TopBackground />
        <div class="wel">
            <span class="wel-text">欢迎回来!</span>
            <span class="please">先登录一下吧</span>
        </div>
        <!-- 登录表单 -->
        <div class="form">
           <div class="ipt-form">
                <van-form>
                    <van-cell-group>
                        <van-field
                            label="手机号"
                            left-icon="phone-o"
                            v-model="userLoginInfo.userphone"
                            placeholder="请输入手机号"
                        />
                        <van-field
                            v-model="userLoginInfo.password"
                            clearable
                            label="密码"
                            :type="isText?'text':'password'"
                            left-icon="edit"
                            :right-icon="isText?'eye-o':'closed-eye'"
                            placeholder="请输入密码"
                            @click-right-icon="isShowText"
                        />
                    </van-cell-group>
                    <div class="forget">
                        <span @click="showFindPass">忘记密码?</span>
                    </div>
                </van-form>
            </div>
        </div>
        <div class="btns">
            <div class="login-btn">
                <van-button round block type="info" native-type="submit" @click="regLogin">登&nbsp;&nbsp;录</van-button>
            </div>
            <div class="registered-btn">
                <van-button block round type="default" @click="isShowPopup">注&nbsp;&nbsp;册</van-button>
            </div>
        </div>
        <!-- 注册弹出框 -->
        <van-popup v-model="isShow" round closeable position="bottom">
            <div class="form-box">
                <van-form>
                    <van-cell-group>
                    <van-field
                        label="用户名"
                        left-icon="user-circle-o"
                        v-model="userRegiterInfo.nickName"
                        placeholder="请输入用户名"
                    />
                    <van-field
                        label="手机号"
                        left-icon="phone-o"
                        v-model="userRegiterInfo.userphone"
                        placeholder="请输入手机号"
                    />
                    <van-field
                        v-model="userRegiterInfo.password"
                        clearable
                        label="密码"
                        :type="isText?'text':'password'"
                        left-icon="edit"
                        :right-icon="isText?'eye-o':'closed-eye'"
                        placeholder="请输入密码"
                        @click-right-icon="isShowText"
                    />
                    </van-cell-group>
                    <div class="registered-btn">
                        <van-button block round type="default" @click="registered">注&nbsp;&nbsp;册</van-button>
                    </div>
                </van-form>
            </div>
        </van-popup>
    </div>
</template>

<script>
import '../assets/less/login.less'
import { utils } from '../assets/js/utils'
import TopBackground from '../components/TopBackground'
//模板中局部引入
// import axios from 'axios';//this.axios使用
export default {
    name:'Login',
    components:{
        TopBackground
    },
    data(){
        return {
            // 用户登录信息
            userLoginInfo:{
                userphone:'',
                password:''
            },
            // 用户注册信息
            userRegiterInfo:{
                userphone:'',
                nickName:'',
                password:''
            },
            isShow:false,//是否显示注册弹出层
            isText:false,//密码输入框是否显示明文
        }
    },
    methods:{
        //先逛一逛
        goto(){
            this.$router.push({name:'Home'});
        },
        //是否显示弹出层
        isShowPopup(){
            this.isShow = true;
        },
        // 是否明文显示
        isShowText(){
            this.isText = !this.isText;
        },
        // 登录表单验证
        regLogin(){
            let o = {
                phone:{
                    value:this.userLoginInfo.userphone,
                    reg:/^1[3-9]\d{9}$/,
                    errorMsg:'手机号格式不正确'
                },
                password:{
                    value:this.userLoginInfo.password,
                    reg:/^[A-Za-z]\w{5,15}$/,
                    errorMsg:'密码支持数字字母下划线且必须为字母开头'
                }
            }
            if(!utils.RegIpt(o)){
                return;
            }
            //发起登录请求
            this.$toast.loading({
                message: '加载中...',
                forbidClick: true,
                duration: 0
            });
            this.axios({
                method: 'POST',
                url: this.baseURL + '/login',
                data: {
                    appkey: this.appkey,
                    password: this.userLoginInfo.password,
                    phone: this.userLoginInfo.userphone
                }
            }).then(res => {
                this.$toast.clear();
                if (res.data.code === 200) {
                    //登录完成后存储token
                    this.$cookies.set('tokenString', res.data.token, '1d');
                    this.$router.push({name:'Home'});
                } else {
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 5000
                        })
                    }
                })
        },
        //注册表单验证
        registered(){
            let o = {
                userphone:{
                    value:this.userRegiterInfo.userphone,
                    reg:/^1[3-9]\d{9}$/,
                    errorMsg:'手机号码格式不正确'
                },
                username:{
                    value:this.userRegiterInfo.username,
                    reg:/^[\u4e00-\u9fa5A-Z-a-z0-9]{1,10}$/,
                    errorMsg:'用户名支持汉字、数字、字母'
                },
                password:{
                    value:this.userRegiterInfo.password,
                    reg:/^[A-Za-z]\w{5,15}$/,
                    errorMsg:'密码支持数字字母下划线且要以字母开头'
                }
            }
            if(!utils.RegIpt(o)){
                return;
            };
            this.$toast.loading({
                message: '验证中...',
                forbidClick: true,
            });
            this.axios({
                method:'post',
                url:this.baseURL + '/register',
                data:{
                    appkey:this.appkey,
                    nickName:this.userRegiterInfo.nickName,
                    password:this.userRegiterInfo.password,
                    phone:this.userRegiterInfo.userphone
                }
            }).then(data=>{
                // this.$toast.clear();
                if(data.data.code == 100){
                    this.$toast.loading({
                        message: data.data.msg,
                        forbidClick: true,
                        duration: 5000
                    });
                    this.isShow = false;
                    for(let key in this.userRegiterInfo){
                        this.userRegiterInfo[key] = '';
                    }
                }else{
                    this.$toast({
                        message: data.data.msg,
                        forbidClick: true,
                        duration: 5000
                    });
                }
                console.log(data);
                this.$toast.clear();
            }).catch(err =>{
                this.$toast.clear();
                console.log(err);
            })
        },
        // 找回密码
        showFindPass(){
            this.$router.push({name:'Findpass'});
        },
    }
};
</script>