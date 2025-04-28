<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import trainModelsData from '../../data/high_speed_train_models_cleaned.json'

const chartRef = ref(null)
let chart = null

const processData = (data) => {
  return data.map(train => {
    const speed = parseInt(train.max_speed)
    const carConfig = train.car_config
    const carCount = parseInt(carConfig.match(/\d+/)?.[0] || '8')
    let series = '其他'

    if (train.model.startsWith('CRH1')) series = 'CRH1系'
    else if (train.model.startsWith('CRH2')) series = 'CRH2系'
    else if (train.model.startsWith('CRH3')) series = 'CRH3系'
    else if (train.model.startsWith('CRH5')) series = 'CRH5系'
    else if (train.model.startsWith('CRH6')) series = 'CRH6系'
    else if (train.model.startsWith('CR300')) series = 'CR300系'
    else if (train.model.startsWith('CR400')) series = 'CR400系'
    else if (train.model.startsWith('CR450')) series = 'CR450系'
    return {
      value: [train.service_year, speed, carCount],
      series,
      ...train
    }
  })
}

const initChart = () => {
  if (!chartRef.value) return

  chart = echarts.init(chartRef.value)

  const processedData = processData(trainModelsData)
  const allSeries = [...new Set(processedData.map(item => item.series))]

  const colorMap = {
    'CRH1系': '#5470C6',
    'CRH2系': '#91CC75',
    'CRH3系': '#FAC858',
    'CRH5系': '#EE6666',
    'CRH6系': '#73C0DE',
    'CR300系': '#3BA272',
    'CR400系': '#FC8452',
    'CR450系': '#9A60B4'
  }

  const series = allSeries.map(seriesName => ({
    name: seriesName,
    type: 'scatter',
    data: processedData.filter(item => item.series === seriesName),
    symbolSize: function (data) {
      return Math.sqrt(data[2]) * 8
    },
    itemStyle: {
      color: colorMap[seriesName] || '#ccc',
      opacity: 0.8,
      borderColor: '#fff',
      borderWidth: 1,
      shadowBlur: 10,
      shadowColor: 'rgba(0, 0, 0, 0.2)'
    },
    emphasis: {
      focus: 'series',
      itemStyle: {
        borderColor: '#000',
        borderWidth: 2,
        shadowBlur: 20,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      },
      label: {
        show: true,
        formatter: param => param.data.model,
        fontWeight: 'bold',
        fontSize: 12,
        color: '#333'
      }
    }
  }))

  const option = {
    backgroundColor: '#fdfdfd',
    title: {
      text: '中国高铁车型发展概览：速度 × 时间 × 编组',
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: '#fff',
      borderColor: '#ccc',
      borderWidth: 1,
      textStyle: {
        color: '#333'
      },
      formatter: (param) => {
        const d = param.data
        return `
          <strong>${d.model}</strong><br/>
          昵称：${d.nickname}<br/>
          最高时速：${d.max_speed} km/h<br/>
          编组：${d.car_config}<br/>
          服役年份：${d.service_year}<br/>
          主要线路：${d.main_lines}
        `
      }
    },
    legend: {
      data: allSeries,
      type: 'scroll',
      top: 50,
      textStyle: {
        fontSize: 12
      },
      selector: true
    },
    grid: {
      top: 100,
      left: 50,
      right: 30,
      bottom: 40,
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: '服役年份',
      nameLocation: 'middle',
      nameGap: 30,
      min: 2005,
      max: 2025,
      axisLine: { lineStyle: { color: '#888' } },
      axisLabel: { fontSize: 12 },
      splitLine: {
        lineStyle: { type: 'dashed', color: '#ddd' }
      }
    },
    yAxis: {
      type: 'value',
      name: '最高运营时速 (km/h)',
      nameLocation: 'middle',
      nameGap: 40,
      min: 200,
      max: 400,
      axisLine: { lineStyle: { color: '#888' } },
      axisLabel: { fontSize: 12 },
      splitLine: {
        lineStyle: { type: 'dashed', color: '#ddd' }
      }
    },
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'empty'
      },
      {
        type: 'inside',
        yAxisIndex: 0,
        filterMode: 'empty'
      }
    ],
    series,
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicOut'
  }

  chart.setOption(option)
}

const handleResize = () => {
  chart?.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 600px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 8px;
}
</style>
