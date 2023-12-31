import request from "@utils/request.js"
import mockRequest from "@utils/mockRequest.js"

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




// 结束会议
export function meetingOverApi (data) {
  return request({
    url: "/meeting/over/"+ data.id,
    method: "post",
    params:  data 
  })
}
// 同意参会
export function meetingAgreeAttendApi (data) {
  return request({
    url: "/meeting/agree_attend/"+ data.id,
    method: "post",
    params:  data 
  })
}
// 拒绝参会
export function meetingRefushAttendApi (data) {
  return request({
    url: "/meeting/refush_attend/"+ data.id,
    method: "post",
    params:  data 
  })
}

//获取预约配置
export function getSettingAppointmentConfigApi() {
  return request({
    url: "/setting/appointment_config",
    method: "get",
  })
}

// 获取软件资源信息
export function getResourceApi() {
  return mockRequest({
    url: "/resource",
    method: "get",
  })
}

// 获取学生层次信息
export function getStudentDegreeApi() {
  return mockRequest({
    url: "/studentDegree",
    method: "get",
  })
}

// 获取实验类型信息
export function getActionTypeApi() {
  return mockRequest({
    url: "/actionType",
    method: "get",
  })
}

// 获取课程称号信息
export function getCourseApi() {
  return mockRequest({
    url: "/course",
    method: "get",
  })
}