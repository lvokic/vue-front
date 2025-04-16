<template>
  <div class="homework">
    <el-row class="nav-row" gutter="20">
      <!-- 左侧分类导航栏 -->
      <el-col :span="6">
        <el-menu default-active="1" class="el-menu-vertical-demo" @select="handleCategoryChange"
          background-color="#f4f4f4" text-color="#333" active-text-color="#20a0ff">
          <el-menu-item index="1">客观题</el-menu-item>
          <el-menu-item index="2">半开放</el-menu-item>
          <el-menu-item index="3">主观</el-menu-item>
        </el-menu>
      </el-col>

      <!-- 右侧表格展示 -->
      <el-col :span="18" class="table-container">
        <el-table :data="homeworkList" style="width: 100%">
          <el-table-column label="作业ID" prop="id"></el-table-column>
          <el-table-column label="作业名称" prop="name"></el-table-column>
          <el-table-column label="作业类型" prop="category"></el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button size="small" @click="triggerFileInput(scope.row)" type="primary">
                提交
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 提交作业的对话框 -->
    <el-dialog title="作业提交" :visible.sync="dialogVisible" width="400px" @close="resetForm">
      <el-form :model="formData">
        <!-- 学号输入框 -->
        <el-form-item label="学号" :label-width="formLabelWidth">
          <el-input v-model="formData.studentId" placeholder="请输入学号" />
        </el-form-item>

        <!-- 文件选择框 -->
        <el-form-item label="上传文件" :label-width="formLabelWidth">
          <!-- 隐藏文件选择框 -->
          <input type="file" ref="fileInput" @change="handleFileChange" accept=".txt" style="display:none" />
          <el-button size="small" @click="triggerFileInput" type="primary">选择文件</el-button>
          <span v-if="selectedFile" style="margin-left: 10px;">{{ selectedFile.name }}</span>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitHomework" :loading="loading">
          提交作业
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Article",
  data() {
    return {
      activeCategory: "客观题", // 默认选中的类别
      homeworkList: [],
      selectedFile: null, // 用于保存用户选择的文件
      selectedHomework: null, // 用于保存当前选择的作业名称
      dialogVisible: false, // 控制对话框的显示与隐藏
      studentId: "",
      formData: {
        studentId: "", // 学号
      },
      loading: false, // 提交按钮的加载状态
      formLabelWidth: "80px", // 表单项的标签宽度
    };
  },
  watch: {
    activeCategory(newCategory) {
      this.fetchHomework(newCategory); // 每次类别变化时重新加载数据
    },
  },
  methods: {
    fetchHomework(category) {
      this.$axios
        .get(`/homework/${category}`)
        .then((response) => {
          if (response.data && Array.isArray(response.data)) {
            this.homeworkList = response.data;
          }
        })
        .catch((error) => {
          console.error("获取作业列表失败:", error);
        });
    },

    // 分类选择切换
    handleCategoryChange(index) {
      if (index === "1") {
        this.category = "客观题";
      } else if (index === "2") {
        this.category = "半开放";
      } else {
        this.category = "主观";
      }
      this.fetchHomework(this.category);
    },

    // 触发文件选择框，并保存当前选择的作业信息
    triggerFileInput(row) {
      this.selectedHomework = row; // 保存当前作业信息
      this.dialogVisible = true; // 显示对话框
      this.$nextTick(() => {
        this.$refs.fileInput.click(); // 在下一次事件循环中触发文件选择框点击事件
      });
    },

    // 选择文件后更新 selectedFile
    handleFileChange(event) {
      const file = event.target.files[0]; // 获取文件
      if (file && file.name.endsWith(".txt")) {
        this.selectedFile = file;
      } else {
        this.$message.error("请上传一个 .txt 文件");
        this.selectedFile = null; // 清空文件选择
      }
    },

    // 更新成绩
    renewGrade(data) {
      console.log("更新成绩数据:", data);
      this.$axios
        .post("grades/renew", data)
        .then((response) => {
          this.$message.success("作业提交成功！");
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // 提交作业
    submitHomework() {
      if (!this.selectedFile) {
        this.$message.error("请先选择一个作业文件");
        return;
      }
      if (!this.formData.studentId) {
        this.$message.error("请填写学号");
        return;
      }
      this.loading = true; // 显示提交按钮的加载状态
      this.studentId = this.formData.studentId;
      // 创建 FormData 对象
      const formData = new FormData();
      formData.append("file", this.selectedFile); // 将文件附加到 FormData 中
      formData.append("homeworkName", this.selectedHomework.name); // 附加作业名称
      formData.append("homeworkID", Number(this.selectedHomework.id))
      formData.append("studentId", Number(this.formData.studentId)); // 附加学号
      var path;
      if (this.activeCategory === "客观题") {
        path = "/upload/submit/objective";
      } else if (this.activeCategory === "主观") {
        path = "/upload/submit/subjective";
      } else {
        path = "/upload/submit/semi-open"; // 半开放类型
      }
      console.log("Request path:", path);

      // 使用 axios 提交请求
      this.$flaskAxios
        .post(path, formData)
        .then((response) => {
          console.log('Response Data:', response.data);
          this.$message.success(`提交了作业: ${this.selectedHomework.name}`);
          this.dialogVisible = false; // 关闭对话框
          this.loading = false; // 隐藏提交按钮的加载状态
          this.renewGrade(response.data);
        })
        .catch((error) => {
          this.$message.error("作业提交失败，请稍后再试");
          this.loading = false;
        });
    },

    // 重置表单数据
    resetForm() {
      this.selectedFile = null;
      this.formData.studentId = "";
    },
  },

  // 在组件加载时获取作业数据
  mounted() {
    this.fetchHomework(this.activeCategory);
  },
};
</script>

<style scoped>
/* 设置整体布局 */
.homework {
  display: flex;
  justify-content: center;
  padding: 20px;
}

/* 左侧导航栏样式 */
.el-menu-vertical-demo {
  height: 100%;
  border-right: 1px solid #ddd;
  font-size: 14px;
}

.el-menu-item {
  padding: 5px 15px;
}

.el-menu-item:hover {
  background-color: #f5f5f5;
}

.el-menu-item.is-active {
  background-color: #20a0ff;
  color: white;
}

/* 右侧表格样式 */
.el-table {
  width: 100%;
  margin-left: 20px;
}

.el-table th,
.el-table td {
  text-align: center;
}

.el-table-column {
  text-align: center;
}

.el-table .el-button {
  margin-top: 5px;
  width: 80px;
  margin-left: auto;
  margin-right: auto;
}

.el-col {
  padding: 0 20px;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.nav-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
}

.el-col:nth-child(1) {
  flex: 0 0 20%;
}

.el-col:nth-child(2) {
  flex: 1;
  max-width: 80%;
}
</style>