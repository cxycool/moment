/**
 * 判断跳转链接是否有效,用于处理无法访问的问题
 */
function get_url_valid(url, callback) {
  axios
    .head(url)
    .then((response) => callback(response))
    .catch((error) => {
      // 处理错误情况
      console.log(error)
    })
}
