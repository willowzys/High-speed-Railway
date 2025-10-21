<template>
  <div class="chart-container">
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { railData } from 'assets/mailage';

export default {
  name: 'RailChart',
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      const chart = echarts.init(this.$refs.chart);

      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: '{b}年<br/>里程：{c} 公里',
          textStyle: {
            color: '#000', // 提示框文字颜色
          },
        },
        
        //坐标
        grid: {
          left: '2%', 
          right: '5%', 
          top: '8%', 
          bottom: '3%', 
          containLabel: true, // 确保标签不被裁剪
        },

        xAxis: {
          type: 'category',
          name: '年份',
          data: railData.years,
          axisLine: {
            lineStyle: {
              color: '#fff', // 白色轴线以对比背景
            },
          },
          axisLabel: {
            interval: 1,
            color: '#fff', // 白色标签
          },
        },

        yAxis: {
          type: 'value',
          name: '里程 (公里)',
          nameTextStyle: {
            color: '#fff',
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#fff',
            },
          },
          axisLabel: {
            color: '#fff',
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: 'rgba(255, 255, 255, 0.3)', // 半透明网格线
            },
          },
        },
        series: [
          {
            name: '高铁里程',
            type: 'line',
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: {
              width: 4,
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#5470c6' },
                { offset: 1, color: '#91cc75' },
              ]),
            },
            itemStyle: {
              color: '#ee6666',
              borderColor: '#fff',
              borderWidth: 2,
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(84, 112, 198, 0.5)' },
                { offset: 1, color: 'rgba(84, 112, 198, 0.1)' },
              ]),
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            data: railData.mileage,
          },
        ],
        animationDuration: 6000,
      };

      chart.setOption(option);

      // 响应式调整
      window.addEventListener('resize', chart.resize);
    },
  },
};
</script>

<style scoped>
.chart-container {
  width: calc(100% - 10px); /* 5px 左右 */
  height: 680px; /* 固定高度 */
  margin: 5px;
  box-sizing: border-box;
  background-image: url('../assets/first_image.png'); /* 背景图片路径 */
  background-size: cover; /* 覆盖整个容器 */
  background-position: center; /* 居中 */
  background-repeat: no-repeat; /* 不重复 */
  position: relative; /* 为子元素提供定位上下文 */
}

.chart {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background: transparent; /* 移除白色背景，突出背景图 */
}
</style>
