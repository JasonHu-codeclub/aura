import request from "@utils/request.js"


// 会服列表
export function serviceListApi (data) {
    return request({
        url: "/meeting/service/list",
        method: "get",
        params: data
    })
}
  
// 会服确认服务
export function serviceConfirmApi (data) {
    return request({
        url: "/meeting/service-confirm/" + data.id,
        method: "put",
    })
}

// 会服完成服务
export function serviceFinishApi (data) {
    return request({
        url: "/meeting/service-finish/" + data.id,
        method: "put",
    })
}