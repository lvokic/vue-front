<template>
  <div>
    <el-row style="margin: 18px 0px 0px 18px ">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">管理中心</el-breadcrumb-item>
        <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        <el-breadcrumb-item>作业成绩统计</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <div style="margin: 18px 0 15px 18px;">
      <el-select v-model="selectedHomeworkName" placeholder="请选择作业" @change="handleHomeworkChange"
        style="width: 300px;">
        <el-option v-for="hw in homeworkList" :key="hw.name" :label="hw.name" :value="hw.name">
        </el-option>
      </el-select>
    </div>

    <el-card style="margin: 2px 2%; width: 95%">
      <div v-if="selectedHomeworkName">
        <div style="margin-bottom: 20px; font-size: 12px;">
          当前平均成绩：<strong>{{ averageScore.toFixed(2) }}</strong> 分
        </div>
        <div ref="scoreChart" class="chart-container"></div>
      </div>
      <div v-else>
        <p>请选择一个作业查看成绩分布。</p>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'HomeworkStatistics',
  data() {
    return {
      homeworkList: [],
      selectedHomeworkName: null,
      scoreList: [],
      averageScore: 0,
      chartInstance: null,
      distributionData: [
        { name: '低于60', value: 0 },
        { name: '60-70', value: 0 },
        { name: '70-80', value: 0 },
        { name: '80-90', value: 0 },
        { name: '90-100', value: 0 }
      ]
    }
  },
  mounted() {
    this.loadHomeworkList()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    if (this.chartInstance) {
      this.chartInstance.dispose()
    }
  },
  methods: {
    loadHomeworkList() {
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
    handleHomeworkChange() {
      this.$axios
        .get(`/grades/by-course-name/${this.selectedHomeworkName}`)
        .then(resp => {
          if (resp.data && Array.isArray(resp.data)) {
            this.scoreList = resp.data
            this.calculateAverage()
            this.calculateDistribution()
            this.initChart()
            this.updateChart()
          }
        }).catch((error) => {
          console.error("查询成绩失败:", error);
        })
    },
    calculateAverage() {
      if (this.scoreList.length > 0) {
        const total = this.scoreList.reduce((sum, item) => sum + item.score, 0);
        this.averageScore = total / this.scoreList.length;
      } else {
        this.averageScore = 0;
      }
    },
    calculateDistribution() {
      // Reset distribution data
      this.distributionData = [
        { name: '低于60', value: 0 },
        { name: '60-70', value: 0 },
        { name: '70-80', value: 0 },
        { name: '80-90', value: 0 },
        { name: '90-100', value: 0 }
      ];

      // Classify scores into the defined ranges
      this.scoreList.forEach(item => {
        const score = item.score;
        if (score < 60) {
          this.distributionData[0].value++;
        } else if (score >= 60 && score < 70) {
          this.distributionData[1].value++;
        } else if (score >= 70 && score < 80) {
          this.distributionData[2].value++;
        } else if (score >= 80 && score < 90) {
          this.distributionData[3].value++;
        } else if (score >= 90 && score <= 100) {
          this.distributionData[4].value++;
        }
      });
    },
    initChart() {
      const chartDom = this.$refs.scoreChart;
      if (chartDom) {
        this.chartInstance = echarts.init(chartDom);
        this.chartInstance.on('click', this.handleChartClick); // Add click event listener
      }
    },
    updateChart() {
      if (!this.chartInstance) return;

      const option = {
        backgroundColor: '#2c343c',
        title: {
          text: '作业成绩分布',
          left: 'center',
          textStyle: {
            color: '#ccc'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            return `${params.name}: ${params.value} 人`;
          }
        },
        series: [
          {
            name: '成绩分布',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: this.distributionData,
            label: {
              color: 'rgba(255, 255, 255, 0.3)'
            },
            labelLine: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.3)'
              },
              smooth: 0.2,
              length: 10,
              length2: 20
            },
            itemStyle: {
              color: '#c23531',
              shadowBlur: 200,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
              return Math.random() * 200;
            }
          }
        ]
      };

      this.chartInstance.setOption(option);
    },
    handleChartClick(params) {
      // Handle the click event to display information about the clicked segment
      const { name, value } = params;
      alert(`${name} 区间有 ${value} 人`);
    },
    handleResize() {
      if (this.chartInstance) {
        this.chartInstance.resize()
      }
    }
  }
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100vh; /* Full viewport height */
}
</style>