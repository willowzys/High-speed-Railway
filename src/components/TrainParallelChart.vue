<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import trainModelsData from '../../data/high_speed_train_models_cleaned.json'

const chartRef = ref(null)
let chart = null

// 数据处理函数：清洗和转换数据
const processData = (data) => {
  return data.map(train => {
    // 提取速度数值
    const speed = parseInt(train.max_speed)
    
    // 提取编组数值并处理特殊情况
    const carConfig = train.car_config
    const carCount = parseInt(carConfig.match(/\d+/)?.[0] || '8')
    
    // 根据型号确定系列
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
      value: [speed, train.service_year, carCount],
      series,
      ...train
    }
  })
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value)
  const processedData = processData(trainModelsData)
  
  // 获取所有系列
  const allSeries = [...new Set(processedData.map(item => item.series))]
  
  const option = {
    backgroundColor: '#fff',
    legend: {
      data: allSeries,
      top: 0,
      right: 20,
      orient: 'vertical'
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const train = params.data
        return `
          <strong>${train.model}</strong><br/>
          昵称：${train.nickname}<br/>
          最高时速：${train.max_speed}km/h<br/>
          服役年份：${train.service_year}年<br/>
          编组：${train.car_config}
        `
      }
    },
    parallelAxis: [
      {
        dim: 0,
        name: '最高运营时速(km/h)',
        min: 160,
        max: 400,
        nameLocation: 'end'
      },
      {
        dim: 1,
        name: '服役年份',
        type: 'value',
        min: 2000,
        max: 2025,
        nameLocation: 'end'
      },
      {
        dim: 2,
        name: '列车编组',
        type: 'value',
        min: 4,
        max: 16,
        nameLocation: 'end'
      }
    ],
    parallel: {
      left: '5%',
      right: '13%',
      bottom: '10%',
      top: '20%',
      parallelAxisDefault: {
        type: 'value',
        nameLocation: 'end',
        nameGap: 20
      }
    },
    series: allSeries.map(seriesName => ({
      name: seriesName,
      type: 'parallel',
      lineStyle: {
        opacity: 0.5
      },
      emphasis: {
        lineStyle: {
          opacity: 1,
          width: 2
        }
      },
      data: processedData.filter(item => item.series === seriesName)
    }))
  }

  chart.setOption(option)
  
  // 添加brush组件用于框选
  chart.setOption({
    brush: {
      toolbox: ['rect', 'polygon', 'keep', 'clear'],
      xAxisIndex: 'all'
    }
  })
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', () => chart?.resize())
})

onUnmounted(() => {
  chart?.dispose()
  window.removeEventListener('resize', () => chart?.resize())
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 600px;
}
</style>