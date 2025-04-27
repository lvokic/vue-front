<template>
  <div>
    <el-row style="margin: 18px 0px 0px 18px ">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">管理中心</el-breadcrumb-item>
        <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        <el-breadcrumb-item>成绩管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-card style="margin: 18px 2%;width: 95%">
      <el-table :data="grades" stripe style="width: 100%">
        <el-table-column prop="studentId" label="学生ID" width="240"></el-table-column>
        <el-table-column prop="homeworkName" label="作业名称" width="240"></el-table-column>
        <el-table-column prop="score" label="得分" width="240"></el-table-column>
        <el-table-column prop="category" label="类型" width="240"></el-table-column>
        <el-table-column prop="completed" label="是否完成" width="200">
          <template slot-scope="scope">
            <el-tag :type="scope.row.completed ? 'success' : 'danger'">{{ scope.row.completed ? '已完成' : '未完成' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="crossCheck" label="是否抄袭" width="120">
          <template slot-scope="scope">
            <el-tag :type="scope.row.crossCheck ? 'danger' : 'success'">{{ scope.row.crossCheck ? '抄袭' : '无抄袭' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editGrade(scope.row)">
              编辑
            </el-button>
            <el-button type="text" size="small">
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin: 20px 0 20px 0;float: left">
        <el-button>取消选择</el-button>
        <el-button>批量删除</el-button>
      </div>
    </el-card>

    <!-- 编辑弹窗 -->
    <el-dialog :visible.sync="dialogVisible" title="编辑成绩" width="30%">
      <el-form :model="currentGrade">
        <el-form-item label="学生ID">
          <el-input v-model="currentGrade.studentId" disabled></el-input>
        </el-form-item>
        <el-form-item label="作业名称">
          <el-input v-model="currentGrade.homeworkName"></el-input>
        </el-form-item>
        <el-form-item label="得分">
          <el-input v-model="currentGrade.score"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="currentGrade.category"></el-input>
        </el-form-item>
        <el-form-item label="是否完成">
          <el-switch v-model="currentGrade.completed" :active-text="'已完成'" :inactive-text="'未完成'"></el-switch>
        </el-form-item>
        <el-form-item label="是否抄袭">
          <el-switch v-model="currentGrade.crossCheck" :active-text="'无抄袭'" :inactive-text="'抄袭'"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveChanges">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'BannerManagement',
  data() {
    return {
      grades: [], // 存储成绩数据
      dialogVisible: false,  // 控制弹窗显示
      currentGrade: {}, // 当前正在编辑的成绩
    };
  },
  mounted() {
    this.fetchGrades();
  },
  methods: {
    fetchGrades() {
      this.$axios
        .get('/grades/all')
        .then((response) => {
          if (response.data && Array.isArray(response.data)) {
            this.grades = response.data;
          } else {
            console.error("未查询到成绩数据");
            this.grades = [];
          }
        })
        .catch((error) => {
          console.error("获取成绩数据失败:", error);
        });
    },
    editGrade(grade) {
      this.currentGrade = { ...grade }; // 拷贝当前行的数据
      this.dialogVisible = true; // 显示编辑对话框
    },
    saveChanges() {
      // 保存修改后的成绩
      this.$axios
        .put(`/grades/${this.currentGrade.studentId}`, this.currentGrade)
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            this.dialogVisible = false;
            this.fetchGrades(); // 刷新成绩列表
          } else {
            console.error("保存失败:", response.data.message);
          }
        })
        .catch((error) => {
          console.error("更新成绩失败:", error);
        });
    }
  }
};
</script>

<style scoped></style>