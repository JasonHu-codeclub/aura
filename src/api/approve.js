import request from "@utils/request.js"

// 审批列表
export function approveListApi (data) {
  return request({
    url: "/meeting/approve/list",
    method: "get",
    params: data
  })
}


// 同意审批
export function serviceAgreeApi (data) {
    return request({
        url: "/meeting/approve-service-agree/" + data.id,
        method: "put",
    })
}

// 拒绝审批
export function serviceRefuseApi (data) {
    return request({
        url: "/meeting/approve-service-refuse/" + data.id,
        method: "put",
        params: data
    })
}


// 冲突详情
export function meetingShowApi (data) {
    return request({
      url: "/meeting-show/" + data.id,
      method: "get",
      params: data
    })
  }