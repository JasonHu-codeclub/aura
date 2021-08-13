import request from "@utils/request.js"

// 我的会议/历史会议
export function myMeetingListApi (data) {
  return request({
    url: "/my-meeting/list",
    method: "get",
    params: data
  })
}

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
    url: "/department/get-user-department",
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

// 获取会议室设备信息（下拉搜索
export function getRoomEquipmentApi (data) {
  return request({
    url: "/get-room-equipment/"+ data.id,
    method: "get",
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

// 会议编辑
export function saveMeetEditApi (data) {
  return request({
    url: "/meeting-edit/"+ data.id,
    method: "put",
    data
  })
}

// 取消会议
export function meetCancelApi (data) {
  return request({
    url: "/meeting/cancel/"+ data.id,
    method: "put",
    data
  })
}
