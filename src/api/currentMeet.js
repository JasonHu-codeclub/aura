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

// 会议类型
export function getMeetingTypeApi (data) {
  return request({
    url: "/get-meeting-type",
    method: "get",
    params:  data 
  })
}

// 茶点服务
export function getServiceApi (data) {
  return request({
    url: "/get-service",
    method: "get",
    params:  data 
  })
}

// 设备信息
export function getEquipmentApi (data) {
  return request({
    url: "/get-equipment",
    method: "get",
    params:  data 
  })
}


// 重复详情
export function getRepeatDetailApi (data) {
  return request({
    url: "/meeting-show/" + data.id,
    method: "get",
    params:  data 
  })
}