<template>
      <div class="Jcommon-layout">
        <div class="Jcommon-layout-center">
            <el-row class="Jcommon-search-box" :gutter="16">
    			<el-form :model="queryParams" ref="queryForm" v-show="showSearch">
					<el-col :span="6">
				      <el-form-item label="姓名" prop="userName">
				        <el-input
				          v-model="queryParams.userName"
				          placeholder="请输入姓名"
				          clearable
				          size="small"
				          @keyup.enter.native="handleQuery"
				        />
				      </el-form-item>
				     </el-col>
				      <el-col :span="6">
					      <el-form-item label="性别" prop="sex">
					        <el-select v-model="queryParams.sex" placeholder="请选择性别" clearable size="small">
					          <el-option v-for="item in dict.type.sys_user_sex" :label="item.label" :value="item.value" />
					        </el-select>
					      </el-form-item>
				      </el-col>
					<el-col :span="6">
				      <el-form-item label="身高" prop="height">
				        <el-input
				          v-model="queryParams.height"
				          placeholder="请输入身高"
				          clearable
				          size="small"
				          @keyup.enter.native="handleQuery"
				        />
				      </el-form-item>
				     </el-col>
					<el-col :span="6">
				      <el-form-item label="体重" prop="weight">
				        <el-input
				          v-model="queryParams.weight"
				          placeholder="请输入体重"
				          clearable
				          size="small"
				          @keyup.enter.native="handleQuery"
				        />
				      </el-form-item>
				     </el-col>
					<el-col :span="6">
				      <el-form-item label="报告地址" prop="reportUrl">
				        <el-input
				          v-model="queryParams.reportUrl"
				          placeholder="请输入报告地址"
				          clearable
				          size="small"
				          @keyup.enter.native="handleQuery"
				        />
				      </el-form-item>
				     </el-col>
					  <el-col :span="6">
					      <el-form-item>
					        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
					        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
					      </el-form-item>
				      </el-col>
				</el-form>
			</el-row>
			<div class="Jcommon-layout-main Jflex-main">
				<div class="Jcommon-head">
				    <el-row :gutter="10" class="mb8">
				      <el-col :span="1.5">
				        <el-button
				          type="primary"
				          plain
				          icon="el-icon-plus"
				          size="mini"
				          @click="handleAdd"
				          v-hasPermi="['owner:report:add']"
				        >新增</el-button>
				      </el-col>
				      <el-col :span="1.5">
				        <el-button
				          type="success"
				          plain
				          icon="el-icon-edit"
				          size="mini"
				          :disabled="single"
				          @click="handleUpdate"
				          v-hasPermi="['owner:report:edit']"
				        >修改</el-button>
				      </el-col>
				      <el-col :span="1.5">
				        <el-button
				          type="danger"
				          plain
				          icon="el-icon-delete"
				          size="mini"
				          :disabled="multiple"
				          @click="handleDelete"
				          v-hasPermi="['owner:report:remove']"
				        >删除</el-button>
				      </el-col>
				      <el-col :span="1.5">
				        <el-button
				          type="warning"
				          plain
				          icon="el-icon-download"
				          size="mini"
				          :loading="exportLoading"
				          @click="handleExport"
				          v-hasPermi="['owner:report:export']"
				        >导出</el-button>
				      </el-col>
              <el-col :span="1.5">
                <el-button
                  type="success"
                  plain
                  icon="el-icon-files"
                  size="mini"
                  @click="handleGenerate"
                >生成报告</el-button>
              </el-col>
				    </el-row>
				     <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
				 </div>

			    <JTable v-loading="loading" :data="reportList" @selection-change="handleSelectionChange">
			      <el-table-column type="selection" width="55" align="center" />
  				  <el-table-column label="姓名" align="center" prop="userName" />
  				  <el-table-column label="性别" align="center" prop="sex">
              <template slot-scope="scope">
                <dict-tag :options="dict.type.sys_user_sex" :value="scope.row.sex" />
              </template>
            </el-table-column>
  				  <el-table-column label="身高" align="center" prop="height" />
  				  <el-table-column label="体重" align="center" prop="weight" />
  				  <el-table-column label="报告地址" align="center" prop="reportUrl" />
  				  <el-table-column label="备注" align="center" prop="remark" />
			      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
			        <template slot-scope="scope">
			          <el-button
			            size="mini"
			            type="text"
			            icon="el-icon-edit"
			            @click="handleUpdate(scope.row)"
			            v-hasPermi="['owner:report:edit']"
			          >修改</el-button>
			          <el-button
			            size="mini"
			            type="text"
			            icon="el-icon-delete"
			            @click="handleDelete(scope.row)"
			            v-hasPermi="['owner:report:remove']"
			          >删除</el-button>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-download"
                  @click="handleDownload(scope.row)"
                >下载报告</el-button>
			        </template>
			      </el-table-column>
			    </JTable>

			    <pagination
			      v-show="total>0"
			      :total="total"
			      :page.sync="queryParams.pageNum"
			      :limit.sync="queryParams.pageSize"
			      @pagination="getList"
			    />
			  </div>
		  </div>

    <!-- 添加或修改报告用户信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户 ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户 ID" />
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择性别">
            <el-option v-for="item in dict.type.sys_user_sex" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="身高" prop="height">
          <el-input v-model="form.height" placeholder="请输入身高" />
        </el-form-item>
        <el-form-item label="体重" prop="weight">
          <el-input v-model="form.weight" placeholder="请输入体重" />
        </el-form-item>
        <el-form-item label="报告地址" prop="reportUrl">
          <el-input v-model="form.reportUrl" placeholder="请输入报告地址" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listReport,
  getReport,
  delReport,
  addReport,
  updateReport,
  exportReport,
  generateReport,
  downloadReport
} from '@/api/owner/report';

export default {
  name: "Report",
  dicts: ['sys_user_sex'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 报告用户信息表格数据
      reportList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: null,
        sex: null,
        height: null,
        weight: null,
        reportUrl: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询报告用户信息列表 */
    getList() {
      this.loading = true;
      listReport(this.queryParams).then(response => {
        this.reportList = response.data.list;
        this.total = response.data.pagination.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        userId: null,
        userName: null,
        sex: null,
        height: null,
        weight: null,
        reportUrl: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加报告用户信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getReport(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改报告用户信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateReport(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addReport(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除报告用户信息编号为"' + ids + '"的数据项？').then(function() {
        return delReport(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 下载报告 */
    handleDownload(row) {
      downloadReport(row).then(response => {
        // todo 处理后端返回的报告
        this.$modal.msgSuccess("下载成功");
      })
    },
    handleGenerate() {
      generateReport({}).then(response => {
        // todo 不可重复生成，逻辑全部在后端实现
        this.$modal.msgSuccess("生成成功");
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有报告用户信息数据项？').then(() => {
        this.exportLoading = true;
        return exportReport(queryParams);
      }).then(response => {
        this.$download.name(response.msg);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
