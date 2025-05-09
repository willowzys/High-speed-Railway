<template>
  <div class="tree-container">
   
    <div ref="chartRef" style="width: 100%; height: 600px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import relationshipData from '../../data/relationship.json'
import { seriesColors } from '../utils/colorConfig'
import { useEventBus } from '../utils/eventBus'

export default {
  name: 'Traintree',
  data() {
    return {
      chart: null,
      selectedSeries: '',
      hoveredModel: null
    }
  },
  mounted() {
    this.initChart()
    window.addEventListener('resize', this.handleResize)
    
    // 监听事件总线
    const { on, off } = useEventBus()
    
    // 监听系列选择事件
    this.unsubscribeSeries = on('select-train-series', (series) => {
      this.selectedSeries = series
      this.hoveredModel = null
      this.updateChart()
    })
    
    // 监听鼠标悬停事件
    this.unsubscribeHover = on('hover-train-model', (data) => {
      this.hoveredModel = data?.model || null
      this.updateChart()
    })
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
    this.chart?.dispose()
    
    // 取消事件订阅
    if (this.unsubscribeSeries) this.unsubscribeSeries()
    if (this.unsubscribeHover) this.unsubscribeHover()
  },
  methods: {
    handleResize() {
      if (this.chart) {
        this.chart.resize()
      }
    },
    initChart() {
      if (this.chart) {
        this.chart.dispose()
      }
      
      this.chart = echarts.init(this.$refs.chartRef)
      this.updateChart()
    },
    
    updateChart() {
      if (!this.chart) return
      
      // 处理数据
      const processedData = this.processData(relationshipData)
      
      // 配置选项
      const option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: [
          {
            type: 'tree',
            data: [processedData],
            layout: 'radial',
            symbolSize: 10,
            initialTreeDepth: -1,
            label: {
              position: 'right',
              verticalAlign: 'middle',
              align: 'left',
              fontSize: 12
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
            roam: true
          }
        ]
      }
      
      this.chart.setOption(option)
      
      // 添加点击事件
      this.chart.off('click')
      this.chart.on('click', (params) => {
        if (params.data && params.data.name) {
          // 通过事件总线发送点击的车型信息
          const { emit } = useEventBus()
          emit('select-train-model', params.data.name)
          console.log('Traintree: 点击事件触发', params.data.name)
        }
      })
    },
    processData(data) {
      // 深拷贝数据
      const clonedData = JSON.parse(JSON.stringify(data))
      
      // 递归处理节点
      const processNode = (node) => {
        // 获取节点系列
        let nodeSeries = null
        if (node.name) {
          if (node.name.includes('CRH1') || node.name.startsWith('CRH1')) {
            nodeSeries = 'CRH1系'
          } else if (node.name.includes('CRH2') || node.name.startsWith('CRH2')) {
            nodeSeries = 'CRH2系'
          }else if (node.name.includes('CRH380') || node.name.startsWith('CRH380')) {
            nodeSeries = 'CRH380系'
          }  else if (node.name.includes('CRH3') || node.name.startsWith('CRH3')) {
            nodeSeries = 'CRH3系'
          } else if (node.name.includes('CRH5') || node.name.startsWith('CRH5')) {
            nodeSeries = 'CRH5系'
          } else if (node.name.includes('CRH6') || node.name.startsWith('CRH6')) {
            nodeSeries = 'CRH6系'
          } else if (node.name.includes('CR300') || node.name.startsWith('CR300')) {
            nodeSeries = 'CR300系'
          } else if (node.name.includes('CR400') || node.name.startsWith('CR400')) {
            nodeSeries = 'CR400系'
          } else if (node.name.includes('CR450') || node.name.startsWith('CR450')) {
            nodeSeries = 'CR450系'
          }
        }
        
        // 检查节点是否属于选中的系列
        const matchesFilter = !this.selectedSeries || nodeSeries === this.selectedSeries
        
        // 检查是否是当前悬停的车型
        const isHovered = this.hoveredModel === node.name
        
        // 获取节点颜色
        const color = nodeSeries ? seriesColors[nodeSeries] : '#ccc'
        
        // 设置节点样式
        node.itemStyle = {
          color: matchesFilter ? color : '#ddd',
          opacity: matchesFilter ? (isHovered ? 1 : 0.8) : 0.6
        }
        
        // 是否为叶子节点
        const isLeaf = !node.children || node.children.length === 0
        
        // 图片路径
        const imageName = node.name?.replace(/\//g, '-') // 防止特殊字符影响路径
        const imagePath = `images/trains/${imageName}.png`
        
        if (isLeaf) {
          // 只有当前悬停的车型才显示图片，其他节点都显示为圆形
          if (isHovered) {
            node.symbol = `image://${imagePath}`
            node.symbolSize = 50  // 悬停时的图片尺寸略大
          } else {
            node.symbol = 'circle'
            node.symbolSize = matchesFilter ? 15 : 10
          }
          
          // 设置标签
          node.label = {
            show: true,
            position: 'right',
            formatter: node.name,
            fontSize: 12,
            color: matchesFilter ? '#333' : '#999'
          }
        } else {
          node.symbol = 'circle'
          node.symbolSize = matchesFilter ? 15 : 10
        }
        
        // 递归处理子节点
        if (node.children && node.children.length > 0) {
          node.children.forEach(child => processNode(child))
        }
        
        return node
      }
      
      return processNode(clonedData)
    }
  }
}
</script>

<style scoped>
.tree-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.tree-controls {
  padding: 16px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eee;
}

/* 美化提示信息 */
:deep(.el-alert) {
  margin-bottom: 0;
}

:deep(.el-alert__title) {
  font-size: 14px;
}
</style>
