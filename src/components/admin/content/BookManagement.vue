<template>
  <div>
    <el-row style="margin: 18px 0px 0px 18px ">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">管理中心</el-breadcrumb-item>
        <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        <el-breadcrumb-item>作业管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <edit-form @onSubmit="fetchHomework()" ref="edit"></edit-form>
    <el-card style="margin: 18px 2%;width: 95%">
      <el-table :data="homeworkList" stripe style="width: 100%" :max-height="tableHeight">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline>
              <el-form-item>
                <span>{{ props.row.abs }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="作业名" width="500">
        </el-table-column>
        <el-table-column prop="category" label="分类" width="500">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click.native.prevent="deleteHomework(scope.row.name)" type="text" size="small">
              移除
            </el-button>
            <template v-if="scope.row.category === '客观题' || scope.row.category === '半开放'">
              <el-button @click.native.prevent="triggerFileUpload(scope.row)" type="text" size="small">
                上传模版
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin: 20px 0 20px 0;float: left">
        <el-button>取消选择</el-button>
        <el-button>批量删除</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import EditForm from './EditForm'

export default {
  name: 'BookManagement',
  components: { EditForm },
  data() {
    return {
      homeworkList: [],
      uploadFile: null
    }
  },
  mounted() {
    this.fetchHomework()
  },
  computed: {
    tableHeight() {
      return window.innerHeight - 320
    }
  },
  methods: {
    fetchHomework() {
      this.$axios
        .get(`/homework`)
        .then((response) => {
          if (response.data && Array.isArray(response.data)) {
            this.homeworkList = response.data;
          }
        })
        .catch((error) => {
          console.error("获取作业列表失败:", error);
        });
    },
    deleteHomework(name) {
      this.$confirm('此操作将永久删除该书籍, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios
          .delete(`/homework/delete/${encodeURIComponent(name)}`)
          .then(resp => {
            if (resp && resp.data.code === 200) {
              this.fetchHomework();
              this.$message.success('删除成功～！');
            }
          })
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    triggerFileUpload(row) {
      // 创建一个隐藏的文件输入框
      const self = this;
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.doc,.docx,.pdf,.xlsx,.txt'; // 设置接受文件的类型
      input.style.display = 'none';  // 不显示文件输入框

      // 使用 bind 明确绑定 `this`，确保可以访问 Vue 组件的方法
      input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
          // 检查文件类型
          const validTypes = ['.doc', '.docx', '.pdf', '.xlsx', '.txt'];
          const fileType = file.name.split('.').pop().toLowerCase();
          if (!validTypes.includes(`.${fileType}`)) {
            self.$message.error('无效的文件类型，支持的格式有：.doc, .docx, .pdf, .xlsx, .txt');
            return;
          }

          // 上传文件
          const formData = new FormData();
          formData.append('file', file);
          formData.append('homeworkName', row.name);
          var category = row.category;
          var path;
          if (category === "客观题") {
            path = "/upload/template/objective";
          } else {
            path = "/upload/template/subjective";
          }
          console.log(path);

          self.$flaskAxios
            .post(path, formData)
            .then(response => {
              console.log(response);
              if (response.status === 200) {
                self.$message.success('上传成功');
              } else {
                self.$message.error('上传失败');
              }
            })
            .catch(error => {
              self.$message.error('上传失败');
              console.error(error);
            });
        }
      };

      // 触发文件选择框
      document.body.appendChild(input);  // 添加到页面中，避免无法点击
      input.click();  // 触发点击事件
      document.body.removeChild(input); // 上传完成后移除该元素
    }
  }
}
</script>

<style scoped></style>