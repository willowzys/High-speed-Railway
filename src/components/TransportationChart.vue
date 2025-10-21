<template>
  <div class="transportation-chart-container">
    <!-- <h2>中国主要交通方式数据可视化 (2019-2024)</h2> -->
    <div ref="chartRef" class="chart-main"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import * as echarts from 'echarts/core';
import {
  BarChart,
  LineChart
} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent,
  MarkLineComponent // 需要引入 MarkLine 用于显示平均时速
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { UniversalTransition } from 'echarts/features';

// 注册必须的 ECharts 组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent,
  MarkLineComponent, // 注册 MarkLine
  BarChart,
  LineChart,
  CanvasRenderer,
  UniversalTransition
]);

// --- 输入数据 ---
// 在实际应用中，这应该是一个 prop
const inputData = ref({
  "data": {
    "categories": ["2019", "2020", "2021", "2022", "2023", "2024"],
    "series": [
      {
        "name": "客运量（亿人次）",
        "type": "bar",
        "data": {
          "高铁": [23.6, 21.7, 24.8, 27.2, 37.6, 40.8],
          "航空": [6.6, 4.2, 4.8, 5.5, 6.2, 7.3],
          "公路": [130.1, 96.7, 77.3,35.5 , 110.1, 117.8]
        }
      },
      {
        "name": "平均时速（km/h）",
        "type": "line", // 虽然类型是 line，但数据是固定的，用 MarkLine 更合适
        "data": {
          "高铁": [350],
          "航空": [900],
          "公路": [80]
        }
      },
      {
        "name": "平均票价（元/人公里）", // 修正单位，数据看起来更像每公里单价
        "type": "line",
        "data": {
          "高铁": [0.50, 0.50, 0.52, 0.55, 0.58, 0.60],
          "航空": [0.87, 0.75, 0.80, 0.85, 0.90, 0.82],
          "公路": [0.30, 0.30, 0.32, 0.35, 0.38, 0.40]
        }
      }
    ],

  }
});

// --- 组件逻辑 ---
const chartRef = ref(null); // DOM 引用
let chartInstance = null;

// 将原始数据转换为 ECharts 需要的格式
const chartData = computed(() => inputData.value.data);

const processedSeries = computed(() => {
  const series = [];
  const categories = chartData.value.categories;

  chartData.value.series.forEach((s, index) => {
    const yAxisIndex = getYAxisIndex(s.name);

    if (s.name === "平均时速（km/h）") {
      // 为时速数据创建独立的 MarkLine Carrier 系列
      Object.entries(s.data).forEach(([subName, subData]) => {
        series.push({
          name: `${subName} ${s.name} (MarkLine Carrier)`,
          type: 'line',
          data: new Array(categories.length).fill(null), // 空数据
          yAxisIndex: yAxisIndex, // 使用时速 Y 轴
          silent: true, // 不响应鼠标事件
          showSymbol: false,
          lineStyle: { width: 0 },
          markLine: {
            symbol: ['none', 'none'],
            precision: 0,
            lineStyle: { type: 'dashed', width: 1.5 },
            label: {
              position: 'insideEndTop',
              formatter: `{b}: {c} km/h`
            },
            data: [
              {
                name: `${subName} ${s.name}`,
                yAxis: subData[0] // 使用固定值
              }
            ]
          }
        });
      });
      return; // 跳过其他处理
    }

    // 处理普通 series（客运量、平均票价）
    Object.entries(s.data).forEach(([subName, subData]) => {
      const seriesName = `${s.name} - ${subName}`;
      const baseSeries = {
        name: seriesName,
        type: s.type,
        data: subData,
        yAxisIndex: yAxisIndex,
        emphasis: { focus: 'series' },
        smooth: s.type === 'line' ? true : false,
      };

      if (s.type === 'bar') {
        baseSeries.stack = s.name;
      }

      series.push(baseSeries);
    });
  });
  // 调整 MarkLine 数据，使其使用正确的Y轴（时速轴）
  // 由于 MarkLine 默认跟随其附加的 series 的 Y 轴，我们需要找到一种方法让它指向时速轴。
  // 最可靠的方法是创建一个专门用于时速的、数据为空的线图 series，并将 MarkLine 附加到它上面。

  // 1. 找到时速数据
  const speedSeriesData = chartData.value.series.find(s => s.name === "平均时速（km/h）");
  const speedYAxisIndex = getYAxisIndex("平均时速（km/h）");

  if (speedSeriesData) {
      // 2. 创建一个（或多个）专门承载 MarkLine 的 series
      Object.entries(speedSeriesData.data).forEach(([subName, subData]) => {
        series.push({
          name: `${subName} ${speedSeriesData.name} (MarkLine Carrier)`, // 内部名称
          type: 'line',
          data: new Array(categories.length).fill(null), // 空数据
          yAxisIndex: speedYAxisIndex, // 指向时速 Y 轴
          silent: true, // 不响应鼠标事件
          showSymbol: false, // 不显示点
          lineStyle: { width: 0 }, // 线不可见
          markLine: {
            symbol: ['none', 'none'],
            precision: 0, // 整数显示
            lineStyle: { type: 'dashed', width: 1.5 },
            label: { position: 'insideEndTop', formatter: `{b}: {c} km/h` },
            data: [
              {
                name: `${subName} ${speedSeriesData.name}`,
                yAxis: subData[0] // 固定值
              }
            ]
          }
        });
      });
  }


  return series;
});
function getYAxisIndex(seriesName) {
  if (seriesName.includes('客运量')) {
    return 0;
  } else if (seriesName.includes('平均票价')) {
    return 1;
  } else if (seriesName.includes('平均时速')) {
    return 2;
  }
  return 0; // 默认
}

const chartOptions = computed(() => ({
  title: {
    // text: '中国主要交通方式数据可视化',
    // subtext: '2019-2024',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis', // 坐标轴触发，显示该点所有系列数据
    axisPointer: {
      type: 'cross', // 十字准星指示器
      crossStyle: {
        color: '#999'
      }
    },
    // 自定义 tooltip 内容，更清晰地展示
    formatter: (params) => {
      let tooltipHtml = `${params[0].axisValueLabel}<br/>`; // 显示年份
      params.sort((a, b) => (a.seriesIndex - b.seriesIndex)); // 按 series 顺序显示
      params.forEach(item => {
        // 检查是否是 MarkLine Carrier series，如果是则跳过主 tooltip 显示
        if (item.seriesName.includes('(MarkLine Carrier)')) {
            return;
        }
        // 处理 MarkLine 数据 (虽然我们把它放到了 carrier series，但tooltip可能仍会捕获到)
        if (item.componentType === 'markLine') {
           // MarkLine 应该有自己的 label，这里可以不显示或特殊处理
           // tooltipHtml += `${item.marker} ${item.name}: ${item.value} km/h<br/>`;
           return; // Markline 有自己的标签，这里忽略
        }
        // 处理普通 series 数据
        if (item.value !== undefined && item.value !== null) {
          let unit = '';
          if (item.seriesName.includes('客运量')) unit = ' 亿人次';
          else if (item.seriesName.includes('平均票价')) unit = ' 元/人公里';
          // 时速已由 MarkLine 显示
          tooltipHtml += `${item.marker} ${item.seriesName}: ${item.value}${unit}<br/>`;
        }
      });
      return tooltipHtml;
    }
  },
  toolbox: { // 工具箱
    feature: {
      dataView: { show: true, readOnly: false, title: '数据视图' }, // 查看原始数据
      magicType: { show: true, type: ['line', 'bar', 'stack'], title: { line: '切换为折线图', bar: '切换为柱状图', stack: '切换为堆叠' } }, // 切换图表类型
      restore: { show: true, title: '还原' }, // 还原
      saveAsImage: { show: true, title: '保存为图片' } // 保存图片
    }
  },
  legend: {
    data: processedSeries.value.map(s => s.name).filter(name => !name.includes('(MarkLine Carrier)')), // 从 series 获取图例名称, 过滤掉内部载体
    top: 'bottom', // 图例放底部
    type: 'scroll', // 图例过多时可以滚动
  },
  grid: { // 调整网格边距，防止标签被遮挡
    left: '3%',
    right: '10%', // 为右侧 Y 轴留出更多空间
    bottom: '10%', // 为图例留出空间
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: chartData.value.categories,
      axisPointer: {
        type: 'shadow' // 坐标轴指示器类型
      }
    }
  ],
  yAxis: [ // 定义三个 Y 轴
    {
      type: 'value',
      name: '客运量 (亿人次)',
      position: 'left',
      axisLine: {
        show: true,
        lineStyle: { color: '#5470C6' } // 轴线颜色
      },
      axisLabel: { formatter: '{value}' }
    },
    {
      type: 'value',
      name: '平均票价 (元/人公里)',
      position: 'right',
      offset: 0, // 右侧第一个 Y 轴，无偏移
      axisLine: {
        show: true,
        lineStyle: { color: '#91CC75' }
      },
      axisLabel: { formatter: '{value}' }
    },
    {
    type: 'value',
    name: '平均时速 (km/h)',
    position: 'right',
    offset: 100,
    axisLine: {
      show: true,
      lineStyle: { color: '#EE6666' }
    },
    axisLabel: { formatter: '{value}' },
    min: 0, // 确保从 0 开始
    max: 1000 // 覆盖航空的 900 km/h
  }
  ],
  dataZoom: [ // 添加缩放/漫游组件
    {
      type: 'slider', // 底部滑动条
      show: false,
      xAxisIndex: [0],
      start: 0,
      end: 100
    },
    {
      type: 'inside', // 内部鼠标滚轮缩放
      xAxisIndex: [0],
      start: 0,
      end: 100
    }
  ],
  series: processedSeries.value // 使用计算属性生成的 series
}));

// 初始化图表
const initChart = () => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value);
    chartInstance.setOption(chartOptions.value);
  }
};

// 调整图表大小
const resizeChart = () => {
  chartInstance?.resize();
};

// --- 生命周期钩子 ---
onMounted(() => {
  initChart();
  window.addEventListener('resize', resizeChart);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart);
  chartInstance?.dispose(); 
});


watch(chartOptions, (newOptions) => {
  chartInstance?.setOption(newOptions);
});
</script>

<style scoped>
.transportation-chart-container {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 25px;
  color: #333;
}

.chart-main {
  width: 100%;
  height: 670px; 
  background-color: #fff;
  border-radius: 4px;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
}

.annotations {
  margin-top: 20px;
  padding: 15px;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
  font-size: 0.9em;
  color: #555;
}

.annotations h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
}

.annotations ul {
  list-style-type: none;
  padding-left: 0;
  margin-bottom: 0;
}

.annotations li {
  margin-bottom: 8px;
  line-height: 1.6;
}

.annotations strong {
  color: #000;
  margin-right: 5px;
}
</style>
