<template>
    <scroll-view scroll-y enable-flex class="video_main" @scrolltolower="handleScrolltolower">
        <view class="video_item" v-for="item in videowp" :key="item.id" @click="handleGoVideo(item)">
            <image :src="item.img" mode="widthFix" />
        </view>
    </scroll-view>
</template>
<script>
export default {
    data() {
        return {
            videowp:[],
            hasMore:true
        }
    },
    props:{
        urlobj:Object
    },
    watch:{
        urlobj() {
            // console.log(this.urlobj)
            this.videowp = []
            //注意 这里不用清空skip 因为四个分段器分别对应四个接口 这样调用不同接口时 参数的skip初始都是0
            //区别于之前的分类图片页面 它是把热门和最新封装在同个接口
            this.getList();
            
        }
    },
    mounted(){
        //因为有四个分段选项卡 都是放在一个组件中 所以在mounted中只会监听到刚挂载的 而不会监听参数变化的 所以用watch
        //当组件第一次触发时只会在mounted 而watch是不会监听的 当参数变化时watch才会监听到
        // console.log(this.urlobj)
        this.getList()
    },
    methods: {
        getList() {
            this.request({
                url:this.urlobj.url,
                data:this.urlobj.params
            })
            .then(result => {
                //console.log(result)
                if(result.res.videowp.length === 0) {
                    this.hasMore = false;
                    uni.showToast({title:'我是有底线的...',icon:'none'});
                    return;
                }
                //this.videowp = result.res.videowp
                //ES6数组解构
                //但是注意 如果单纯写下面的拼接 只对于一个组件有效 我们有四个分段器放在同一组件中 这样子的话
                //我们在点击一个分段器后再点一个分段器 那么会出现拼接的还是原来的数据 所以点击其他分段器时要
                //清空旧数组 但是我们数组索引的事件是分配在父组件中 所以在子组件数据中可以用到watch监听
                this.videowp = [...this.videowp,...result.res.videowp];
            })
        },
        //滚动条触底分页事件
        handleScrolltolower() {
            //console.log("我触底了")
            if(this.hasMore) {
                this.urlobj.params.skip += this.urlobj.params.limit
                this.getList()
            } else {
                uni.showToast({title:'我是有底线的...',icon:'none'})
            }
        },
        //点击图片事件
        handleGoVideo(item){
            //1、将数据存储到全局共享中去
            getApp().globalData.video = item;
            //2、实现页面跳转
            uni.navigateTo({
                url:'/pages/videoPlay/index'
            })
        }
    },
}
</script>
<style lang="scss" scoped>
.video_main{
    display: flex;
    flex-wrap: wrap;
    /**calc要起作用必须在符号两边留有空格 */
    height: calc( 100vh - 36px );
    .video_item{
        width: 33.33%;
        border: 5rpx solid #fff;
    }
}
</style>