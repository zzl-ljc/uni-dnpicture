<template>
  <view>
    <!--用户信息开始-->
    <view class="user_info">
      <view class="user_icon">
        <image :src="imgDetail.user.avatar" mode="widthFix" />
      </view>
      <view class="user_desc">
        <view class="user_name">{{ imgDetail.user.name }}</view>
        <view class="user_time">{{ imgDetail.cTime}}</view>
      </view>
    </view>
    <!--用户信息结束-->
    <!--高清大图开始-->
    <view class="high_img">
      <!--@swiperAction监听子组件传来的数据-->
        <swiper-action @swiperAction="handleSwiperAction">
      <!--大图转为缩略图-->
      <!--这里之所以不直接写图片展示的thumb+rule是因为首先展示的时候还没加载 等报错了 
      才会加载图片 去除这个报错就可这么做-->
      <image :src="imgDetail.thumb" mode="widthFix" />
      </swiper-action>
    </view>
    <!--高清大图结束-->
    <!--点赞开始-->
    <view class="user_rank">
      <view class="rank">
        <text class="iconfont icondianzan">{{imgDetail.rank}}</text>
      </view>
      <view class="user_collect">
        <text class="iconfont iconshoucang">收藏</text>
      </view>
    </view>
    <!--点赞结束-->
    <!--专辑开始-->
    <view class="album_wrap" v-if="album.length">
      <!--标题-->
      <view class="album_title">相关</view>
      <!--内容-->
      <view class="album_list">
        <view class="album_item" v-for="item in album" :key="item.id">
          <view class="album_cover">
            <image :src="item.cover" mode="aspectFill" />
          </view>
          <view class="album_info">
            <view class="album_info_text">专辑</view>
            <view class="album_name">{{item.name}}</view>
            <!--右侧箭头小图标-->
            <text class="iconfont iconiconfontjiantou4"></text>
          </view>
        </view>
      </view>
    </view>
    <!--专辑结束-->
    <!--最热评论comment hot 开始-->
    <view class="comment hot" v-if="hot.length">
      <view class="comment_title">
        <text class="iconfont iconhot1"></text>
        <text class="comment_text">最热评论</text>
      </view>
      <view class="comment_list">
        <view class="comment_item" v-for="item in hot" :key="item.id">
          <!--上：用户信息-->
          <view class="comment_user">
            <!--用户头像-->
            <view class="user_icon">
              <image :src="item.user.avatar" mode="widthFix" />
            </view>
            <!--用户名称-->
            <view class="user_name">
              <view class="user_nickname">{{item.user.name}}</view>
              <view class="user_time">{{item.cTime}}</view>
            </view>
            <!--用户徽章-->
            <view class="user_badge">
              <image v-for="item2 in item.user.title" :key="item2.icon" :src="item2.icon" />
            </view>
          </view>
          <!--下：评论数据-->
          <view class="comment_desc">
            <view class="comment_content">{{item.content}}</view>
            <view class="comment_like">
              <text class="iconfont icondianzan">{{item.size}}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!--最热评论comment hot 结束-->

    <!--最新评论comment new 开始-->
    <view class="comment hot">
      <view class="comment_title" v-if="comment.length">
        <text class="iconfont iconpinglun"></text>
        <text class="comment_text">最新评论</text>
      </view>
      <view class="comment_list">
        <view class="comment_item" v-for="item in comment" :key="item.id">
          <!--上：用户信息-->
          <view class="comment_user">
            <!--用户头像-->
            <view class="user_icon">
              <image :src="item.user.avatar" mode="widthFix" />
            </view>
            <!--用户名称-->
            <view class="user_name">
              <view class="user_nickname">{{item.user.name}}</view>
              <view class="user_time">{{item.cTime}}</view>
            </view>
            <!--用户徽章-->
            <view class="user_badge">
              <image v-for="item2 in item.user.title" :key="item2.icon" :src="item2.icon" />
            </view>
          </view>
          <!--下：评论数据-->
          <view class="comment_desc">
            <view class="comment_content">{{item.content}}</view>
            <view class="comment_like">
              <text class="iconfont icondianzan">{{item.size}}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!--最新评论comment new 结束-->
    <!--下载开始-->
    <view class="download">
      <view class="download_btn" @click="handleDownload">下载图片</view>
    </view>
    <!--下载结束-->
  </view>
</template>
<script>
import swiperAction from '@/components/swiperAction'
import moment from "moment";
//设置语言为中文
moment.locale("zh-cn");
export default {
    components:{
        swiperAction
    },
  data() {
    return {
      //图片信息对象 包含用户头像等信息
      imgDetail: {},
      //专辑数组
      album: [],
      //最热评论
      hot: [],
      //最新评论
      comment: [],
      //图片的索引 因为等下在滑动翻页也要用到 所以提取到外面作为全局变量
      imgIndex:0
    };
  },
  onLoad() {
    //console.log(getApp().globalData)
    const { imgIndex } = getApp().globalData;
    this.imgIndex = imgIndex;
    this.getData();
    
  },
  methods: {
    //给当前页面赋值 因为该段代码需要反复调用 所以封装起来
    getData(){
      const { imgList } = getApp().globalData;
      //数组+索引就能确定这个对象
      this.imgDetail = imgList[this.imgIndex];

      //xxx年前时间格式  atime是秒单位 用到的函数接收是毫秒 所以转换下 cTime转换后默认英文的格式
      this.imgDetail.cTime = moment(this.imgDetail.atime * 1000).fromNow();

      //获取图片详情的id
      //this.imgDetail.id
      this.getComments(this.imgDetail.id);
    },
    getComments(id) {
      this.request({
        url: `http://157.122.54.189:9088/image/v2/wallpaper/wallpaper/${id}/comment`
      }).then(result => {
        //console.log(result)
        this.album = result.res.album;
        //给hot数组添加一个事件属性 XXX月前
        result.res.hot.forEach(v=>v.cTime=moment(v.atime*1000).fromNow());
        result.res.comment.forEach(v=>v.cTime=moment(v.atime*1000).fromNow());

        this.hot = result.res.hot;
        this.comment = result.res.comment;
       

      });
    },
    //滑动事件
    handleSwiperAction(e) {
      //console.log(e);
      /**
       * 1、可以从e中拿到用户所做的滑动方向
       * 2、左滑 就是imgIndex++
       *    右滑 就是imgIndex--
       * 3、判断数组是否越界问题 左滑右滑不能无限制
       * 4、左滑：e.direction ==="left"&&this.imgIndex<imgList.length-1
       *    右滑：e.direction ==="right"&&this.imgIndex>0
       */
      //缓存中的数组对象
      const { imgList } = getApp().globalData;
      if(e.direction === "left" && this.imgIndex < imgList.length -1){
        
        //可以左滑加载下一页
        this.imgIndex++;
        this.getData();
      } else if(e.direction === "right" && this.imgIndex > 0) {
        //右滑加载上一页
        this.imgIndex--;
        this.getData();
      } else {
        //所以越界
        uni.showToast({
          title:'没有更多数据了！',
          icon:'none'
        })
      }
    },
    //点击下载图片
    async handleDownload() {
      //两个接口：uni.downloadFile
      //uni.saveImageToPhotosAlbum
      //1、将远程文件下载到小程序内存中
      //使用Async/Await明显节约了不少代码
      //我们不需要写.then，不需要写匿名函数处理Promise的resolve值，也不需要定义多余的data变量，还避免了嵌套代码
      //函数是异步的前面要写async
      //await只能放在async函数里 用await是为了我们异步代码
      await uni.showLoading({
        title:'下载中...'
      })
      const result1 = await uni.downloadFile({url:this.imgDetail.img})
      //临时路径
      const {tempFilePath}=result1[1];

      //2、将小程序内存中的临时文件下载到本地上
      // uni.saveImageToPhotosAlbum({
      //   filePath:tempFilePath
      // }).then(result =>{})
      const result2 = await uni.saveImageToPhotosAlbum({filePath:tempFilePath})

      //提示用户拟定下载成功
      uni.hideLoading()
      await uni.showToast({
        title:'下载成功！'
      })

    }
  }
};
</script>
<style lang="scss" scoped>
.user_info {
  display: flex;
  padding: 20rpx;
  .user_icon {
    padding: 0 20rpx;
    image {
      width: 88rpx;
      border-radius: 50%;
    }
  }

  .user_desc {
    .user_name {
      color: #000;
      font-weight: 600;
    }

    .user_time {
      color: #ccc;
      font-size: 24rpx;
      padding: 10rpx 0;
    }
  }
}
.high_img{
    image{
        border-bottom: 1rpx solid #eee;
    }
}

/**点赞收藏 */
.user_rank {
  display: flex;
  height: 80rpx;
  border-bottom: 5rpx solid #eee;
  .rank {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    .iconfont {
    }
  }

  .user_collect {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    .iconfont {
    }
  }
}
/**专辑样式 */
view.album_wrap {
  padding: 20rpx;

  .album_title {
    padding: 10rpx 0;
  }

  .album_list {
    .album_item {
      display: flex;
      padding: 10rpx 0;
      border-bottom: 10rpx solid #eee;
      .album_cover {
        flex: 1;
        image {
          width: 180rpx;
          height: 180rpx;
        }
      }

      .album_info {
        flex: 3;
        padding-left: 20rpx;
        position: relative;
        .album_info_text {
          width: 100rpx;
          height: 50rpx;
          background-color: $color;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .album_name {
          padding: 10rpx 0;
          color: #000;
        }
        .iconfont {
          font-size: 40rpx;
          /**这里绝对定位父容器要相对定位 */
          position: absolute;
          /**垂直居中 属于CSS3变换转换技术 */
          top: 50%;
          transform: translateY(-50%);
          right: 10%;
          color: #666;
        }
      }
    }
  }
}

/**最热评论 */
.comment {
  .comment_title {
    padding: 15rpx;
    .iconfon {
      color: red;
      font-size: 40rpx;
    }

    .comment_text {
      font-weight: 600;
      font-size: 28rpx;
      color: #666;
      margin-left: 10rpx;
    }
  }

  /**评论列表 */
  .comment_list {
    .comment_item {
      border-bottom: 15rpx solid #eee;

        /***评论用户 */
      .comment_user {
        padding: 20rpx 0;
        display: flex;
        .user_icon {
          width: 15%;
          display: flex;
          justify-content: center;
          align-items: center;
          image {
            width: 90%;
          }
        }
          .user_name {
            flex: 1;
          
            .user_nickname {
              color: #777;
            }

            .user_time {
              color: #ccc;
              font-size: 24rpx;
              padding: 5rpx 0;
            }
           
         
          }
           /**徽章图标 */
            .user_badge {
            image {
              width: 38rpx;
              height: 38rpx;
              margin-right: 15rpx;
              /**解决元素撑开时换行问题 */
              display: inline-block;
            }
          }
        }
      
        /**评论内容 */
        .comment_desc {
          display: flex;
          padding: 30rpx 0;
          .comment_content {
            flex: 1;
            padding-left: 15%;
            color: #000;
          }

          .comment_like {
            text-align: right;
            padding-right: 15rpx;
            .icondianzan {
            }
          }
        }
      }
    }
  }

/**最新评论 */
.new {
    .iconpinglun {
        color: aqua!important;/**因为少了多层嵌套类 所以要给优先级 */
    }
}
/**下载图片 */
.download {
  height: 120rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  .download_btn {
    width: 90%;
    height: 75%;
    background-color: $color;
    color: #fff;
    font-size: 50rpx;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5rpx;
  }
}
</style>