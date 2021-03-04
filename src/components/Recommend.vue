<template>
    <GoodsList :itemsData="hotGoodsList"></GoodsList>
</template>

<script>
import GoodsList from './GoodsList'
export default {
    data(){
        return {
            hotGoodsList:[],//推荐商品
        }
    },
    created(){
        this.getHotRecommend();
    },
     components:{
        GoodsList
    },
    methods:{
         // 获取热门推荐的内容
        getHotRecommend(){
        this.axios({
            method:'GET',
            url:this.baseURL + '/typeProducts',
            params:{
                appkey:this.appkey,
                key:'isHot',
                value:1
            }
        }).then(data=>{
            if(data.data.code == 500){
            this.hotGoodsList = data.data.result;
            }
            // console.log(data);
        })
        }
    }
}
</script>
