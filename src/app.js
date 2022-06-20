const app = new Vue({
  el: "#app",
  data() {
    return {
      blog: {
        blog_title: _config["blog_name"], //博客名称
        blog_url: `https://${_config["owner"]}.github.io/${_config["repo"]}`, //博客网址
        blog_pub_url: `https://github.com/${_config["owner"]}/${_config["repo"]}/issues`, //博客原始文章地址
        blog_new_post_url: `https://github.com/${_config["owner"]}/${_config["repo"]}/issues/new`, //博客发表地址
        blog_config_url: `https://github.com/${_config["owner"]}/${_config["repo"]}/blob/main/src/config.js`, //博客配置文件地址
        blog_help_url: `https://github.com/${_config["owner"]}/${_config["repo"]}/blob/main/README.md` //博客帮助文档
      },
      page: 1, //页数
      per_page: _config["per_page"], //每页数量
      filter: "created", //筛选
      state: _config["state"], //文章状态open closed all
      blog_author_type: _config["blog_author_type"], //发布博客的用户 默认 OWNER
      show_friend: _config["show_friend"], //是否展示好友
      friends_id: _config["friends_id"], //好友id
      friends_name: _config["friends_name"], //好友name
      author: {
        author_id: "", //用户ID
        author_nickname: _config["nickname"] || _config["owner"], //用户昵称
        author_name: _config["owner"], //作者
        author_avatar_url: `https://avatars.githubusercontent.com/${_config["owner"]}?size=64`, //作者头像
        author_url: `https://github.com/${_config["owner"]}`, //作者gihtub链接
        author_repo: `https://github.com/${_config["owner"]}/${_config["repo"]}`, //文章仓库
        author_post_url: `https://${_config["owner"]}.github.io/${_config["repo"]}/`, //文章地址
        author_post_api_url: `https://api.github.com/repos/${_config["owner"]}/${_config["repo"]}/issues` //文章api
      },
      post: {
        post_id: "", //文章id
        post_url: "", //文章链接
        post_title: "", //文章标题
        post_content: "", //文章内容
        isshowpic: false, //是否显示文章图片
        post_imgs: null, //文章图片
        post_createtime: "", //文章发布时间
        post_updatetime: "", //文章修改时间
        post_comment: null, //文章评论
        post_like: null //文章点赞
      },
      post_max_number: 0, //文章的数量
      postdata: [], //文章信息
      access_token: _config["access_token"], //文章请求token
      is_aside_menu_mode_show: false, //菜单设置详情按钮显示与隐藏
      isShowbacktop: false, //是否显示返回顶部按钮
      blogtheme: "light", //主题，默认浅色
      BS: null, //滚动条对象
      isOpenheadmenu: false //顶部菜单栏是否打开
    }
  },
  created() {
    // this.blog.blog_title = _config["blog_name"]
    // this.blog.blog_url = `https://${_config["owner"]}.github.io/${_config["repo"]}`
    // this.blog.blog_pub_url = `https://github.com/${_config["owner"]}/${_config["repo"]}/issues`
    document.title = this.blog.blog_title
    // this.access_token = _config["access_token"]
    // this.author.author_name = _config["owner"]
    // this.author.author_nickname = _config["nickname"] || _config["owner"]
    // this.per_page = _config["per_page"]
    // this.state = _config["state"]
    // this.blog_author_type = _config["blog_author_type"]
    // this.show_friend = _config["show_friend"]
    // this.friends_id = _config["friends_id"]
    // this.friends_name = _config["friends_name"]
    // this.author.author_url = `https://github.com/${_config["owner"]}`
    // this.author.author_avatar_url = `https://avatars.githubusercontent.com/${_config["owner"]}?size=64`
  },
  mounted() {
    const url = this.author.author_post_api_url
    const page = this.page
    const per_page = this.per_page
    const filter = this.filter
    const state = this.state
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
        // 处理成功情况
        const postlist = response.data
        let postlist_owner = [] //自己发布的文章
        if (Array.isArray(postlist) && postlist.length > 0) {
          if (this.show_friend) {
            postlist_owner = postlist.filter(
              (post) =>
                (post.author_association === this.blog_author_type ||
                  this.friends_id.includes(post.user.login)) &&
                post.state === this.state
            )
          } else {
            postlist_owner = postlist.filter(
              (post) =>
                post.author_association === this.blog_author_type &&
                post.state === this.state
            )
          }
        }

        if (Array.isArray(postlist_owner) && postlist_owner.length > 0) {
          // for (let i = 0; i < postlist_owner.length; i++) {
          //   if (postlist_owner[i].user.login === this.author.author_name) {
          //     this.author.author_id = postlist_owner[i].user.id
          //     this.author.author_nickname =
          //       _config["nickname"] || postlist_owner[i].user.login
          //     this.author.author_name = postlist_owner[i].user.login
          //     this.author.author_url = postlist_owner[i].user.html_url
          //     this.author.author_avatar_url = postlist_owner[i].user.avatar_url
          //     break
          //   }
          // }

          // this.author.author_id = postlist_owner[0].user.id
          // this.author.author_nickname =
          //   _config["nickname"] || postlist_owner[0].user.login
          // this.author.author_name = postlist_owner[0].user.login
          // this.author.author_url = postlist_owner[0].user.html_url
          // this.author.author_avatar_url = postlist_owner[0].user.avatar_url

          postlist_owner.forEach((post) => {
            let post_author_nickname = this.author.author_nickname //获取文章作者昵称
            if (this.friends_id.indexOf(post.user.login) > -1) {
              console.log(this.friends_id.indexOf(post.user.login))
              //如果作者是好友，就展示好友昵称
              post_author_nickname =
                this.friends_id.indexOf(post.user.login) > -1
                  ? this.friends_name[this.friends_id.indexOf(post.user.login)]
                  : post.user.login
            }
            this.postdata.push({
              avatar_url: post.user.avatar_url,
              post_author_nickname: post_author_nickname,
              html_url: post.user.html_url,
              login: post.user.login,
              created_at: post.created_at,
              title: post.title,
              post_url: post.html_url,
              body: marked.parse(post.body || ""), //解析markdown
              isshowpic: false
            })
          })
        }
        //隐藏动画
        document.getElementById("loading-mask").style.display = "none"
        // if (document.getElementById("Loading"))
        //   document.getElementById("Loading").remove()

        this.$nextTick(() => {
          this.getscroll() //滚动条
        })
      })
      .catch((error) => {
        // 处理错误情况
        console.log(error)
      })
  },
  // updated() {
  //   console.log(123)
  //   if (this.BS) {
  //     this.getAllImgLoad()
  //   }
  // },
  watch: {
    postdata() {
      if (this.BS) {
        this.getAllImgLoad()
      }
    }
  },
  methods: {
    getpostlist(url, page, per_page, filter, state) {
      //上拉加载事件
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
          // 处理成功情况
          const postlist = response.data
          let postlist_owner = [] //自己发布的文章
          if (Array.isArray(postlist) && postlist.length > 0) {
            // postlist_owner = postlist.filter(
            //   (post) =>
            //     post.author_association === this.blog_author_type &&
            //     post.state === this.state
            // )
            if (this.show_friend) {
              postlist_owner = postlist.filter(
                (post) =>
                  (post.author_association === this.blog_author_type ||
                    this.friends_id.includes(post.user.login)) &&
                  post.state === this.state
              )
            } else {
              postlist_owner = postlist.filter(
                (post) =>
                  post.author_association === this.blog_author_type &&
                  post.state === this.state
              )
            }
          }
          if (Array.isArray(postlist_owner) && postlist_owner.length > 0) {
            postlist_owner.forEach((post) => {
              // this.postdata.push({
              //   avatar_url: post.user.avatar_url,
              //   html_url: post.user.html_url,
              //   login: post.user.login,
              //   created_at: post.created_at,
              //   title: post.title,
              //   body: marked.parse(post.body || ""), //解析markdown
              //   isshowpic: false
              // })
              let post_author_nickname = this.author.author_nickname //获取文章作者昵称
              if (this.friends_id.indexOf(post.user.login) > -1) {
                console.log(this.friends_id.indexOf(post.user.login))
                //如果作者是好友，就展示好友昵称
                post_author_nickname =
                  this.friends_id.indexOf(post.user.login) > -1
                    ? this.friends_name[
                        this.friends_id.indexOf(post.user.login)
                      ]
                    : post.user.login
              }

              this.postdata.push({
                avatar_url: post.user.avatar_url,
                post_author_nickname: post_author_nickname,
                html_url: post.user.html_url,
                login: post.user.login,
                created_at: post.created_at,
                title: post.title,
                post_url: post.html_url,
                body: marked.parse(post.body || ""), //解析markdown
                isshowpic: false
              })
            })

            if (this.BS) {
              this.BS.finishPullUp()
            }

            this.page = parseInt(this.page) + 1
          }

          // console.log(document.getElementById("container").style.height)
        })
        .catch((error) => {
          // 处理错误情况
          console.log(error)
        })
    },
    getpostlistdetail(post_url) {
      let result = null
      axios
        .get(post_url)
        .then((response) => {
          // 处理成功情况
          return response.data
        })
        .catch((error) => {
          // 处理错误情况
          console.log(error)
        })
    },
    daterealformat(date) {
      dayjs.locale("zh-cn") //日期本地化
      return dayjs(date).format("YYYY-MM-DD HH:mm:ss")
    },
    dateformat(date) {
      dayjs.locale("zh-cn") //日期本地化
      const nowdate = dayjs()
      const diff_day = nowdate.diff(date, "day")
      const diff_hour = nowdate.diff(date, "hour")
      const diff_minute = nowdate.diff(date, "minute")
      const diff_seconds = nowdate.diff(date, "second")
      if (diff_seconds < 60) {
        return "刚刚"
      } else if (diff_minute < 60) {
        return diff_minute + "分钟前"
      } else if (diff_hour < 24) {
        return diff_hour + "小时前"
      } else if (diff_day < 2) {
        return "昨天  " + dayjs(date).format("HH:mm:ss")
      } else {
        return dayjs(date).format("YYYY-MM-DD HH:mm:ss")
      }
    },
    getposttext() {
      console.log()
    },
    getscroll() {
      //初始化滚动条better-scroll
      // let bs = new BScroll("#container", {
      //   probeType: 3,
      //   pullUpLoad: true
      // })

      this.BS = BetterScroll.createBScroll("#container", {
        probeType: 3,
        pullUpLoad: true,
        click: true
        // scrollY: true,
        // scrollbar: true
      })

      this.getAllImgLoad()

      this.BS.on("scroll", (position) => {
        //滚动事件
        this.scrollPosition(position)
      })
      this.BS.on("pullingUp", () => {
        //上拉加载更多
        const url = this.author.author_post_api_url
        const page = parseInt(this.page) + 1
        const per_page = this.per_page
        const filter = this.filter
        const state = this.state
        this.getpostlist(url, page, per_page, filter, state)
      })
    },
    //滚动内容实时监听位置
    scrollPosition(position) {
      const position_y = Math.abs(position.y)
      this.isShowbacktop = position_y > 360
    },
    asideSetClick() {
      //设置
      this.is_aside_menu_mode_show = !this.is_aside_menu_mode_show
    },
    toTopClick() {
      //滚动条回到顶部
      if (this.BS) {
        this.BS.scrollTo(0, 0, 750)
      }
    },
    switchColorModeClick() {
      //切换深色和浅色模式
      // console.log(this.blogtheme)
      // console.log(!!window.matchMedia("(prefers-color-scheme: light)").matches)
      // if (!!window.matchMedia("(prefers-color-scheme: light)").matches) {
      //   //判断处于浅色模式
      //   window.matchMedia("(prefers-color-scheme: dark)")
      // } else {
      //   window.matchMedia("(prefers-color-scheme: light)")
      // }
      const theme = document.querySelector("#theme-css-link")
      if (theme.getAttribute("href") == "asset/css/light.css") {
        theme.href = "asset/css/dark.css"
        window.localStorage.setItem("theme_mode", "dark") //记录主题模式
      } else {
        theme.href = "asset/css/light.css"
        window.localStorage.setItem("theme_mode", "light") //记录主题模式
      }
      this.isOpenheadmenu = !this.isOpenheadmenu //关闭菜单栏
    },
    getAllImgLoad() {
      // //获取所有图片加载成功，滚动条refresh
      // const arrImgs = getAllImgs() //获取所有动态加载的图片
      // Promise.all(loadImgs(arrImgs)).then(() => {
      //   //判断图片加载完成
      //   this.BS.refresh()
      // })
      getAllImgLoadComplete(() => {
        //判断图片加载完成
        // console.log("所有图片加载完成!")
        this.BS && this.BS.refresh()
      })
    },
    headmenuClick() {
      //顶部菜单栏是否展开或者折叠
      this.isOpenheadmenu = !this.isOpenheadmenu
      // if (this.isOpenheadmenu) {
      //   //菜单栏展开
      //   document.getElementById("app").style.zIndex = 103
      // } else {
      //   document.getElementById("app").style.zIndex = 100
      // }
    },
    headmenuNewPostClick() {
      //顶部菜单栏发表动态
      this.isOpenheadmenu = !this.isOpenheadmenu //隐藏菜单栏
      document.getElementById("loading-mask").style.display = "block" //显示遮罩层
      location.href = this.blog.blog_new_post_url //跳转链接
    },
    headmenuEditPostClick() {
      //编辑动态
      this.isOpenheadmenu = !this.isOpenheadmenu //隐藏菜单栏
      document.getElementById("loading-mask").style.display = "block" //显示遮罩层
      location.href = this.blog.blog_pub_url //跳转链接
    },
    headmenuEditConfigClick() {
      //修改配置
      this.isOpenheadmenu = !this.isOpenheadmenu //隐藏菜单栏
      document.getElementById("loading-mask").style.display = "block" //显示遮罩层
      location.href = this.blog.blog_config_url //跳转链接
    },
    headmenuViewHelpClick() {
      //帮助文档
      this.isOpenheadmenu = !this.isOpenheadmenu //隐藏菜单栏
      document.getElementById("loading-mask").style.display = "block" //显示遮罩层
      location.href = this.blog.blog_help_url //跳转链接
    },
    headmenuAboutMeClick() {
      //关于
      this.isOpenheadmenu = !this.isOpenheadmenu //隐藏菜单栏
      document.getElementById("loading-mask").style.display = "block" //显示遮罩层
      location.href = this.author.author_url //跳转链接
    },
    headmenuGoHomeClick() {
      //回到首页
      this.isOpenheadmenu = !this.isOpenheadmenu //隐藏菜单栏
      document.getElementById("loading-mask").style.display = "block" //显示遮罩层
      location.href = this.blog.blog_url //跳转链接
      document.getElementById("loading-mask").style.display = "none" //隐藏遮罩层
    }
  }
})

//axios配置
axios.defaults.headers.common[
  "Authorization"
] = `token ${_config["access_token"]}`
axios.defaults.timeout = 30000

//markdjs markdown转html设置
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: true,
  xhtml: true
})

//重新计算container高度
const clientHeight =
  document.body.clientHeight || document.documentElement.clientHeight
document.getElementById("container").style.height = clientHeight - 40 + "px"
// console.log(document.getElementById("container").style.height)

// //判断图片是否加载完成
// function loadImgs(arr) {
//   const newimages = []
//   for (var i = 0; i < arr.length; i++) {
//     newimages[i] = new Promise(function (resolve, reject) {
//       var image = new Image()
//       image.addEventListener("load", function listener() {
//         resolve(image)
//         this.removeEventListener("load", listener)
//       })
//       image.src = arr[i].src
//       image.addEventListener("error", reject)
//     })
//     // console.log(arr[i].src)
//   }
//   return newimages
// }

// //获取容器加载出来的所有图片
// function getAllImgs() {
//   const imgs = document.querySelectorAll(".ul_postlist img")
//   // console.log(Array.prototype.slice.call(imgs))
//   return Array.prototype.slice.call(imgs, 0)
// }

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

//深色模式和浅色模式监听
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
} else if (typeof mode_media.addEventListener === "function") {
  mode_media.addEventListener(mode_callback)
}
