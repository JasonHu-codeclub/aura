/*
 * Created: 2021-03-02 15:35:32
 * Author : Jan
 * Last Modified: 2021-03-17 11:17:22
 * Modified By: Jan
 * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved.
 */


// 动态请求头
const getHost = function (url) {
  let host = null
  // if (typeof url === 'undefined' || url === null)
  url = window.location.href
  const regex = /(\w+):\/\/([^/:]+)(:\d*)?/
  const match = url.match(regex)
  if (typeof match !== 'undefined' && match !== null) {
    host = match[0]
  }
  return host
}

// 展开所有嵌套数组
function unfoldArr (data) {
  let arr = []
  data.forEach(item => {
    arr.push(item)
    if (item.items && item.items.length > 0) {
      const itemArr = this.handleArr(item.items)
      arr.push(...itemArr)
    }
  })
  return arr
}

// 去除数组中id重复的对象
function deduplicate (arr) {
  if (!Array.isArray(arr)) {
    console.log('type error!')
    return
  }
  var array = []
  for (var i = 0; i < arr.length; i++) {
    if (array.filter(ele => ele.id === arr[i].id).length === 0) {
      array.push(arr[i])
    }
  }
  return array
}

// 下载blob格式文件
function downLoadXls (data, filename) {
  const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }) // 接收的是blob，若接收的是文件流，需要转化一下
  if (typeof window.chrome !== 'undefined') {
    // Chrome version
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(data);
    link.download = filename;
    link.click();
  } else {
    // IE version
    window.navigator.msSaveBlob(blob, filename);
  }
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime (time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}



export {
  getHost,
  unfoldArr,
  downLoadXls,
  deduplicate
}