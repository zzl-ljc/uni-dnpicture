<template>
  <!--加这个if判断是因为页面在为加载好时会用undefined数据显示 之后加载一闪而过的问题-->
  <scroll-view
    @scrolltolower="handleToLower"
    class="recommend_view"
    scroll-y
    v-if="recommends.length > 0"
  >
    <!--推荐开始-->
    <view class="recommend_wrap">
      <!--注意：后台规定这里是带参名为target不是id-->
      <navigator class="recommend_item" v-for="item in recommends" :key="item.id"
      :url="`/pages/album/index?id=${item.target}`">
        <image :src="item.thumb" mode="widthFix" />
      </navigator>
    </view>
    <!--推荐结束-->

    <!--月份开始-->
    <view class="month_warp">
      <view class="month_title">
        <view class="month_title_info">
          <view class="month_info">
            <text>{{monthes.DD}} /</text>
            {{monthes.MM}} 月
          </view>
          <view class="month_text">{{monthes.title}}</view>
        </view>
        <view class="month_title_more">更多></view>
      </view>
      <view class="month_content">
        <view class="month_item" v-for="(item, index) in monthes.items" :key="item.id">
          <!--后端封装好了图片路径和规则路径 thumb+rule这样子可以控制图片为较小 加载时更快-->
          <!--说明：aspectFill是保持纵横比缩放图片 使图片完全显示
          widthFix宽度不变 高度自动变化-->

          <!--goDetail是个自定义跳转的组件 图片就好替换组件中插槽slot的位置-->
          <!--实现数据的传递-->
          <go-detail :list="monthes.items" :index="index">
            <image mode="aspectFill" :src="item.thumb+item.rule.replace('$<Height>',360)" />
          </go-detail>
          
        </view>
      </view>
    </view>
    <!--月份结束-->

    <!--热门开始-->
    <view class="hots_wrap">
      <view class="hots_title">
        <text>热门</text>
      </view>
      <view class="hots_content">
        <view class="hot_item" v-for="(item, index) in hots" :key="item.id">
          <go-detail :list="hots" :index="index">
            <image :src="item.thumb" mode="widthFix" />
          </go-detail>
          
        </view>
      </view>
    </view>
    <!--热门结束-->
  </scroll-view>
</template>


<script>
import moment from "moment";
//引入goDetail跳转详情
import goDetail from '@/components/goDetail'
export default {
  components:{
    goDetail
  },
  data() {
    return {
      //推荐列表
      recommends: [],
      //月份 注意：它是个对象不是数组(看api打印)
      monthes: {},
      //热门
      hots: [],
      //请求参数
      params: {
        //要获取多少条数据
        limit: 30,
        //关键字
        order: "hot",
        //要跳过多少条
        skip: 0
      },
      //是否有下一页
      hasMore: true
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    //获取接口数据
    getList() {
      this.request({
        url: "http://157.122.54.189:9088/image/v3/homepage/vertical",
        data: this.params
      }).then(result => {
        console.log(result);

        //判断还有没有下一页数据
        if (result.res.vertical.length === 0) {
          this.hasMore = false;
          uni.showToast({
                title:'我是有底线的！！',
                icon:'none'
            })
          return;
        }
        //之所以写这个条件包裹是因为我们只分页hots而每次调用getlist时前面的数据又要重新加载
        if (this.recommends.length === 0) {
          //第一次发送的请求
          //拿到推荐列表数据
          this.recommends = result.res.homepage[1].items;
          //拿到月份数据
          this.monthes = result.res.homepage[2];
          //改造时间戳格式 用moment.js
          this.monthes.MM = moment(this.monthes.stime).format("MM");
          this.monthes.DD = moment(this.monthes.stime).format("DD");
          //console.log(this.monthes)
        }
        //获取热门数据列表
        //为了数据叠加 用了数组拼接
        this.hots = [...this.hots, ...result.res.vertical];
      });
    },
    //滚动条触底事件
    handleToLower() {
      //1.修改参数 使得skip+=limit
      //2.重新发送getList()请求
      //3.请求成功回来 hots数据叠加
      if (this.hasMore) {
        this.params.skip += this.params.limit;
        this.getList();
      } else {
        //弹出提示用户
        uni.showToast({
          title: "我是有底线的",
          icon: "none"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.recommend_view {
  /** 用scroll-y就要给出高度 高度=屏幕高度-头部标题高度(屏幕高度不能写死) */
  height: calc(100vh - 36px);
}
/**推荐 */
.recommend_wrap {
  display: flex;
  flex-wrap: wrap;
  .recommend_item {
    width: 50%;
    border: 5rpx solid #fff;
  }
}
/**月份 */
.month_warp {
  .month_title {
    display: flex;
    justify-content: space-between;
    padding: 20rpx;
    .month_title_info {
      color: $color;
      font-size: 30rpx;
      font-weight: 600;
      display: flex;
      .month_info {
        text {
          font-size: 36rpx;
        }
      }
      .month_text {
        font-size: 34rpx;
        color: #666;
        margin-left: 30rpx;
      }
    }
    .month_title_more {
      font-size: 25rpx;
      color: $color;
    }
  }
  .month_content {
    display: flex;
    flex-wrap: wrap;
    .month_item {
      width: 33.33%;
      border: 5rpx solid #fff;
    }
  }
}
/**热门 */
.hots_wrap {
  .hots_title {
    padding: 20rpx;
    text {
      border-left: 15rpx solid $color;
      padding-left: 20rpx;
      font-size: 34rpx;
      font-weight: 600;
    }
  }

  .hots_content {
    display: flex;
    flex-wrap: wrap;
    .hot_item {
      width: 33.33%;
      border: 5rpx solid #fff;
    }
  }
}
</style>