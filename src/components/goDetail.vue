<template>
  <view @click="handleClick">
    
    <slot></slot>
  </view>
</template>
<script>
export default {
  props: {
    list: Array,//父组件传过来的数据：类型
    index: Number
  },
  mounted() {
    // console.log(this.list)
    // console.log(this.index)
  },
  methods: {
      handleClick() {
          //1.把数据缓存下来(注意globalData小程序退出后会清除但是storage缓存不会 所以这里用globalData全局变量)
          getApp().globalData.imgList = this.list;
          getApp().globalData.imgIndex = this.index;
          //2.实现点击跳转页面
          uni.navigateTo({
              url:'/pages/imgDetail/index'
          })
      }
  },
};
</script>
<style scoped>
</style>