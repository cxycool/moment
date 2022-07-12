//获取链接参数
function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
  var q = decodeURI(window.location.search).replace(/\s*/g, "")
  var r = q.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

//获取歌曲信息
const music_id = GetQueryString("id") //歌曲id

//音乐实例
if (music_id) {
  document.getElementById(
    "music_container"
  ).innerHTML = `<meting-js server="netease" type="song" id="${music_id}"></meting-js>`
}
