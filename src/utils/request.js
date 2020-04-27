//封装自己的异步请求(基于ES6)
export default (params) => {

    //加载中
    uni.showLoading({
        title:'加载中...'
    })
    //成功时执行resolve 失败时执行reject
    return new Promise ((resolve, reject)=>{

        //写微信中的请求
        wx.request({
            //相当于将以前的url:'',data:''提取出来变成形参params
            ...params,
            success(res) {
                resolve(res.data)
            },
            fail(err) {
                reject(err)
            },
            complete(){
                //成功或失败就隐藏掉loading加载
                uni.hideLoading();
            }
        })
    })
}
