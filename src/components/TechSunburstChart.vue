<template>
    <div ref="chartRef" class="chart-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import relationshipData from '../../data/relationship.json'

const chartRef = ref(null)
let chart = null

const colorPalette = [
    '#5470C6', '#91CC75', '#EE6666', '#73C0DE', '#FAC858', '#3BA272',
    '#FC8452', '#9A60B4', '#EA7CCC'
]

// 为顶层技术来源节点分配颜色
const assignColorsByTopLevel = (data) => {
    let index = 0
    const colorMap = new Map()

    const assign = (node, depth = 0, inheritedColor = null) => {
        const color = depth === 1
            ? colorPalette[index++ % colorPalette.length]
            : inheritedColor

        node.itemStyle = { color }

        if (node.children) {
            node.children.forEach(child => assign(child, depth + 1, color))
        }

        return node
    }

    return assign(data)
}

const calculateNodeValue = (node) => {
    if (!node.children || node.children.length === 0) return 1
    return node.children.reduce((sum, child) => sum + calculateNodeValue(child), 0)
}

const prepareSunburstData = (data) => {
    const processNode = (node, depth = 0) => {
        const value = calculateNodeValue(node)
        const result = {
            name: node.name,
            value,
            depth,
            _tech_source: node.tech_source,
            _type: node.type
        }

        if (node.children?.length > 0) {
            result.children = node.children.map(child => processNode(child, depth + 1))
        }

        return result
    }

    const root = processNode(data)
    root.value = root.children?.reduce((sum, c) => sum + c.value, 0) || 1
    return assignColorsByTopLevel(root)
}

const initChart = () => {
    if (!chartRef.value) return
    chart = echarts.init(chartRef.value)

    const sunburstData = prepareSunburstData(relationshipData)

    const option = {
        tooltip: {
            trigger: 'item',
            formatter: (params) => {
                const d = params.data
                let text = `<strong>${d.name}</strong>`
                if (d._tech_source) text += `<br/>技术来源: ${d._tech_source}`
                if (d._type) text += `<br/>类型: ${d._type}`
                return text
            }
        },
        series: [{
            type: 'sunburst',
            radius: ['10%', '95%'],
            center: ['50%', '50%'],
            data: sunburstData.children,

            // 让颜色继承父节点
            colorMappingBy: 'ancestor',

            // 每一层的样式定义，提升视觉层级感
            levels: [
                {}, // Level 0 (root)
                {
                    r0: '10%', r: '35%',
                    itemStyle: {
                        borderWidth: 2,
                        borderColor: '#fff',
                        opacity: 0.9
                    },
                    label: {
                        rotate: 0,
                        fontSize: 12,
                        color: '#fff'
                    }
                },
                {
                    r0: '35%', r: '65%',
                    itemStyle: {
                        borderWidth: 2,
                        borderColor: '#eee',
                        opacity: 0.85
                    },
                    label: {
                        rotate: 'radial',
                        fontSize: 11,
                        overflow: 'truncate'
                    }
                },
                {
                    r0: '65%', r: '95%',
                    itemStyle: {
                        borderWidth: 1,
                        borderColor: '#ddd',
                        opacity: 0.8,
                        borderRadius: 4
                    },
                    label: {
                        position: 'outside',
                        fontSize: 10,
                        overflow: 'truncate',
                        color: '#444'
                    },
                    labelLayout: {
                        hideOverlap: true
                    }
                }
            ],

            label: {
                show: true,
                minAngle: 5,
                fontWeight: 'normal'
            },

            nodeClick: 'zoomToNode',

            emphasis: {
                focus: 'ancestor',
                itemStyle: {
                    borderWidth: 3,
                    borderColor: '#000',
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.3)'
                },
                label: {
                    fontWeight: 'bold',
                    color: '#000'
                }
            }
        }]
    }

    chart.setOption(option)
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
    height: 80vh;
    min-height: 500px;
}
</style>
