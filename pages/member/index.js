// pages/member/index.js
var App = getApp();
var apiList = require('../../app-api.js');
Page({
  data: {
    isLogin: false,
    userInfo: {},
    imgUrls: [
      'https://zhimma.oss-cn-beijing.aliyuncs.com/md/1.jpg',
      'https://zhimma.oss-cn-beijing.aliyuncs.com/md/2.jpg',
      'https://zhimma.oss-cn-beijing.aliyuncs.com/md/3.jpg',
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 500,
    activities: [{
        'link_id': 1,
        'type': 1,
        'link_url': 'www.jd.com',
        'image_src': 'https://zhimma.oss-cn-beijing.aliyuncs.com/md/1.jpg',
        'title': "京东"
      },
      {
        'link_id': 1,
        'type': 1,
        'link_url': 'www.jd.com',
        'image_src': 'https://zhimma.oss-cn-beijing.aliyuncs.com/md/1.jpg',
        'title': "京东"
      },
      {
        'link_id': 1,
        'type': 1,
        'link_url': 'www.jd.com',
        'image_src': 'https://zhimma.oss-cn-beijing.aliyuncs.com/md/1.jpg',
        'title': "京东"
      },
      {
        'link_id': 1,
        'type': 1,
        'link_url': 'www.jd.com',
        'image_src': 'https://zhimma.oss-cn-beijing.aliyuncs.com/md/1.jpg',
        'title': "京东"
      }


    ],
  },
  onLoad: function() {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.login({
      success(res) {
        apiList.login({
          'code': res.code
        }).then(res => {
          wx.hideLoading();
          if (res.data.status == 'error') {
            wx.redirectTo({
              url: '/pages/common/authorization',
            })
          } else {
             App.globalData = res.data.data
             that.setData({
               'userInfo': res.data.data
             });
          }
        });
      },
      fail: function(fails) {
        console.log(fails);
      }
    })
  }
})