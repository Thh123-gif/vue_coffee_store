<template>
    <GoodsList :itemsData="ruinaiceGoodsList"></GoodsList>
</template>

<script>
import GoodsList from './GoodsList'
export default {
    data(){
        return {
            ruinaiceGoodsList:[],//推荐商品
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
                key:'type',
                value:'rena_ice'
            }
        }).then(data=>{
            if(data.data.code == 500){
            this.ruinaiceGoodsList = data.data.result;
            }
            // console.log(data);
        })
        }
    }
}
</script>