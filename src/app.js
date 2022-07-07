/**
 * 主要功能
 */
const app = new Vue({
  el: "#app",
  data() {
    return {
      blog: {
        blog_title: _config["blog_name"], //博客名称
        blog_url: `https://${_config["owner"]}.github.io/${_config["repo"]}`, //博客网址
        blog_pub_url: `https://github.com/${_config["owner"]}/${_config["repo"]}/issues`, //博客原始文章地址
        blog_new_post_url: `https://github.com/${_config["owner"]}/${_config["repo"]}/issues/new/choose`, //博客发表地址
        blog_config_url: `https://github.com/${_config["owner"]}/${_config["repo"]}/blob/main/src/config.js`, //博客配置文件地址
        blog_help_url: `https://github.com/${_config["owner"]}/${_config["repo"]}/blob/main/README.md`, //博客帮助文档
        blog_aboutme_url: `https://github.com/${_config["owner"]}/${_config["repo"]}/blob/main/About.md` //关于我的文档
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
      isOpenheadmenu: false, //顶部菜单栏是否打开
      ispullupend: false, //是否上拉加载滚动到底
      ispulldownend: true, //是否下拉刷新最新数据
      isshowpulldown: false, //是否显示下拉刷新文字提示
      thefirstpost_number: null, //首次加载的最新博客的issue序号
      isShowLoadingMask: true //是否显示loading遮罩
    }
  },
  created() {
    document.title = this.blog.blog_title
  },
  mounted() {
    const url = this.author.author_post_api_url
    const page = this.page
    const per_page = this.per_page
    const filter = this.filter
    const state = this.state
    const option = {
      url,
      page,
      per_page,
      filter,
      state
    }
    get_post_data(option, (response) => {
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
        this.thefirstpost_number = postlist_owner[0].number
        postlist_owner.forEach((post) => {
          let post_author_nickname = this.author.author_nickname //获取文章作者昵称
          if (this.friends_id.indexOf(post.user.login) > -1) {
            // console.log(this.friends_id.indexOf(post.user.login))
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
      this.isShowLoadingMask = false

      this.$nextTick(() => {
        this.getscroll() //滚动条
      })
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
      const option = {
        url,
        page,
        per_page,
        filter,
        state
      }
      get_post_data(option, (response) => {
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
              // console.log(this.friends_id.indexOf(post.user.login))
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

          if (this.BS) {
            this.BS.finishPullUp()
            this.ispullupend = false
          }

          this.page = parseInt(this.page) + 1
        } else {
          this.ispullupend = true
        }

        // console.log(document.getElementById("container").style.height)
      })
    },
    getlastestpostlist() {
      this.isshowpulldown = true
      this.ispulldownend = true
      //下拉刷新事件
      this.page = 1
      const url = this.author.author_post_api_url
      const page = this.page
      const per_page = this.per_page
      const filter = this.filter
      const state = this.state
      const option = {
        url,
        page,
        per_page,
        filter,
        state
      }
      get_post_data(option, (response) => {
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
          if (
            postlist_owner[0].number &&
            (postlist_owner[0].number !== this.thefirstpost_number ||
              !this.thefirstpost_number) //有新增数据，刷新页面
          ) {
            this.postdata = [] //清空
            postlist_owner.forEach((post) => {
              let post_author_nickname = this.author.author_nickname //获取文章作者昵称
              if (this.friends_id.indexOf(post.user.login) > -1) {
                // console.log(this.friends_id.indexOf(post.user.login))
                //如果作者是好友，就展示好友昵称
                post_author_nickname =
                  this.friends_id.indexOf(post.user.login) > -1
                    ? this.friends_name[
                        this.friends_id.indexOf(post.user.login)
                      ]
                    : post.user.login
              }
              if (post.user) {
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
            this.BS && this.BS.finishPullUp() //页面更新后，重新赋予上拉加载更多
            this.ispullupend = false
            this.thefirstpost_number = postlist_owner[0].number //更新最新issue序号
          }
        }
        this.ispulldownend = false
        this.BS && this.BS.finishPullDown()
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
      return dayjs(date).format("YYYY-MM-DD HH:mm:ss")
    },
    dateformat(date) {
      return get_day_format(date) // 日期格式化 ./utils/dayjs_help.js
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

      // this.BS = BetterScroll.createBScroll("#container", {
      //   probeType: 3,
      //   pullUpLoad: true,
      //   pullDownRefresh: true,
      //   click: true,
      //   // scrollY: true,
      //   scrollbar: true
      //   // useTransition: false
      // })
      BScroll.use(PullUp)
      BScroll.use(PullDown)
      BScroll.use(ScrollBar)
      this.BS = new BScroll("#container", {
        probeType: 3,
        pullUpLoad: true,
        pullDownRefresh: true,
        click: true,
        // scrollY: true,
        scrollbar: true
        // useTransition: false
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

      this.BS.on("pullingDown", () => {
        this.getlastestpostlist()
        let settimeout = null
        if (settimeout) {
          clearTimeout(settimeout)
        }
        settimeout = setTimeout(() => {
          this.ispulldownend = true
        }, 500)
      })
      this.BS.on("enterThreshold", () => {
        // 避免回弹动画触发
        if (!this.BS.pending) {
          this.isshowpulldown = false
        }
        if (!this.BS.pending && this.BS.y >= -90) {
          if (!this.isshowpulldown) {
            this.isshowpulldown = true
          } else {
            return false
          }
        } else {
          return false
        }
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
        this.isshowpulldown = false
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
      get_theme_change() //深色和浅色主题切换 // ./utils/theme_help.js
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
    },
    headmenuNewPostClick() {
      //顶部菜单栏发表动态
      this.isOpenheadmenu = !this.isOpenheadmenu //隐藏菜单栏
      this.isShowLoadingMask = true //显示遮罩层
      // get_url_valid(`https://api.github.com/`, (response) => {
      //   console.log(response.status)
      //   if (response.status === 200) { //判断是否可以访问
      //     location.href = this.blog.blog_new_post_url //跳转链接
      //   } else {
      //     _config["github_url"] = _config["github_ip"]
      //     this.updateData()
      //     location.href = this.blog.blog_new_post_url //跳转链接
      //   }
      // })
      location.href = this.blog.blog_new_post_url //跳转链接
    },
    headmenuEditPostClick() {
      //编辑动态
      this.isOpenheadmenu = !this.isOpenheadmenu //隐藏菜单栏
      this.isShowLoadingMask = true //显示遮罩层
      location.href = this.blog.blog_pub_url //跳转链接
    },
    headmenuEditConfigClick() {
      //修改配置
      this.isOpenheadmenu = !this.isOpenheadmenu //隐藏菜单栏
      this.isShowLoadingMask = true //显示遮罩层
      location.href = this.blog.blog_config_url //跳转链接
    },
    headmenuViewHelpClick() {
      //帮助文档
      this.isOpenheadmenu = !this.isOpenheadmenu //隐藏菜单栏
      this.isShowLoadingMask = true //显示遮罩层
      location.href = this.blog.blog_help_url //跳转链接
    },
    headmenuAboutMeClick() {
      //关于
      this.isOpenheadmenu = !this.isOpenheadmenu //隐藏菜单栏
      this.isShowLoadingMask = true //显示遮罩层
      location.href = this.blog.blog_aboutme_url //跳转链接
      // window.open(this.blog.blog_aboutme_url) //跳转链接
    },
    headmenuGoHomeClick() {
      //回到首页
      this.isOpenheadmenu = !this.isOpenheadmenu //隐藏菜单栏
      // this.isShowLoadingMask = true //显示遮罩层
      location.href = this.blog.blog_url //跳转链接
      // this.isShowLoadingMask = false //隐藏遮罩层
    },
    updateData() {
      //动态修改data
      this.blog.blog_pub_url = `https://${_config["github_url"]}/${_config["owner"]}/${_config["repo"]}/issues`
      this.blog.blog_new_post_url = `https://${_config["github_url"]}/${_config["owner"]}/${_config["repo"]}/issues/new/choose`
      this.blog.blog_config_url = `https://${_config["github_url"]}/${_config["owner"]}/${_config["repo"]}/blob/main/src/config.js`
      this.blog.blog_help_url = `https://${_config["github_url"]}/${_config["owner"]}/${_config["repo"]}/blob/main/README.md`
      this.blog.blog_aboutme_url = `https://${_config["github_url"]}/${_config["owner"]}/${_config["repo"]}/blob/main/About.md`

      this.author.author_url = `https://${_config["github_url"]}/${_config["owner"]}`
      this.author.author_repo = `https://${_config["github_url"]}/${_config["owner"]}/${_config["repo"]}`
    }
  }
})
