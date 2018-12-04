var request = require('./utils/requests.js');

module.exports = {
    login: function (params) { // 登录接口
      return request.post('api/auth/login ', params)
    },
    getUserInfo: function (params) {
      return request.post('api/auth/me', params)
    }
};
