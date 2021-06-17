import request from "@utils/request.js"

// 会议详情
export function getMeetingDetailApi (data) {
    return request({
      url: "/meeting-detail/" + data.id,
      method: "get",
    })
}

// 部门信息
export function getDepartmentApi (data) {
  return request({
    url: "/department/get-user",
    method: "get",
    params:  data 
  })
}