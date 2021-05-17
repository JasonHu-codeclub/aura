/*
 * Created: 2020-10-09 11:38:32
 * Author : Jan
 * Last Modified: 2020-10-14 11:32:43
 * Modified By: Jan
 * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved.
 */

/**
  * 表格自适应方法
  */
export const tableAutoHeight = {
  data () {
    return {
      tableHeight: 50
    }
  },
  methods: {
    resizeHeight (offset) {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetParent.offsetTop - offset
        // 监听窗口大小变化
        let self = this
        window.onresize = function () {
          // self.tableHeight = window.innerHeight - self.$refs.table.$el.offsetTop - 50
          self.tableHeight = window.innerHeight - self.$refs.table.$el.offsetParent.offsetTop - offset
        }
      })
    }
  }
}

export const handleArr = {
  methods: {
    // 根据是否同一个id去重
    unique (arr) {
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
  }
}
