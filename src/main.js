import Vue from 'vue'
import App from './App'
//导入封装好的异步请求
import request from './utils/request'

Vue.config.productionTip = false
//挂载封装好的异步请求 后期直接this.调用
Vue.prototype.request = request;

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
