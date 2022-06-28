//日期本地化配置,中文配置
function get_dayjs_init() {
  dayjs.locale("zh-cn")
}

//日期格式化
function get_day_format(date) {
  const nowdate = dayjs()
  const diff_day = nowdate.diff(
    dayjs(date).format("YYYY-MM-DD 00:00:00"),
    "day",
    true
  )
  const diff_hour = nowdate.diff(date, "hour", true)
  const diff_minute = nowdate.diff(date, "minute", true)
  const diff_seconds = nowdate.diff(date, "second", true)
  if (diff_seconds < 60) {
    return "刚刚"
  } else if (diff_minute < 60) {
    return parseInt(diff_minute) + "分钟前"
  } else if (diff_hour < 24) {
    return parseInt(diff_hour) + "小时前"
  } else if (diff_day < 2) {
    return "昨天  " + dayjs(date).format("HH:mm:ss")
  } else {
    return dayjs(date).format("YYYY-MM-DD HH:mm:ss")
  }
}
