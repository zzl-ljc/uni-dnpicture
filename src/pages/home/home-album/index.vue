<template>
    <scroll-view class="album_scroll_view" scroll-y @scrolltolower="handleToLower">
        <!--轮播开始-->
        <!--
            轮播三个重要属性：自动轮播autoplay   指示器indicator-dots   衔接轮播circular
            swiper 默认高度150px   image默认宽320px(已重置100%)默认高240px  swiper是不能通过图片撑开的
            解决：计算图片的宽高比例 把比例写的swiper样式中
            swiper-item默认宽高100%
        -->
        <view class="album_swiper">
            <swiper autoplay indicator-dots circular>
                <swiper-item v-for="item in banner" :key="item.id">
                    <image :src="item.thumb"/>
                </swiper-item>
            </swiper>
        </view>
        <!--轮播结束-->

        <!--列表开始-->
        <view class="album_list">
            <!--模板字符串和$花括号结合用-->
            <navigator class="album_item" v-for="item in album" :key="item.id"
           
            :url="`/pages/album/index?id=${item.id}`">
                <view class="album_img">
                    <image :src="item.cover" mode="aspectFill" />
                </view>
                <view class="album_info">
                    <view class="album_name">{{item.name}}</view>
                    <view class="album_desc">{{item.desc}}</view>
                    <view class="album_btn">
                        <view class="album_attention">关注</view>
                    </view>
                </view>
            </navigator>
        </view>
        <!--列表结束-->
    </scroll-view>
</template>
<script>
export default {
    data() {
        return {
            params:{
                limit:30,
                order:'new',
                skip:0
            },
            //轮播图数组
            banner:[],
            //列表数组
            album:[],
            //是否还有分页数据
            hasMore:true
        }
    },
    mounted() {
        //修改页面标题
        uni.setNavigationBarTitle({title:'专辑'});
        //调用接口数据
        this.getList();
    },
    methods: {
        //获取接口数据
        getList() {
            this.request({
                url:'http://157.122.54.189:9088/image/v1/wallpaper/album',
                data:this.params
            })
            .then(result => {
                console.log(result)
                //this.banner = result.res.banner;
                //this.album = result.res.album;
                //因为banner不需要分页 所以判断它每次是否长度为0 为0才给它加载 否则不需要
                if(this.banner.length === 0) {
                    this.banner = result.res.banner;
                }

                //当数据没了后把开关置为false
                if(result.res.album.length === 0) {
                    this.hasMore = false;
                    uni.showToast({
                        title:'我是有底线的！！',
                        icon:'none'
                    })
                    return;
                }
                //因为要分页 改造成拼接数组
                this.album =[...this.album,...result.res.album];
            })
        },
        //上拉加载实现分页
        handleToLower() {
            if(this.hasMore) {
                this.params.skip += this.params.limit;
                this.getList()
            } else {
                uni.showToast({
                    title:'我是有底线的！！',
                    icon:'none'
                })
            }
        }
    },
}
</script>
<style lang="scss" scoped>

/**处理分页加载样式 */
.album_scroll_view{
    height: calc(100vh - 36px);
}

/*处理轮播图片适应问题*/
.album_swiper{
    swiper{
        /*屏幕宽度750rpx  图片把它的宽度/高度得到宽高比例为2.3*/
        height: calc(750rpx / 2.3);
        image{
            height: 100%; /*继承父类高度*/
        }
    }
}

/**列表样式 */
.album_list {
    padding: 10rpx;
  .album_item {
      padding: 10rpx 0;
      display: flex;
      border-bottom: 1rpx solid #ccc;
    .album_img {
        flex: 1;
        padding: 10rpx;
      image {
          width: 200rpx;
          height: 200rpx;
      }
    }

    .album_info {
        flex: 2;
        padding: 0 10rpx;
        /**因为在下面描述中加了不换行 所以会撑开这个容器往右边写内容 导致样式出问题 解决：隐藏右侧撑开部分 */
        overflow: hidden;
      .album_name {
          font-size: 30rpx;
          color: #000;
          padding: 10rpx 0;
      }

    .album_desc {
        padding: 10rpx 0;
        font-size: 24rpx;

        /**折叠描述文字过多  让其隐藏只显示部分加上... */
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .album_btn {
          padding: 10rpx;
          display: flex;
          justify-content: flex-end;
        .album_attention {
            color: $color;
            border: 1rpx solid $color;
            padding: 10rpx;
        }
      }
    }
  }
}

</style>