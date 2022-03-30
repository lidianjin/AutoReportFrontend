import request from '@/utils/request'

// 查询报告用户信息列表
export function listReport(query) {
  return request({
    url: '/owner/report/list',
    method: 'get',
    params: query
  })
}

// 查询报告用户信息详细
export function getReport(id) {
  return request({
    url: '/owner/report/' + id,
    method: 'get'
  })
}

// 新增报告用户信息
export function addReport(data) {
  return request({
    url: '/owner/report',
    method: 'post',
    data: data
  })
}

// 修改报告用户信息
export function updateReport(id, data) {
  return request({
    url: '/owner/report'+ id,
    method: 'put',
    data: data
  })
}

// 删除报告用户信息
export function delReport(id) {
  return request({
    url: '/owner/report/' + id,
    method: 'delete'
  })
}

// 导出报告用户信息
export function exportReport(query) {
  return request({
    url: '/owner/report/export',
    method: 'get',
    params: query
  })
}