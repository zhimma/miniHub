//index.js
//获取应用实例
const app = getApp()


Page({
  data: {
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
    
  }
})