<template>
  <div class="homework">
    <el-row class="nav-row" gutter={20}>
      <!-- 左侧分类导航栏 -->
      <el-col :span="6">
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          @select="handleCategoryChange"
          background-color="#f4f4f4"
          text-color="#333"
          active-text-color="#20a0ff"
        >
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
              <el-button
                size="small"
                @click="triggerFileInput"
                type="primary"
              >
                提交
              </el-button>
              <!-- 隐藏文件选择框 -->
              <input
                type="file"
                ref="fileInput"
                @change="handleFileChange"
                accept=".txt"
                style="display:none"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>


<script>
export default {
  name : "Article", 
  data() {
    return {
      activeCategory: "客观题",  // 默认选中的类别
      homeworkList: [],
      selectedFile: null,  // 用于保存用户选择的文件
    };
  },
  watch: {
    activeCategory(newCategory) {
      this.fetchHomework(newCategory);  // 每次类别变化时重新加载数据
    }
  },
  methods: {
    fetchHomework(category) {
      this.$axios
        .get(`/homework/${this.category}`)
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
      if (index === '1') {
        this.category = '客观题';
      } else if (index === '2') {
        this.category = '半开放';
      } else {
        this.category = '主观';
      }
      this.fetchHomework(this.category);
    },

    // 触发文件选择框
    triggerFileInput() {
      this.$refs.fileInput.click();  // 点击文件输入框
    },

    // 选择文件后更新 selectedFile
    handleFileChange(event) {
      const file = event.target.files[0];  // 获取文件
      if (file && file.name.endsWith(".txt")) {
        this.selectedFile = file;
      } else {
        this.$message.error("请上传一个 .txt 文件");
        this.selectedFile = null;  // 清空文件选择
      }
    },

    // 提交作业
    handleSubmitHomework(row) {
      if (!this.selectedFile) {
        this.$message.error('请先选择一个作业文件');
        return;
      }

      // 创建 FormData 对象
      const formData = new FormData();
      formData.append('file', this.selectedFile);  // 将文件附加到 FormData 中
      formData.append('homeworkName', row.name);  // 可选：附加作业名称等其他数据

      // 使用 axios 提交请求
      this.$axios.post('/your-backend-endpoint', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',  // 让服务器知道请求是上传文件
        },
      })
      .then(response => {
        this.$message.success(`提交了作业: ${row.name}`);
      })
      .catch(error => {
        this.$message.error('作业提交失败，请稍后再试');
        console.error(error);
      });
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
  font-size: 14px; /* 缩小字体大小 */
}

.el-menu-item {
  padding: 5px 15px; /* 减小每个菜单项的内边距 */
}

.el-menu-item:hover {
  background-color: #f5f5f5; /* 鼠标悬停时背景色 */
}

.el-menu-item.is-active {
  background-color: #20a0ff; /* 激活状态下的背景色 */
  color: white; /* 激活状态下文字颜色 */
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

/* 调整表格的宽度，确保它足够大 */
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
  max-width: 1200px; /* 最大宽度限制 */
}

.el-col:nth-child(1) {
  flex: 0 0 20%; /* 固定左侧导航栏宽度 */
}

.el-col:nth-child(2) {
  flex: 1; /* 使右侧表格占满剩余空间 */
  max-width: 80%; /* 限制表格的最大宽度 */
}
</style>