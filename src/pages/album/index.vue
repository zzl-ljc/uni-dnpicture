<template>
    <view>
        <!--专辑背景开始-->
        <view class="album_bg">
            <image :src="album.cover" mode="widthFix" />
            <view class="album_info">
                <view class="album_name">{{ album.name }}</view>
                <view class="album_tbn">关注专辑</view>
            </view>
        </view>
        <!--专辑背景结束-->
        
        <!--专辑作者开始-->
        <view class="album_author">
            <view class="album_author info">
                <image mode="widthFix" :src="album.user.avatar" />
                <view class="author_name">{{album.user.name}}</view>
            </view>
            <!--如果后台返回的数据有换行或空格等特殊字符 view识别不了 所以文本可以加个text-->
            <view class="album_author_desc"><text>{{album.desc}}</text></view>
        </view>
        <!--专辑作者结束-->

        <!--列表开始-->
        
        <view class="album_list">
            <view class="album_item" v-for="(item,index) in wallpaper" :key="item.id">
                <go-detail :list="wallpaper" :index="index">
                <image mode="aspectFill" :src="item.thumb+item.rule.replace('$<Height>',360)" />
                </go-detail>
            </view>
        </view>
        
        <!--列表结束-->
    </view>
</template>

<script>
import goDetail from '@/components/goDetail'
export default {
    components:{
        goDetail
    },
    data() {
        return {
            params:{
                limit:30,
                order:'new',
                skip:0,
                //first为0：返回值中只有wallpaper数组 不是第一次请求数据
                //first为1：返回值中有album对象 表示第一次请求数据
                first:1    
            },
            id:-1,
            album:[],
            wallpaper:[],
            hasMore:true
        }
    },
    onLoad(options) {
        //console.log(options)
        this.id = options.id;
        //this.id = "5d5f8e45e7bce75ae7fb8278";
        this.getList()
    },
    //页面触底 上拉加载下一页事件
    onReachBottom() {
        if(this.hasMore) {
            //设置first为0表示后面的请求了 不再是第一次加载时
            this.params.first = 0;
            this.params.skip += this.params.limit;
            this.getList();
        } else {
            uni.showToast({
                title:'我是有底线的！！',
                icon:'none'
            })
        }
    },
    methods: {
        getList() {
            this.request({
                url:`http://157.122.54.189:9088/image/v1/wallpaper/album/${this.id}/wallpaper`,
                data:this.params
            })
            .then(result => {
                //console.log(result)
                //注意：此时this.album是一个对象 不能直接和数组一样判断长度 要加Object.keys
                if(Object.keys(this.album).length === 0){
                    this.album = result.res.album;
                }
                
                if(result.res.wallpaper.length === 0) {
                    this.hasMore = false;
                    uni.showToast({
                        title:'我是有底线的！！',
                        icon:'none'
                    })
                    return;
                }
                this.wallpaper = [...this.wallpaper,...result.res.wallpaper];
            })
        }
    },
}
</script>

<style lang="scss" scoped>
/**详情专辑背景样式 */
.album_bg {
    position: relative;
  
  .album_info {
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 0;
      display: flex;
      justify-content: space-between;
      height: 80rpx;
      align-items: center;
      color: #fff;
      padding: 0 15rpx;
    .album_name {
        font-size: 40rpx;
    }

    .album_tbn {
        background-color: $color;
        width: 152rpx;
        height: 60rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10rpx;

    }
  }
}

/**作者样式 */
.album_author {
    padding: 10rpx;
  .album_author.info {
     padding: 10rpx 0;
     display: flex;
    image {
        width: 50rpx;
        height: 50rpx;
    }

    .author_name {
        color: #000;
        margin-left: 15rpx;
    }
  }

  .album_author_desc {

  }
}

/**图片列表样式 */
.album_list {
    display: flex;
    flex-wrap: wrap;
  .album_item {
      width: 33.33%;
      border: 5rpx solid #fff;
    image {
      height: 180rpx;
    }
  }
}
</style>


