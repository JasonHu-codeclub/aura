/*
 * Created: 2021-03-10 14:28:50
 * Author : Jan
 * Last Modified: 2021-03-17 15:15:02
 * Modified By: Jan
 * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved.
 */

<template>
  <div class="app-container">
    <!-- 根据权限显示 -->
    <el-button type="primary" v-role="['super']">add</el-button>
    <div class="filter-container">
      <el-input
        v-model="searchName"
        class="filter-item"
        style="width: 160px"
        placeholder="姓名"
      />
      <el-select
        v-model="searchType"
        class="filter-item"
        style="margin-left: 10px"
        placeholder="请选择种类"
      >
        <el-option
          v-for="item in typeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-search"
        >搜索</el-button
      >
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleExport"
        >导出</el-button
      >
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-circle-plus-outline"
        @click="handleCreate"
        >新增</el-button
      >
      <el-button class="filter-item" type="danger" icon="el-icon-remove-outline"
        >批量删除</el-button
      >
    </div>

    <el-table
      :data="tableData"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column type="index" label="序号" width="60" align="center">
      </el-table-column>
      <el-table-column prop="date" label="日期" width="180" align="center">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="180" align="center">
      </el-table-column>
      <el-table-column prop="address" label="地址" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, tableData)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :hidden="total === 0"
      :total="total"
      :page.sync="paginationQuery.page"
      :limit.sync="paginationQuery.limit"
      @change="getTableData"
    />

    <el-dialog
      v-dialog-drag
      title="新增"
      :visible.sync="dialogIsShow"
      :before-close="handleDialogClose"
    >
      <el-form
        ref="tempForm"
        :model="tempData"
        :rules="tempRules"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="tempData.name" placeholder="输入名称"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input
            v-model="tempData.age"
            placeholder="输入年龄"
          ></el-input> </el-form-item
        ><el-form-item label="备注" prop="remark">
          <el-input v-model="tempData.remark" placeholder="输入备注"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="tempData.type" placeholder="选择类型">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="时间" prop="timestamp">
          <el-date-picker
            v-model="tempData.timestamp"
            type="datetime"
            placeholder="Please pick a date"
          />
        </el-form-item>
        <el-form-item label="评价">
          <el-rate
            v-model="tempData.importance"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
            :max="3"
            style="margin-top: 8px"
          />
        </el-form-item>
        <el-form-item label="单选">
          <el-radio-group v-model="tempData.radio">
            <el-radio :label="3">备选项</el-radio>
            <el-radio :label="6">备选项</el-radio>
            <el-radio :label="9">备选项</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="多选">
          <el-checkbox-group v-model="tempData['checkList']">
            <el-checkbox label="选项A"></el-checkbox>
            <el-checkbox label="选项B"></el-checkbox>
            <el-checkbox label="选项C"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogIsShow = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { parseTime } from '@/utils/tool'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  data () {
    return {
      searchName: '',
      searchType: '',
      typeOptions: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      tempData: {
        checkList: [],
        name: '',
        age: '',
        remark: '',
        type: '',
        timestamp: '',
        importance: 0,
        radio: 3,
      },
      tempRules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        remark: [
          { required: false, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
      },
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      multipleSelection: [],
      paginationQuery: {
        page: 1,
        limit: 10,
      },
      total: 100,
      tableLoading: false,
      dialogIsShow: false,
      dialogStatus: 'create'
    }
  },
  computed: {},
  watch: {},
  methods: {
    getTableData () {
      // this.tableLoading = true
      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.total = response.data.total

      //   // Just to simulate the time of the request
      //   setTimeout(() => {
      //     this.tableLoading = false
      //   }, 1.5 * 1000)
      // })
    },
    handleCurrentChange () {

    },
    handleSizeChange () {

    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      console.log('multipleSelection', this.multipleSelection)
    },
    handleEdit (index, rows) {
      this.tempData = Object.assign({}, rows) // copy obj
      this.dialogStatus = 'update'
      this.dialogIsShow = true
      this.$nextTick(() => {
        this.$refs['tempForm'].clearValidate()
      })
    },
    editData () {

    },
    handleCreate () {
      this.dialogStatus = 'create'
      this.dialogIsShow = true
      this.resetTemp()
      this.$nextTick(() => {
        this.$refs['tempForm'].clearValidate()
      })
    },
    createData () {

    },
    resetTemp () {
      this.tempData = {
        checkList: [],
        name: '',
        importance: 0,
        age: '',
        remark: '',
        timestamp: new Date(),
        type: ''
      }
    },
    handleDelete (index, rows) {
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        rows.splice(index, 1)
      }).catch(() => {
      })
    },
    handleExport () {
      import('@/utils/exportToExcel').then(excel => {
        const tHeader = ['date', 'name', 'address']
        const filterVal = ['date', 'name', 'address']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
      })
    },
    formatJson (filterVal) {
      return this.tableData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    handleDialogClose (done) {
      done()
    }
  },
  created () {

  },
  mounted () {

  }
}
</script>
<style lang='less' scoped>
</style>