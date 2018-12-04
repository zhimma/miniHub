var request = require('./utils/request.js');

module.exports = {
    login: function (params) { // 登录接口
      return request.post('api/auth/login ', params)
    },
    register: function (params) {
      return request.post('api/auth/register', params)
    }
};
