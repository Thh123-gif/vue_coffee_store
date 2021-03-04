<template>
    <div class="mylike">
        <div class="p-top-nav">
            <van-nav-bar
                title="我的收藏"
                left-text="返回"
                left-arrow
                @click-left="onClickLeft"
            />
        </div>
        <User>
              <template #fix>
                <div class="content-box">
                    <ul class="goods-list">
                        <li class="goods" v-for="(item,index) in likeList" :key="item.id">
                            <div class="img-box">
                                <img class="auto-img" :src="item.smallImg" />
                            </div>
                            <div class="m-msg">
                                <span class="ch-name">{{item.name}}</span>
                                <p class="van-ellipsis">{{item.enname}}</p>
                                <div class="m-price">
                                    <span>￥{{item.price}}</span>
                                    <van-icon @click="del(item,index)" name="delete-o" size="15"/>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </template>
        </User>
    </div>
</template>

<script>
import User from '../components/User'
    export default {
        data(){
            return {
                likeList:[],//收藏数据列表
            }
        },
        components:{
            User
        },
        methods:{
            // 返回按钮
            onClickLeft(){
                this.$router.back();
            },
            // 获取我的收藏信息
            getmylikeData(){
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
                    url: this.baseURL + "/findAllLike",
                    params: {
                        appkey: this.appkey,
                        tokenString,
                    },
                }).then(data => {
                    this.$toast.clear();
                    // console.log(data);
                    if(data.data.code == 2000){
                        this.likeList = data.data.result;
                    }

                })
            },
            // 点击删除取消收藏
            del(item,index){
                // console.log(item,index);
                let tokenString = this.$cookies.get('tokenString');
                this.$axios({
                    url:this.baseURL+'/notlike',
                    method:'POST',
                    data:{
                        appkey:this.appkey,
                        pid:item.pid,
                        tokenString
                    }
                }).then(data=>{
                    // console.log(data);
                    if(data.data.code == 700){
                        //错误信息
                        this.$toast({
                            message: data.data.msg,
                            forbidClick: true,
                            duration: 1000,
                        });
                        this.$router.push({name:'Login'});
                        return ;
                    }else if(data.data.code == 900 && data.data.result == 1){
                        this.likeList.splice(index,1);
                        this.$toast({
                            message:data.data.msg,
                            forbidClick:true,
                            duration:1000,
                        });
                    }
                })
            }
        },
        created(){
            // 获取收藏的数据
            this.getmylikeData();
        }
    }
</script>

<style lang="less" scoped>
    .mylike {
        /deep/ .van-nav-bar__text , /deep/ .van-nav-bar .van-icon {
            color: #854C21;
        }
        background: #eee;
        height: calc(100vh - 46px);
        .p-top-nav {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
        }
        .goods-list {
            display: flex;
            flex-wrap: wrap;
            // justify-content: space-between;
            padding: 0 10px;
            box-sizing: border-box;
        }
        .goods {
            width: 31%;
            margin-top: 5px;
            margin-left: 5px;
            .img-box {
                width: 100%;
                height: 100px;
                background: forestgreen;
            }
            .m-msg {
                margin-left: 5px;
                margin-top: 5px;
                .ch-name {
                    color: #666;
                }
                p {
                    margin: 0;
                    color: #999;
                }
                .m-price {
                    margin: 3px 0;
                    display: flex;
                    span {
                        font-size: 17px;
                        font-weight: bold;
                        color: #854C21;
                        margin-right: auto;
                    }
                    i {
                        margin-top: 5px;
                    }
                }
            }
        }
    }
</style>