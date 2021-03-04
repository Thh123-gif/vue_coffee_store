<template>
    <div class="commend">
      <!-- 推荐商品 -->
      <div class="commend-list" v-for="item in itemsData" :key="item.id">
        <router-link :to="`/details/${item.pid}`" tag="div">
        <div class="img-box">
          <img class="auto-img" :src="item.smallImg" />
        </div>
        <div class="content-box">
          <h3>{{item.name}}</h3>
          <div class="g-user">
            <div class="g-msg">
              <p class="goods-msg van-ellipsis" >{{item.enname}}</p>
              <h2>￥{{item.price}}</h2>
              <div class="like">
                <i>
                  <van-icon name="hot-o" size="2em"/>
                </i>
              </div>
            </div>
          </div>
        </div>
      </router-link>
      </div>
    </div>
</template>

<script>
export default {
    name:'GoodsList',
    props:['itemsData']
}
</script>


<style lang="less" scoped>
    .commend {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-left: 10px;
    box-sizing: border-box;
    margin-bottom: 60px;
    .commend-list {
        width: 47%;
        margin-right: auto;
        position: relative;
        margin-bottom: 74px;
        &:nth-child(2n){
          margin-right: 10px;
        }
        .img-box {
            width: 100%;
            height: 150px;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            overflow: hidden;
            position: relative;
        }
        .content-box {
            position: absolute;
            // top: -45px;
            bottom: -54px;
            width: 100%;
            padding: 10px;
            padding-bottom: 0;
            box-sizing: border-box;
            font-size: 12px;
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
            background-color: #b87f54;
            color: #fff;
            h3 {
                margin:0;
            }
            .g-user {
                .g-msg {
                    overflow: hidden;
                    .goods-msg {
                        // margin: 5px 0;
                        margin: 0;
                        color: rgb(245, 245, 245);
                    }
                    h2 {
                        margin: 0;
                        float: left;
                    }
                    .like {
                        float:right;
                        i {
                            width: 24px;
                            height: 28px;
                            line-height: 28px;
                            display: inline-block;
                        }
                    }
                }
            }

        }
    }
}
</style>