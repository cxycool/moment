//获取链接参数
function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
  console.log(window.location)
  console.log(window.location.search)
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

//获取歌曲信息
const music_id = GetQueryString("id").trim() //歌曲id
const music_name = GetQueryString("name") || " " //歌曲name
const music_artist = GetQueryString("artist") || " " //歌手
//音乐实例
if (music_id) {
  let player = new cplayer({
    element: document.getElementById("music_player"),
    width: "100%",
    showPlaylistButton: false,
    dropDownMenuMode: "none",
    playlist: [
      {
        src: `http://music.163.com/song/media/outer/url?id=${music_id}.mp3`,
        // poster: "封面链接...",
        name: music_name.trim(),
        artist: music_artist.trim()
        // lyric: "歌词...",
        // sublyric: "副歌词，一般为翻译...",
        // album: "专辑，唱片..."
      }
    ]
  })
}

//   cplayer.prototype.add163 = function add163(id) {
//     if (!id) throw new Error("Unable Property.")
//     return fetch(
//       "https://music.163.com/api/song/detail/?id=" +
//         id +
//         "&ids=%5B" +
//         id +
//         "%5D",
//       {
//         mode: "no-cors"
//       }
//     )
//       .then(function (res) {
//         return res.json()
//       })
//       .then(
//         function (data) {
//           let obj = {
//             name: data.info.songs[0].name,
//             artist: data.info.songs[0].ar
//               .map(function (ar) {
//                 return ar.name
//               })
//               .join(","),
//             poster: data.pic.url,
//             lyric: data.lyric.lyric,
//             sublyric: data.lyric.tlyric,
//             src: data.url.url,
//             album: data.info.songs[0].al.name
//           }
//           this.add(obj)
//           return obj
//         }.bind(this)
//       )
//   }
//   if (id) {
//     player.add163(id)
//   }
