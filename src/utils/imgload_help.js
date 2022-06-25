/**
 * 图片加载完成
 */

//判断所有图片加载完成
function getAllImgLoadComplete(callback) {
  const images = document.getElementById("ul_postlist").querySelectorAll("img")
  const promises = Array.prototype.slice.call(images).map((img) => {
    return new Promise((resolve, reject) => {
      let loadImg = new Image()
      loadImg.src = img.src
      loadImg.onload = () => {
        resolve(img)
      }
    })
  })

  Promise.all(promises)
    .then((results) => {
      callback()
    })
    .catch((err) => {
      console.log(err)
    })
}
