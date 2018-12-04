// pages/common/authorization.js
var apiList = require('../../app-api.js');
let App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onGetuserinfo: function(e) {
    if (e.detail.errMsg =='getUserInfo:ok') {
      wx.login({
        success(res){
          let params = {
            'code' : res.code,
            'encryptedData' :e.detail.encryptedData,
            'iv':e.detail.iv,
            'signature': e.detail.signature
          };
          apiList.register(params).then(res => {
            wx.setStorageSync('token', res.header.Token);
            App.setData.globalData.userInfo = res.data.data;
          });
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})