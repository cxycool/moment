const app = new Vue({
  el: "#app",
  data() {
    return {
      blog: {
        blog_title: "",
        blog_url: "",
        blog_pub_url: ""
      },
      page: 1, //页数
      per_page: 0, //每页数量
      filter: "created", //筛选
      state: "open", //文章状态open closed all
      blog_author_type: "", //发布博客的用户 默认 OWNER
      author: {
        author_id: "", //用户ID
        author_nickname: "", //用户昵称
        author_name: "", //作者
        author_avatar_url: "", //作者头像
        author_url: "", //作者gihtub链接
        author_repo: "" //作者gihtub仓库
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
      access_token: "", //文章请求token
      is_aside_menu_mode_show: false, //菜单设置详情按钮显示与隐藏
      isShowbacktop: false, //是否显示返回顶部按钮
      blogtheme: "light", //主题，默认浅色
      BS: null //滚动条对象
    }
  },
  mounted() {
    this.blog.blog_title = _config["blog_name"]
    this.blog.blog_url = `https://${_config["owner"]}.github.io/${_config["repo"]}`
    this.blog.blog_pub_url = `https://github.com/${_config["owner"]}/${_config["repo"]}/issues`
    document.title = this.blog.blog_title
    this.access_token = _config["access_token"]
    this.per_page = _config["per_page"]
    this.state = _config["state"]
    this.blog_author_type = _config["blog_author_type"]

    let url = `https://api.github.com/repos/${_config["owner"]}/${_config["repo"]}/issues`
    url = url.trim()
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
          postlist_owner = postlist.filter(
            (post) =>
              post.author_association === this.blog_author_type &&
              post.state === this.state
          )
        }
        if (Array.isArray(postlist_owner) && postlist_owner.length > 0) {
          this.author.author_id = postlist_owner[0].user.id
          this.author.author_nickname =
            _config["nickname"] || postlist_owner[0].user.login
          this.author.author_name = postlist_owner[0].user.login
          this.author.author_url = postlist_owner[0].user.html_url
          this.author.author_avatar_url = postlist_owner[0].user.avatar_url

          postlist_owner.forEach((post) => {
            this.postdata.push({
              avatar_url: post.user.avatar_url,
              html_url: post.user.html_url,
              login: post.user.login,
              created_at: post.created_at,
              title: post.title,
              body: marked.parse(post.body || ""), //解析markdown
              isshowpic: false
            })
          })
        }
        //删除动画
        if (document.getElementById("Loading"))
          document.getElementById("Loading").remove()

        this.$nextTick(() => {
          this.getscroll() //滚动条
        })
      })
      .catch((error) => {
        // 处理错误情况
        console.log(error)
      })
  },
  updated() {
    if (this.BS) {
      this.getAllImgLoad()
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
            postlist_owner = postlist.filter(
              (post) =>
                post.author_association === this.blog_author_type &&
                post.state === this.state
            )
          }
          if (Array.isArray(postlist_owner) && postlist_owner.length > 0) {
            postlist_owner.forEach((post) => {
              this.postdata.push({
                avatar_url: post.user.avatar_url,
                html_url: post.user.html_url,
                login: post.user.login,
                created_at: post.created_at,
                title: post.title,
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
      const diff_hour = nowdate.diff(date, "hour")
      const diff_minute = nowdate.diff(date, "minute")
      const diff_seconds = nowdate.diff(date, "second")
      if (diff_seconds < 60) {
        return "刚刚"
      } else if (diff_minute < 60) {
        return diff_minute + "分钟前"
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
        pullUpLoad: true
        // scrollY: true,
        // scrollbar: true
      })

      // this.getAllImgLoad()

      this.BS.on("scroll", (position) => {
        //滚动事件
        this.scrollPosition(position)
      })
      this.BS.on("pullingUp", () => {
        //上拉加载更多
        let url = `https://api.github.com/repos/${_config["owner"]}/${_config["repo"]}/issues`
        url = url.trim()
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
      this.isShowbacktop = position_y > 1200
    },
    asideSetClick() {
      //设置
      this.is_aside_menu_mode_show = !this.is_aside_menu_mode_show
    },
    toTopClick() {
      //滚动条回到顶部
      if (this.BS) {
        this.BS.scrollTo(0, 0, 1000)
      }
    },
    switchColorModeClick() {
      //切换深色和浅色模式
      // console.log(this.blogtheme)
    },
    getAllImgLoad() {
      //获取所有图片加载成功，滚动条refresh
      const arrImgs = getAllImgs() //获取所有动态加载的图片
      Promise.all(loadImgs(arrImgs)).then(() => {
        //判断图片加载完成
        this.BS.refresh()
      })
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
  xhtml: true,
  highlight: function (code) {
    return highlight.highlightAuto(code).value
  }
})

//重新计算container高度
const clientHeight =
  document.body.clientHeight || document.documentElement.clientHeight
document.getElementById("container").style.height = clientHeight - 50 + "px"
// console.log(document.getElementById("container").style.height)

//判断图片是否加载完成
function loadImgs(arr) {
  const newimages = []
  for (var i = 0; i < arr.length; i++) {
    newimages[i] = new Promise(function (resolve, reject) {
      var image = new Image()
      image.addEventListener("load", function listener() {
        resolve(image)
        this.removeEventListener("load", listener)
      })
      image.src = arr[i].src
      image.addEventListener("error", reject)
    })
    // console.log(arr[i].src)
  }
  return newimages
}

//获取容器加载出来的所有图片
function getAllImgs() {
  const imgs = document.querySelectorAll(".ul_postlist img")
  // console.log(Array.prototype.slice.call(imgs))
  return Array.prototype.slice.call(imgs, 0)
}
