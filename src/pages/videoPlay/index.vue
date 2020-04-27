<template>
    <view class="video_play">
        <!--背景-->
        <image :src="videoObj.img"></image>
        <!--工具栏开始-->
        <view class="video_tool">
            <view @click="muted = !muted" :class="['iconfont',muted?'iconjingyin':'iconshengyin']"></view>
            <view class="iconfont iconzhuanfa">
                <button open-type="share"></button>
            </view>
        </view>
        <!--工具栏结束-->
        <!--视频开始-->
        <view class="video_wrap">
            <video :muted="muted" :src="videoObj.video" objectFit="fill"></video>
        </view>
        <!--视频结束-->
        <!--下载开始-->
        <view class="download">
            <view class="download-btn" @click="handleDownload">下载高清</view>
        </view>
        <!--下载结束-->
    </view>
</template>
<script>
export default {
    data() {
        return {
            videoObj:{},
            //是否静音
            muted:false
        }
    },
    onLoad() {
        //console.log(getApp().globalData)
        this.videoObj = getApp().globalData.video;
    },
    methods: {
        //下载视频
        async handleDownload() {
            await uni.showLoading({title:'下载中...'});
            //1、将远程文件下载到小程序的内存中 
            const {tempFilePath} = (await uni.downloadFile({url:this.videoObj.video}))[1];
            //2、将内存中的文件下载的本地
            await uni.saveVideoToPhotosAlbum({filePath:tempFilePath});
            uni.hideLoading();
            await uni.showToast({title:'下载成功'});
        }
    },
}
</script>
<style lang="scss" scoped>
.video_play {
 position: relative;
  image {
      position: absolute;
      width: 100%;
      height: 100vh;
      z-index: -1;
      //css3的滤镜效果
      filter: blur(20px);
  }

  .video_tool {
      height: 80rpx;
      display: flex;
      justify-content: flex-end;
    .iconfont{
        width: 80rpx;
        color: #fff;
        font-size: 50rpx;
        border-radius: 40rpx;
        background-color: rgba(0,0,0,.2);
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 20rpx;
    }
    .iconzhuanfa {
        position: relative;
        button {
            position: absolute;
            width: 100%;
            height: 100%;
            opacity: 0;
        }
    }
  }

  .video_wrap {
      display: flex;
      justify-content: center;
    video {
        width: 360rpx;
        height: 600rpx;
    }
  }

  .download {
      display: flex;
      justify-content: center;
      margin-top: 30rpx;
    .download-btn {
        width: 360rpx;
        height: 80rpx;
        border-radius: 40rpx;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1rpx solid #fff;
        background-color: rgba(0,0,0,.5);
    }
  }
}
</style>