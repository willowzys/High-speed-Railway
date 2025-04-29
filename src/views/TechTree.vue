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

    <!--
    <el-card style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span>高铁技术关联网络图</span>
        </div>
      </template>
      <TechForceGraph />
    </el-card>
-->

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
  'Regina/Zefiro平台': '#5470C6',
  'Zefiro 380平台': '#91CC75',
  'E2-1000平台': '#EE6666',
  '自主升级版': '#FAC858',
  'Velaro平台': '#73C0DE',
  'Velaro+新干线技术融合': '#3BA272',
  'Pendolino平台': '#FC8452',
  '技术消化吸收': '#9A60B4',
  '动力集中式': '#EA7CCC',
  '城际专用平台': '#FF9F7F',
  '试验型超高速': '#BDB76B'
}
const processTreeColor = (node, inheritedTech = null) => {
  const techSource = node.tech_source || inheritedTech
  const color = techColors[techSource] || '#ccc'
  const imageName = node.name?.replace(/\//g, '-') // 防止特殊字符影响路径
  const imagePath = `images/trains/${imageName}.png`

  node.itemStyle = {
    color: color
  }

  // 是否为叶子节点（即具体车型）
  const isLeaf = !node.children || node.children.length === 0

  if (isLeaf) {
    node.symbol = `image://${imagePath}`
    node.symbolSize = 40

    // 保留 label 设置
    node.label = {
      show: true,
      position: 'right',
      formatter: node.name,
      fontSize: 12
    }
  } else {
    node.symbol = 'circle'
    node.symbolSize = 10
  }

  // 递归处理子节点
  if (node.children && node.children.length > 0) {
    node.children.forEach(child => processTreeColor(child, techSource))
  }

  return node
}



const coloredData = processTreeColor(relationshipData)

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
      data: [coloredData], // 注意是数组！
      layout: 'radial',
      symbolSize: 10,
      initialTreeDepth: -1,
      label: {
        position: 'right',
        verticalAlign: 'middle',
        align: 'left',
        fontSize: 12,
        color: '#000',
        formatter: (params) => {
          let text = params.data.name
          if (params.data.type) text += '\n' + params.data.type
          return text
        }
      },
      itemStyle: {
        borderColor: '#555',
        borderWidth: 1
      },
      lineStyle: {
        color: '#ccc',
        curveness: 0.5
      },
      emphasis: {
        focus: 'descendant'
      },
      expandAndCollapse: true,
      animationDuration: 550,
      animationDurationUpdate: 750,
      roam: true
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