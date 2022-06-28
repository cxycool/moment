/**
 * 网页主题配置
 */
//深色模式和浅色模式监听
function get_theme_init() {
  const theme = document.querySelector("#theme-css-link")
  let mode_media = window.matchMedia("(prefers-color-scheme: dark)") //深色模式
  const theme_mode = window.localStorage.getItem("theme_mode") //主题模式
  if (theme_mode === "dark") {
    theme.href = "asset/css/dark.css"
  } else {
    theme.href = "asset/css/light.css"
  }
  let mode_callback = (e) => {
    let prefersDarkMode = e.matches
    if (prefersDarkMode) {
      theme.href = "asset/css/dark.css"
      window.localStorage.setItem("theme_mode", "dark") //记录主题模式
    } else {
      theme.href = "asset/css/light.css"
      window.localStorage.setItem("theme_mode", "light") //记录主题模式
    }
  }
  if (typeof mode_media.addEventListener === "function") {
    mode_media.addEventListener("change", mode_callback)
  } else if (typeof mode_media.addListener === "function") {
    mode_media.addListener(mode_callback)
  }
}

//深色模式和浅色模式切换
function get_theme_change() {
  const theme = document.querySelector("#theme-css-link")
  if (theme.getAttribute("href") == "asset/css/light.css") {
    theme.href = "asset/css/dark.css"
    window.localStorage.setItem("theme_mode", "dark") //记录主题模式
  } else {
    theme.href = "asset/css/light.css"
    window.localStorage.setItem("theme_mode", "light") //记录主题模式
  }
}
