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
        <el-table-column prop="name" label="作业名" fit>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="1000">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click.native.prevent="editBook(scope.row)" type="text" size="small">
              编辑
            </el-button>
            <el-button @click.native.prevent="deleteBook(scope.row.id)" type="text" size="small">
              移除
            </el-button>
            <el-button @click.native.prevent="uploadTemplate(scope.row)" type="text" size="small">
              上传模版
            </el-button>
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
import { ElMessageBox } from 'element-ui';

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
    deleteBook(id) {
      this.$confirm('此操作将永久删除该书籍, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios
          .post('/admin/content/books/delete', { id: id }).then(resp => {
            if (resp && resp.data.code === 200) {
              this.loadBooks()
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    editBook(item) {
      this.$refs.edit.dialogFormVisible = true
      this.$refs.edit.form = {
        id: item.id,
        cover: item.cover,
        title: item.title,
        author: item.author,
        date: item.date,
        press: item.press,
        abs: item.abs,
        category: {
          id: item.category.id.toString(),
          name: item.category.name
        }
      }
    },
    loadBooks() {
      var _this = this
      this.$axios.get('/books').then(resp => {
        if (resp && resp.data.code === 200) {
          _this.books = resp.data.result
        }
      })
    },
    uploadTemplate(row) {
      ElMessageBox.prompt('请选择模板文件进行上传', '上传模版', {
        confirmButtonText: '上传',
        cancelButtonText: '取消',
        inputType: 'file',
        inputPlaceholder: '选择文件'
      }).then(({ value }) => {
        if (value) {
          const formData = new FormData();
          formData.append('file', value);
          formData.append('homeworkId', row.id); // 把作业ID传给后台

          this.$axios.post('/upload-template', formData)
            .then(response => {
              if (response.data.code === 200) {
                this.$message.success('上传成功');
              } else {
                this.$message.error('上传失败');
              }
            })
            .catch(error => {
              this.$message.error('上传失败');
              console.error(error);
            });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消上传'
        });
      });
    }
  }
}
</script>

<style scoped></style>