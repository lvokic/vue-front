<template>
  <el-container>
    <el-header>
      <h2>作业成绩查询</h2>
    </el-header>
    <el-main>
      <el-table :data="grades" style="width: 100%" v-if="grades.length > 0">
        <el-table-column prop="homeworkName" label="作业名称"></el-table-column>
        <el-table-column prop="score" label="得分" width="100"></el-table-column>
        <el-table-column prop="category" label="类型"></el-table-column>
        <el-table-column prop="completed" label="是否完成" width="120">
          <template slot-scope="scope">
            <el-tag :type="scope.row.completed ? 'success' : 'danger'">{{ scope.row.completed ? '已完成' : '未完成' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="评价">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.description" placement="top">
              <span>{{ scope.row.description }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-alert v-else type="warning" title="没有找到成绩记录" show-icon></el-alert>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      studentId: '',  // 存储学生学号
      grades: [] // 存储成绩数据
    };
  },
  mounted() {
    // 在组件挂载后，从 Vuex 获取 studentId，并自动查询成绩
    this.studentId = this.$store.getters.getStudentId;
    console.log(this.studentId);

    if (this.studentId) {
      // 如果 studentId 存在，执行成绩查询
      this.fetchGrades();
    } else {
      console.error("学生学号未找到！");
    }
  },
  methods: {
    fetchGrades() {
      if (!this.studentId) {
        console.error("学号不能为空");
        return;
      }

      // 假设使用 axios 发送请求
      this.$axios
        .get(`/grades/${this.studentId}`)
        .then((response) => {
          // 判断返回的数据是否是有效的数组
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
    }
  }
};
</script>

<style scoped>
.el-button {
  margin-bottom: 20px;
}
</style>