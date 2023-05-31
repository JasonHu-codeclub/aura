import Mock from 'mockjs';
import resource from './resource.json'
import studentDegree from './studentDegree.json'
import actionType from './actionType.json'
import course from './course.json'

// 拦截软件资源数据请求
Mock.mock('/mock/resource','get',{code:200, messgae:'Success', data:resource})

// 拦截学生层次数据请求
Mock.mock('/mock/studentDegree','get',{code:200, messgae:'Success', data:studentDegree})

// 拦截实验类型数据请求
Mock.mock('/mock/actionType','get',{code:200, messgae:'Success', data:actionType})

// 拦截课程称呼数据请求
Mock.mock('/mock/course','get',{code:200, messgae:'Success', data:course})