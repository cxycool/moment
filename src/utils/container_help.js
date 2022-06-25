/**
 * 滚动容器wrapper配置
 */
function get_container_height_init() {
  //重新计算container高度
  const clientHeight =
    document.body.clientHeight || document.documentElement.clientHeight
  document.getElementById("container").style.height = clientHeight - 40 + "px"
}
