<template>
  <div class="tech-tree">
    <!--    -->
    <el-card>
      <template #header>
        <div class="card-header">
          <span>中国高铁技术谱系关系图</span>
        </div>
      </template>
      <div ref="treeChartRef" style="height: 1000px"></div>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span>高铁技术关联网络图</span>
        </div>
      </template>
      <TechForceGraph />
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span>高铁技术谱系旭日图</span>
        </div>
      </template>
      <TechSunburstChart />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import relationshipData from '../../data/relationship.json'
import TechForceGraph from '../components/TechForceGraph.vue'

import TechSunburstChart from '../components/TechSunburstChart.vue'

const treeChartRef = ref(null)

onMounted(() => {
  const treeChart = echarts.init(treeChartRef.value)
  
  // 定义不同技术来源的颜色
  const techColors = {
    '庞巴迪系': '#1890ff',
    '新干线系': '#52c41a',
    '西门子系': '#722ed1',
    '阿尔斯通系': '#fa8c16',
    '自主创新系': '#f5222d'
  }

  const option = {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
      formatter: (params) => {
        let text = `<strong>${params.data.name}</strong>`
        if (params.data.tech_source) {
          text += `<br/>技术来源: ${params.data.tech_source}`
        }
        if (params.data.type) {
          text += `<br/>类型: ${params.data.type}`
        }
        return text
      }
    },
    series: [
      {
        type: 'tree',
        data: [relationshipData],
        layout: 'radial',
        orient: 'LR',
        initialTreeDepth: 2,
        symbolSize: 12,
        itemStyle: {
          color: (params) => {
            // 根据技术来源设置节点颜色
            const rootName = params.data.name
            for (const tech in techColors) {
              if (rootName === tech || params.data.tech_source?.includes(tech)) {
                return techColors[tech]
              }
            }
            return '#666'
          }
        },
        lineStyle: {
          color: '#ccc',
          width: 1.5,
          curveness: 0.5
        },
        label: {
          show: true,
          position: 'right',
          distance: 5,
          fontSize: 13,
          color: '#333',
          formatter: (params) => {
            let text = params.data.name
            if (params.data.type) {
              text += '\n' + params.data.type
            }
            return text
          },
          overflow: 'truncate',
          width: 120
        },
        labelLayout: {
          hideOverlap: true
        },
        emphasis: {
          focus: 'descendant',
          scale: true
        },
        expandAndCollapse: true,
        animationDuration: 550,
        animationDurationUpdate: 750,
        roam: true,
        nodeGap: 30,
        radius: '60%'
      }
    ]
  }

  treeChart.setOption(option)

  // 响应式调整图表大小
  window.addEventListener('resize', () => {
    treeChart.resize()
  })
})
</script>


<style scoped>
.tech-tree {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tech-tree {
  padding: 20px;
  background: #f0f2f5;
  min-height: 100vh;
}

.card-header {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  padding: 6px 0;
}

.chart-box {
  width: 100%;
  height: 900px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
</style>