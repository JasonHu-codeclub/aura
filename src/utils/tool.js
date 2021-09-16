import { imgBaseUrl } from "@/utils/varible";
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

// 企业微信appid解密
function decrypt (string, key) {
  string = base64_decode(string);
  var len = key.length;
  var code = "";
  for (var i = 0; i < string.length; i++) {
    var k = i % len;
    code += String.fromCharCode(string.charCodeAt(i) ^ key.charCodeAt(k));
  }
  return base64_decode(code);
}

function base64_decode (data) {
  var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var o1,
    o2,
    o3,
    h1,
    h2,
    h3,
    h4,
    bits,
    i = 0,
    ac = 0,
    dec = "",
    tmp_arr = [];
  if (!data) {
    return data;
  }
  data += "";
  do {
    // unpack four hexets into three octets using index points in b64
    h1 = b64.indexOf(data.charAt(i++));
    h2 = b64.indexOf(data.charAt(i++));
    h3 = b64.indexOf(data.charAt(i++));
    h4 = b64.indexOf(data.charAt(i++));
    bits = (h1 << 18) | (h2 << 12) | (h3 << 6) | h4;
    o1 = (bits >> 16) & 0xff;
    o2 = (bits >> 8) & 0xff;
    o3 = bits & 0xff;
    if (h3 == 64) {
      tmp_arr[ac++] = String.fromCharCode(o1);
    } else if (h4 == 64) {
      tmp_arr[ac++] = String.fromCharCode(o1, o2);
    } else {
      tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
    }
  } while (i < data.length);
  dec = tmp_arr.join("");
  return dec;
}

// 设置icon
function setIcon(url){
  let link = document.querySelector("link[rel*='icon']") || document.createElement("link");
  link.href = imgBaseUrl + url + "?time=" + new Date().getTime(); // icon
  link.rel = "icon";
  document.getElementsByTagName("head")[0].appendChild(link);
}

export {
  getHost,
  unfoldArr,
  downLoadXls,
  deduplicate,
  decrypt,
  setIcon
}