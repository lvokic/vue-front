<template>
  <div style="text-align: left">
    <el-button class="add-button" type="success" @click="dialogFormVisible = true">新增作业</el-button>
    <el-dialog
      title="添加/修改作业"
      :visible.sync="dialogFormVisible"
      @close="clear">
      <el-form v-model="form" style="text-align: left" ref="dataForm">
        <el-form-item label="作业名" :label-width="formLabelWidth" prop="title">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="作业类型" :label-width="formLabelWidth" prop="cid">
          <el-select v-model="form.category.id" placeholder="请选择类型" @change="onCategoryChange">
            <el-option label="客观题" value="1"></el-option>
            <el-option label="半开放" value="2"></el-option>
            <el-option label="主观题" value="3"></el-option>
          </el-select>
        </el-form-item>
        <!-- 上传作业问题按钮 -->
        <el-form-item class="center-button">
          <el-button type="primary" @click="openHomeworkProblemUploadDialog">上传作业问题</el-button>
        </el-form-item>
        <!-- 提交模版按钮，仅当选择“客观题”或“半开放”时显示 -->
        <el-form-item v-if="showTemplateUpload" class="center-button">
          <el-button type="primary" @click="openFileUploadDialog">上传作业答案</el-button>
        </el-form-item>
        <el-form-item prop="id" style="height: 0">
          <el-input type="hidden" v-model="form.id" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 引入并使用文件上传组件，传递上传的地址 -->
    <FileUpload ref="fileUpload" :uploadAction="uploadAction" :homeworkName="form.title"/>
    <FileUpload ref="homeworkProblemFileUpload" :uploadAction="homeworkProblemUploadAction" :homeworkName="form.title"/>
  </div>
</template>

<script>
import FileUpload from './FileUpload'

export default {
  name: 'EditForm',
  components: {FileUpload},
  data() {
    return {
      dialogFormVisible: false,
      form: {
        title: '',
        category: {
          id: '',
          name: ''
        }
      },
      formLabelWidth: '100px',
      showTemplateUpload: false, // 控制提交模版按钮的显示
      uploadAction: '', // 用于存储上传的地址
      homeworkProblemUploadAction: ''
    };
  },
  methods: {
    clear() {
      this.form = {
        title: '',
        category: {
          id: '',
          name: ''
        }
      };
    },

    // 监听作业类型选择变化，决定是否显示提交模版按钮
    onCategoryChange(value) {
      if (value === "1" || value === "2")
        this.showTemplateUpload = true;
      else
        this.showTemplateUpload = false;

      // 根据作业类型动态设置上传接口地址
      if (value === "1") {
        this.uploadAction = '/upload/template/objective'; // 客观题上传地址
        this.homeworkProblemUploadAction = '/upload/problem/objective'
        this.form.category.name = '客观题';
      } else if (value === "2") {
        this.uploadAction = '/upload/template/subjective'; // 半开放题上传地址
        this.homeworkProblemUploadAction = '/upload/problem/subjective'
        this.form.category.name = '半开放';
      } else {
        this.homeworkProblemUploadAction = '/upload/problem/open'
        this.uploadAction = ''; // 主观题无需上传
        this.form.category.name = '主观';
      }
    },

    onSubmit() {
      console.log(this.form.title);
      console.log(this.form.category.name);
      this.$axios
        .post('/homework/add', {
          name: this.form.title,
          category: this.form.category.name
        })
        .then((resp) => {
          if (resp && resp.data.code === 200) {
            this.dialogFormVisible = false;
            this.$emit('onSubmit');
          }
        });
    },

    // 打开文件上传对话框
    openFileUploadDialog() {
      this.$refs.fileUpload.openDialog(); // 触发 FileUpload 组件中的 openDialog 方法
    },
    openHomeworkProblemUploadDialog() {
      this.$refs.homeworkProblemFileUpload.openDialog();
    }
  }
};
</script>

<style scoped>
.add-button {
  margin: 18px 0 0 10px;
}

.center-button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px; /* 可调整间距 */
}
</style>