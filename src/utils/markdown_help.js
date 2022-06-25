/**
 * markdown转换配置
 */
//markdjs markdown转html设置
function get_marked_init() {
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
}
