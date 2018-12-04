const {BASE_URL} = getApp();
// 兼容企业微信小程序和微信小程序接口
const _login = wx.login;
const _checkSession = wx.checkSession;
const _loginUrl = 'api/auth/login';

const checkLogin = {

    wechatRequest: function (request) {
        let _this = this

        let header = {
            Token: wx.getStorageSync('token') ? wx.getStorageSync('token') : '',
        }

        if (typeof request.header === 'object') {
            Object.assign(header, request.header)
        }

        console.log('wechatRequest', header, request)

        var prom = new Promise(function (resolve, reject) {

            if (request.wxApiName === 'uploadFile') {
                wx.uploadFile({
                    url: BASE_URL + '/' + request.url,
                    filePath: request.data.filePath,
                    name: request.data.name || 'file',
                    header: header,
                    formData: request.data,
                    success: function (response) {
                        console.log('wechatRequest', 'response', response)

                        if (response.statusCode == 200) {
                            resolve(response.data)
                        } else {
                            if (response.data.code == 10000 || response.data.code == 200001 || response.data.code == 200002) {
                                wx.removeStorageSync('token')
                            }

                            wx.hideLoading()
                            wx.showModal({
                                title: '服务器异常',
                                showCancel: false,
                                content: '异常状态码：[' + response.statusCode + ']'
                            })

                            reject(response)
                        }
                    },
                    fail: function () {
                        console.log('wechatRequest', 'fail', arguments)
                        reject()
                    },
                })
            } else {
                wx.request({
                    url: BASE_URL + '/' + request.url,
                    method: request.method ? request.method : 'GET',
                    data: request.data,
                    header: header,
                    dataType: 'json',
                    responseType: 'text',
                    success: function (response) {
                        console.log('wechatRequest', 'response', response)

                        if (response.statusCode == 200) {
                            resolve(response.data)
                        } else {
                            if (response.data.code == 10000 || response.data.code == 200001 || response.data.code == 200002) {
                                wx.removeStorageSync('token')
                            }
                            wx.showModal({
                                title: '服务器异常',
                                showCancel: false,
                                content: '异常状态码：[' + response.statusCode + ']'
                            })
                            reject(response)
                        }
                    },
                    fail: function () {
                        console.log('wechatRequest', 'fail', arguments)
                        reject()
                    },
                })
            }
        })

        return prom
    },

    /**
     * 微信登录
     */
    wechatLogin: function (request) {
        let that = this

        var prom = new Promise(function (resolve, reject) {

            // 微信登陆获取token
            _login({
                success: function (result) {
                    console.log('wechatLogin', 'code', result.code)

                    // code换取token
                    that.wechatRequest({
                        method: 'post',
                        url: _loginUrl,
                        data: {code: result.code}
                    }).then(res => {
                        console.log('wechatLogin', 'token', res)
                        if (res.status === 'success') {
                            // 获得token后发送真正的请求
                          wx.setStorageSync('token', res.data.token)
                            // 如果是登陆接口直接返回
                            if (request.url == _loginUrl) {
                                resolve(res)
                            } else {
                                that.wechatRequest(request).then(res => {
                                    resolve(res)
                                }).catch((err) => {
                                    reject(err)
                                })
                            }
                        } else {
                            wx.removeStorageSync('token')
                            reject(res)
                        }
                    }).catch((err) => {
                        reject(err)
                    })
                }
            })
        })

        return prom
    },

    /**
     * 重新封装 wx.request，将维护登录状态封装进入此方法
     */
    request: function (request) {
        let that = this

        var prom = new Promise(function (resolve, reject) {
            // 判断是否为登陆接口
            if (request.url == _loginUrl) {
                that.wechatLogin(request).then(res => {
                    resolve(res)
                }).catch((err) => {
                    reject(err)
                })
            } else {
                // 检测session是否过期
                _checkSession({
                    success: function () {

                        // 判断是否存在在token
                        if (wx.getStorageSync('token')) {
                            // 存在token并且session没过期发送请求
                            that.wechatRequest(request).then(res => {
                                resolve(res)
                            }).catch((err) => {
                                reject(err)
                            })
                        } else {
                            // 没有token先去登陆
                            that.wechatLogin(request).then(res => {
                                resolve(res)
                            }).catch((err) => {
                                reject(err)
                            })
                        }
                    },
                    fail: function () {
                        console.log('request', '1 sessionKey过期，执行登录')

                        that.wechatLogin(request).then(res => {
                            console.log('request', '2 sessionKey过期，登录成功')
                            resolve(res)
                        }).catch((err) => {
                            reject(err)
                        })
                    }
                })
            }
        })

        return prom;
    }
}

module.exports = {
    /**
     * @description ApiUtil 请求方法
     * @function request
     * @memberof ng.poler.ApiUtil
     * @param url {String} http 请求接口地址
     * @param method {string} http 接口请求方法 (如 'GET', 'POST', 等)
     * @param params {Object.<string|Object>} http 请求查询参数
     * @param data {string|Object} http 请求发送数据
     * @param config {object.<string|Object|function>} http 请求配置参数<br>
     *  <b>headers {Object.<string|functions>} <br> </b>
     *  &nbsp;&nbsp;&nbsp;
     *      字符串或者函数返回的字符串放入http请求头部发送到服务器。如果函数返回null，这个头部信息不会发送。<br>
     *  <b>xsrfHeaderName {string} <br></b>
     *  &nbsp;&nbsp;&nbsp;
     *      http 头部信息中 XSRF token 头部的名字<br>
     *  <b>xsrfCookieName {string} <br></b>
     *  &nbsp;&nbsp;&nbsp;
     *      cookie中包含 XSRF token 信息的名字<br>
     *  <b>transformRequest {function(data, headersGetter)|Array.<function(data, headersGetter)>}<br></b>
     *  &nbsp;&nbsp;&nbsp;
     *      请求头部和请求body 转换处理函数。会覆盖默认的转换处理函数。<br>
     *  <b>transformResponse {function(data, headersGetter, status)|Array.<function(data, headersGetter, status)>} <br></b>
     *  &nbsp;&nbsp;&nbsp;
     *      响应 body，headers，status转换出事函数。会覆盖默认的转换处理函数<br>
     *  <b>cache {boolean|Cache} <br> </b>
     *  &nbsp;&nbsp;&nbsp;
     *      是否缓存。当 cache=true，使用 $http 的缓存；当 cache 为 $cacheFactory 的实例时，用cache进行缓存<br>
     *  <b>timeout {number|Promise} <br> </b>
     *  &nbsp;&nbsp;&nbsp;
     *      请求超时设置。可以是毫秒数，也可以是一个promise，当为promise时，应该在promise得到解决的时候停止请求。<br>
     *  <b>withCredentials {boolean} <br> </b>
     *  &nbsp;&nbsp;&nbsp;
     *      设置这个 withCredentials 标记到 XHR 对象中，withCredentials 标记时候使用跨越cookie。更对关于withCredentials请查看相关文档。<br>
     *  <b>responseType {string} <br> </b>
     *  &nbsp;&nbsp;&nbsp;
     *      返回数据类型。更多信息请查看 requestType。
     * @returns {Promise} 返回一个承诺，使用angularjs 的 $q 服务产生
     *
     * @example post 请求
     *      ApiUtil.request('http://127.0.0.1:3000/test','POST', {
     *              aa:'aa'
     *          },
     *          "test data",
     *          {
     *              headers:{
     *                  aaa: "aaa",
     *                  bbb: function() { return "bbb"; },
     *                  ccc: function{} { return "ccc"; }
     *              },
     *              withCredentials: true
     *          }
     *      )
     *
     * @example get 请求
     *      ApiUtil.request('http://127.0.0.1:3000/test','GET', {
     *              aa:'aa'
     *          },
     *          "test data",
     *          {
     *              headers:{
     *                  aaa: "aaa",
     *                  bbb: function() { return "bbb"; },
     *                  ccc: function{} { return "ccc"; }
     *              },
     *              withCredentials: true
     *          }
     *      )
     */
    request: function (url, method, params, config) {
        var prom = new Promise((result, reject) => {
            checkLogin.request({
                url: url,
                method: method,
                data: params,
                config: config
            }).then(res => {
                result(res);
            }).catch(() => {
                reject();
            });
        })
        return prom;
    },
    uploadFile: function (url, params, config) {
        var prom = new Promise((result, reject) => {
            checkLogin.request({
                url: url,
                data: params,
                wxApiName: 'uploadFile',
                config: config
            }).then(res => {
                result(res);
            }).catch(() => {
                reject();
            });
        })
        return prom;
    },
    /**
     * @description 封装 [request]{@link ng.poler.ApiUtil.request} 的 POST 请求方法
     * @function post
     * @memberof ng.poler.ApiUtil
     * @param {string} url    [参考request.url]{@link ng.poler.ApiUtil.request}
     * @param {Object} params [参考request.params]{@link ng.poler.ApiUtil.request}
     * @param {Object} config [参考request.config]{@link ng.poler.ApiUtil.request}
     * @returns {promise}     [参考 request 返回值]{@link ng.poler.ApiUtil.request}
     */
    post: function (url, params, config) {
        return this.request(url, 'POST', params, config);
    },
    /**
     * @description 封装 [request]{@link ng.poler.ApiUtil.request} 的 GET 请求方法
     * @function get
     * @memberof ng.poler.ApiUtil
     * @param {string} url    [参考request.url]{@link ng.poler.ApiUtil.request}
     * @param {Object} params [参考request.params]{@link ng.poler.ApiUtil.request}
     * @param {Object} config [参考request.config]{@link ng.poler.ApiUtil.request}
     * @returns {promise}     [参考 request 返回值]{@link ng.poler.ApiUtil.request}
     */
    get: function (url, params, config) {
        return this.request(url, 'GET', params, config);
    },
    /**
     * @description 封装 [request]{@link ng.poler.ApiUtil.request} 的 DELETE 请求方法
     * @function del
     * @memberof ng.poler.ApiUtil
     * @param {string} url    [参考request.url]{@link ng.poler.ApiUtil.request}
     * @param {Object} params [参考request.params]{@link ng.poler.ApiUtil.request}
     * @param {Object} config [参考request.config]{@link ng.poler.ApiUtil.request}
     * @returns {promise}     [参考 request 返回值]{@link ng.poler.ApiUtil.request}
     */
    delete: function (url, params, config) {
        return this.request(url, 'DELETE', params, config);
    },
    /**
     * @description 封装 [request]{@link ng.poler.ApiUtil.request} 的 PATCH 请求方法
     * @function patch
     * @memberof ng.poler.ApiUtil
     * @param {string} url    [参考request.url]{@link ng.poler.ApiUtil.request}
     * @param {Object} params [参考request.params]{@link ng.poler.ApiUtil.request}
     * @param {Object} config [参考request.config]{@link ng.poler.ApiUtil.request}
     * @returns {promise}     [参考 request 返回值]{@link ng.poler.ApiUtil.request}
     */
    patch: function (url, params, config) {
        return this.request(url, 'PATCH', params, config);
    },
    /**
     * @description 封装 [request]{@link ng.poler.ApiUtil.request} 的 PUT 请求方法
     * @function put
     * @memberof ng.poler.ApiUtil
     * @param {string} url    [参考request.url]{@link ng.poler.ApiUtil.request}
     * @param {Object} params [参考request.params]{@link ng.poler.ApiUtil.request}
     * @param {Object} config [参考request.config]{@link ng.poler.ApiUtil.request}
     * @returns {promise}     [参考 request 返回值]{@link ng.poler.ApiUtil.request}
     */
    put: function (url, params, config) {
        return this.request(url, 'PUT', params, config);
    }
}
