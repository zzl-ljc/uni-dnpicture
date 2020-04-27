/**
组件两个功能：1、提供插槽slot 2、对外提供数据 滑动的方向
 */
<template>
    <view @touchstart="handleTouchstart" @touchend="handleTouchend">   
        <slot></slot>
    </view>
</template>
<script>
export default {
    data() {
        return {
            //按下时间
            startTime:0,
            //按下坐标
            startX:0,
            startY:0
        }
    },
    methods: {
        handleTouchstart(event) {
            this.startTime = Date.now();
            //数组坐标0是指默认一个手指在滑动
            this.startX = event.changedTouches[0].clientX;
            this.startY = event.changedTouches[0].clientY;
        },
        handleTouchend(event) {
            const endTime = Date.now();
            const endX = event.changedTouches[0].clientX;
            const endY = event.changedTouches[0].clientY;

            //判断按下的时长
            if(endTime - this.startTime > 2000) {
                return;
            }

            //滑动方向
            let direction = "";
            //判断用户滑动的距离是否合法 若合法再判断滑动的方向 注意距离要加上绝对值
            //注意 虽然是判断水平方向的 但是有时用户垂直滑动的幅度会偏向左右 所以加上垂直方向判断
            if(Math.abs(endX - this.startX) > 10 && Math.abs(endY - this.startY) <10) {
                //判断滑动方向
                direction = endX - this.startX >0?"right":"left";
            }else {
                return;
            }
            //子组件想父组件传递数据
            this.$emit("swiperAction",{direction})
        }
    },
}
</script>
<style scoped></style>