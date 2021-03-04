<template>
    <div class="orderList">
        <div class="allorder">
            <div class="or-title">
               <slot name='title'></slot>
            </div>
            <!--订单商品-->
            <slot name="product-item"></slot>
            <div class="hr"></div>
            <div class="or-product-msg">
                <div class="or-bottom-box">
                    <div class="or-bt-msg">
                        <span class="or-total-number">共计<span class="margin-text">{{myOrderList.count}}</span>件</span>
                        <span class="or-total-price">合计￥{{myOrderList.total}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name:'OrderList',
        props: {
            myOrderList: {
                type: Object,
                default() {
                    return {
                        count: 0,
                        total: 0,
                        date: ''
                    };
                }
            },
        },
        filters:{
            // formatTime(value){
            //       var today = new Date(value);
            //       let y = today.getFullYear();
            //       let m = today.getMonth() + 1;
            //       let d = today.getDate();
            //       let h = today.getHours();
            //       let f = today.getMinutes();
            //       let s = today.getSeconds();
            //       return `${y}-${m}-${d} ${h}:${f}:${s}`;
            // }
        }
    }
</script>

<style lang="less" scoped>
     .allorder {
         background: #fff;
        border-radius: 5px;
        overflow: hidden;
        margin: 10px 0;
        .or-title {
            padding: 5px 10px 5px 10px;
            box-sizing: border-box;
            display: flex;
            color: #888;
            .settings {
                margin-left: auto;
                span {
                    margin-right: 10px;
                }
                i {
                    vertical-align: -1.5px;
                }
            }
        }
        .or-goods-msg {
            height: 60px;
            display: flex;
            margin: 5px 20px 20px 10px;
            .or-img-box {
                width: 60px;
                height: 60px;
                background-color: rosybrown;
            }
            .or-right-content {
                flex: 1;
                padding-left: 10px;
                box-sizing: border-box;
            }
            .right-content-title {
                span {
                    margin-right: 5px;
                    color: #666;
                }
            }
            p {
                margin: 3px 0 10px 0;
                color: #999;
            }
            .or-price-box {
                display: flex;
                .or-price {
                    color: #854C21;
                    font-size: 15px;
                    font-weight: bold;
                }
                .or-number {
                    margin-left: auto;
                }
            }
        }
    }
    .hr {
        width: 100%;
        height: 1px;
        border-bottom: 1px dashed #999;
        position: relative;
        &::before {
            content: "";
            display: inline-block;
            width: 15px;
            height: 15px ;
            border-radius: 50%;
            background-color: #eee;
            position: absolute;
            left: -7px;
            top: -5px;
        }
        &::after {
            content: "";
            display: inline-block;
            width: 15px;
            height: 15px ;
            border-radius: 50%;
            background-color: #eee;
            position: absolute;
            right: -7px;
            top: -5px;
        }
    }
    .or-product-msg {
        padding: 20px;
        box-sizing: border-box;
        .or-bottom-box {
            .time {
                color: #999;
            }
            .margin-text {
                margin: 0 5px;
                color: #854C21;
                font-weight: bold;
            }
            .or-bt-msg {
                display: flex;
                .or-total-number {
                    color: #999;
                }
                .or-total-price {
                    color: #854C21;
                    font-weight: bold;
                    margin-left: auto;
                }
            }
        }
    }
</style>