//axios配置
function get_axios_init() {
  axios.defaults.headers.common[
    "Authorization"
  ] = `token ${_config["access_token"]}`
  axios.defaults.timeout = 30000
}

/**
 * 网络请求
 * url：请求地址
 * page: 数据页码
 * per_page: 每页数量
 * filter: 过滤
 * state: 状态
 * callback:回调函数
 */
function get_post_data({ url, page, per_page, filter, state }, callback) {
  axios
    .get(url, {
      params: {
        page,
        per_page,
        filter,
        state
      }
    })
    .then((response) => {
      callback(response)
    })
    .catch((error) => {
      // 处理错误情况
      console.log(error)
    })
}
