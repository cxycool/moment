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
const music_platform = GetQueryString("platform") //歌曲来源
//音乐实例
if (music_platform === "Q" || music_platform === "q") {
  //QQ
  if (music_id) {
    document.getElementById(
      "music_container"
    ).innerHTML = `<meting-js server="tencent" type="song" preload="none" id="${music_id}"></meting-js>`
  }
} else if (music_platform === "N" || music_platform === "n") {
  //网易云音乐
  if (music_id) {
    document.getElementById(
      "music_container"
    ).innerHTML = `<meting-js server="netease" type="song" preload="none" id="${music_id}"></meting-js>`
  }
} else if (music_platform === "K" || music_platform === "k") {
  //酷狗音乐
  if (music_id) {
    document.getElementById(
      "music_container"
    ).innerHTML = `<meting-js server="kugou" type="song" preload="none" id="${music_id}"></meting-js>`
  }
} else if (music_platform === "W" || music_platform === "w") {
  //酷我音乐
  if (music_id) {
    const name = GetQueryString("name") //歌名
    const music_artist = GetQueryString("artist") //歌手
    document.getElementById("music_container").innerHTML = `<meting-js
    preload="none"
    name="${name}"
    artist="${music_artist}"
    url="https://antiserver.kuwo.cn/anti.s?rid=MUSIC_${music_id}&response=res&format=mp3|aac&type=convert_url&br=320kmp3&callback=getlink&jpcallback=getlink.mp3"
    cover="./src/music.svg">
  </meting-js>`
  }
} else {
  document.getElementById("music_container").innerHTML = "暂无歌曲"
}
