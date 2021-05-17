

import request from "@utils/request.js"

// 获取会议类型meeting_type/会议配置configuration/会议服务provide
export function getMeetingConfigApi (data) {
    return request({
      url: "/api_v1/system/dict",
      method: "get",
      params:  data 
    })
}

// 预约会议
export function reserveApi (data) {
    return request({
      url: '/api_v1/meeting/once/appointment',//"/tutorial/appointment/",
      method: "POST",
      data
    })
}

// 预约重复会议 ----------新增------------------------------
export function reserveRepeatApi (data) {
    return request({
      url: "/tutorial/loopappointment/",
      method: "post",
      data
    })
}


// 获取城市请求
export function getCityApi (data) {
    return request({
      url: "/api_v1_1/device/city/",
      method: "get",
      params: data
    })
}

// 获取楼层
export function getBuildingApi (data) {
    return request({
      url: "/api_v1_1/device/mansion/",
      method: "get",
      params: data
    })
}

// 获取人数分组
export function getCategoryApi (data) {
    return request({
      url: "/api_v1/system/number_group",
      method: "get",
      params: data
    })
}

// 获取获取状态
export function getStatusApi (data) {
    return request({
      url: "/api_v1/system/status_group",
      method: "get",
      params: data
    })
}

// 获取会议室列表
export function getMeetingsApi (data) {
    return request({
      url: '/api_v1/meeting/room_meeting',
      method: "get",
      params: data
    })
}

// 可见预约会议室
export function getVisibleRoomApi (data) {
  return request({
    url: '/api_v1/region/visible/room',
    method: "get",
    params: data
  })
}


// 获取参会人员
export function getAllPeopleApi (data) {
    return request({
      url: "/user/get_department/",
      method: "get",
      params: data
    })
}

// 预约会议请求
export function getConflictApi (data) {
  return request({
    url: "/tutorial/checkapprove/",
    method: "post",
    data
  })
}

// 获取会议详情信息
export function getMeetingInfoApi (data) {
  return request({
    url: "/api_v1/meeting/edit",
    method: "get",
    params: data
  })
}

// 楼层会议室
export function getFloorRoomApi (data) {
  return request({
    url: "/api_v1/region/floor/room",
    method: "get",
    params: data
  })
}


// 会议预约保存
export function saveMeetingInfoApi (data) {
  return request({
    url: '/api_v1/meeting/edit',// "/api_v1/around/meeting",
    method: "post",
    data
  })
}

// 修改会议
export function editMeetingInfoApi (data) {
  return request({
    url: '/api_v1/meeting/edit',// "/api_v1/around/meeting",
    method: "put",
    data
  })
}

// 获取部门
export function getDepartmentApi (data) {
  return request({
    url: "/user/get_department_v2/",
    method: "get",
    params: data
  })
}


// 更改指定会议信息请求
export function  updateMyMeetingApi (data) {
  return request({
    url: "/tutorial/changeconference/",
    method: "POST",
    data
  })
}
