<template>
    <!-- 图表容器（必须有宽度和高度） -->
    <div ref="chart" style="width: 600px; height: 400px;"></div>
  </template>
  
  <script>
  // 1. 导入 ECharts
  import * as echarts from 'echarts';
  
  export default {
    name: 'BarChart',
    mounted() {
      // 2. 组件挂载后初始化图表
      this.initChart();
    },
    methods: {
      initChart() {
        // 3. 获取DOM节点
        const chartDom = this.$refs.chart;
        
        // 4. 初始化图表实例
        const myChart = echarts.init(chartDom);
  
        // 5. 准备配置项
        const option = {
          title: {
            text: '我的第一个ECharts图表'
          },
          tooltip: {}, // 提示框
          xAxis: {
            data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
          },
          yAxis: {},
          series: [{
            name: '销量',
            type: 'bar', // 柱状图
            data: [15, 20, 36, 10, 10, 20]
          }]
        };
  
        // 6. 应用配置
        myChart.setOption(option);
  
        // 7. 响应式调整（窗口变化时重绘）
        window.addEventListener('resize', function() {
          myChart.resize();
        });
      }
    }
  }
  </script>
  
  <style scoped>
  /* 可以添加一些样式 */
  </style>