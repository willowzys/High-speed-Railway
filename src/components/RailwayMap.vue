<template>
  <div class="railway-map-container chart">
    <div class="control-panel">
      <div class="controls">
        <div class="city-selector">
          <label for="city-select">选择出发城市：</label>
          <select id="city-select" v-model="selectedCity" @change="handleCitySelect">
            <option value="">请选择城市</option>
            <option v-for="city in cityOptions" :key="city" :value="city">{{ city }}</option>
          </select>
          <button class="reset-btn" @click="resetView">重置地图</button>
        </div>
        
        <div class="map-mode-selector">
          <label for="map-mode">地图模式：</label>
          <select id="map-mode" v-model="currentMapMode" @change="switchMapMode">
            <option value="railway">高铁城市圈</option>
            <option value="heat">省份热力图</option>
          </select>
        </div>
      </div>
    </div>
    
    <div id="railway-map" class="chart-container"></div>
    
    <div v-if="currentMapMode === 'railway'" class="legend railway-legend">
      <div class="legend-item">
        <span class="color-box" style="background-color: #ff4a4a;"></span>
        <span>2小时可达</span>
      </div>
      <div class="legend-item">
        <span class="color-box" style="background-color: #ffaa00;"></span>
        <span>4小时可达</span>
      </div>
      <div class="legend-item">
        <span class="color-box" style="background-color: #73c0de;"></span>
        <span>6小时可达</span>
      </div>
    </div>
    

    <div v-if="selectedCity && cityStats.total > 0 && currentMapMode === 'railway'" class="city-stats-wrapper">
      <div class="city-stats">
        <h3>{{ selectedCity }} 高铁连接城市统计</h3>
        <div class="stats-content">
          <div class="stat-item">
            <span class="stat-label">2小时可达城市：</span>
            <span class="stat-value">{{ cityStats.hours2 }}个</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">4小时可达城市：</span>
            <span class="stat-value">{{ cityStats.hours4 }}个</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">6小时可达城市：</span>
            <span class="stat-value">{{ cityStats.hours6 }}个</span>
          </div>
          <div class="stat-item total">
            <span class="stat-label">总连接城市：</span>
            <span class="stat-value">{{ cityStats.total }}个</span>
          </div>
        </div>
        
        <div class="city-list-container">
          <div v-if="citiesNames['2小时'] && citiesNames['2小时'].length > 0" class="city-list-section">
            <h4>2小时可达城市：</h4>
            <div class="city-list">
              <span v-for="(city, index) in citiesNames['2小时']" :key="'2h-'+index" class="city-tag">{{ city }}</span>
            </div>
          </div>
          <div v-if="citiesNames['4小时'] && citiesNames['4小时'].length > 0" class="city-list-section">
            <h4>4小时可达城市：</h4>
            <div class="city-list">
              <span v-for="(city, index) in citiesNames['4小时']" :key="'4h-'+index" class="city-tag">{{ city }}</span>
            </div>
          </div>
          <div v-if="citiesNames['6小时'] && citiesNames['6小时'].length > 0" class="city-list-section">
            <h4>6小时可达城市：</h4>
            <div class="city-list">
              <span v-for="(city, index) in citiesNames['6小时']" :key="'6h-'+index" class="city-tag">{{ city }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import coordData from 'assets/coord-data.json'

export default {
  name: 'RailwayMap',
  data() {
    return {
      chart: null,
      mapLoaded: false,
      selectedCity: '',
      cityOptions: Object.keys(coordData),
      cityStats: {
        hours2: 0,
        hours4: 0,
        hours6: 0,
        total: 0
      },
      citiesNames: {
        '2小时': [],
        '4小时': [],
        '6小时': []
      },
      currentMapMode: 'heat', 
      provinceData: [
        { name: '广东省', value: 3019 },
        { name: '山东省', value: 2924 },
        { name: '安徽省', value: 2725 },
        { name: '江苏省', value: 2547 },
        { name: '四川省', value: 2497 },
        { name: '广西壮族自治区', value: 2410 },
        { name: '江西省', value: 2294 },
        { name: '湖南省', value: 2291 },
        { name: '福建省', value: 2251 },
        { name: '辽宁省', value: 2195 },
        { name: '浙江省', value: 2188 },
        { name: '河南省', value: 2162 },
        { name: '湖北省', value: 2134 },
        { name: '甘肃省', value: 1854 },
        { name: '河北省', value: 1852 },
        { name: '贵州省', value: 1786 },
        { name: '黑龙江省', value: 1501 },
        { name: '山西省', value: 1318 },
        { name: '云南省', value: 1180 },
        { name: '重庆市', value: 1164 },
        { name: '陕西省', value: 1019 },
        { name: '吉林省', value: 855 },
        { name: '新疆维吾尔自治区', value: 719 },
        { name: '海南省', value: 653 },
        { name: '内蒙古自治区', value: 648 },
        { name: '宁夏回族自治区', value: 458 },
        { name: '天津市', value: 414 },
        { name: '北京市', value: 374 },
        { name: '青海省', value: 268 },
        { name: '上海市', value: 195 },
        { name: '西藏自治区', value: 0 },
        { name: '香港特别行政区', value: null },
        { name: '澳门特别行政区', value: null },
        { name: '台湾省', value: null }
      ],
      minValue: 0,
      maxValue: 0
    }
  },
  mounted() {
    this.initChart()
    window.addEventListener('resize', this.resizeChart)
    
    // Calculate min and max values for the heat map legend
    this.calculateMinMaxValues()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeChart)
    if (this.chart) {
      this.chart.dispose()
    }
  },
  methods: {
    calculateMinMaxValues() {
      const values = this.provinceData
        .filter(item => item.value !== null && item.value !== undefined)
        .map(item => item.value)
      
      this.minValue = Math.min(...values)
      this.maxValue = Math.max(...values)
    },
    
    async initChart() {
      // 创建ECharts实例
      this.chart = echarts.init(document.getElementById('railway-map'))
      
      try {
        // 异步加载中国地图地理数据
        const mapData = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
          .then(res => res.json())
        
        // 注册地图数据
        echarts.registerMap('china', mapData)
        this.mapLoaded = true
        
        // 根据当前模式显示地图
        this.switchMapMode()
        
        // 设置点击事件（仅高铁模式使用）
        this.chart.on('click', this.handleMapClick)
      } catch (error) {
        console.error('Failed to load map data:', error)
      }
    },
    
    switchMapMode() {
      if (!this.mapLoaded) return
      
      if (this.currentMapMode === 'railway') {
        this.showRailwayMap()
      } else if (this.currentMapMode === 'heat') {
        this.showHeatMap()
      }
    },
    
    showRailwayMap() {
      // 设置高铁地图的基本配置
      const option = {
        backgroundColor: '#ffffff',
        tooltip: {
          trigger: 'item',
          formatter: '{b}'
        },
        geo: {
          map: 'china',
          label: {
            show: false
          },
          roam: true,
          zoom: 1.2,
          center: [104.5, 36],
          itemStyle: {
            areaColor: '#e0e0e0',
            borderColor: '#c0c0c0'
          },
          emphasis: {
            label: {
              show: false
            },
            itemStyle: {
              areaColor: '#b0b0b0'
            }
          }
        },
        series: [
          {
            type: 'scatter',
            coordinateSystem: 'geo',
            symbolSize: 10,
            data: this.getCityPoints(),
            itemStyle: {
              color: '#1890ff'
            },
            emphasis: {
              itemStyle: {
                color: '#ff4a4a'
              }
            }
          }
        ]
      }
      
      // 应用配置
      this.chart.setOption(option, true)
      
      // 如果之前选中了城市，重新显示连接线
      if (this.selectedCity) {
        this.showRailwayLines(this.selectedCity)
      }
    },
    
    showHeatMap() {
      // 设置热力图的基本配置
      const option = {
        backgroundColor: '#ffffff',
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            const { name, value } = params;
            if (value === null || isNaN(value)) {
              return `${name}<br/>高铁里程: 暂无数据`;
            }
            return `${name}<br/>高铁里程: ${value} km`;
          }
        },
        visualMap: {
          min: this.minValue,
          max: this.maxValue,
          text: ['高', '低'],
          realtime: true,
          calculable: true,
          inRange: {
            color: ['#FFF5E6', '#FFE4B5', '#FFD700', '#FFA500', '#FF8C00', '#FF7F50', '#FF6347', '#FF4500', '#FF3030']
          },
          show: true
        },
        geo: {
          map: 'china',
          label: {
            show: false
          },
          roam: true,
          zoom: 1.2,
          center: [104.5, 36],
          itemStyle: {
            areaColor: '#e0e0e0',
            borderColor: '#c0c0c0'
          },
          emphasis: {
            label: {
              show: true
            },
            itemStyle: {
              areaColor: '#b0b0b0'
            }
          }
        },
        series: [
          {
            name: '省份数据',
            type: 'map',
            geoIndex: 0,
            data: this.provinceData,
            label: {
              show: true,
              formatter: '{b}\n{c}'
            }
          }
        ]
      }
      
      // 应用配置
      this.chart.setOption(option, true)
    },
    
    getCityPoints() {
      // 获取所有城市坐标点
      return Object.keys(coordData).map(cityName => {
        // 查找城市的坐标点
        let coord
        
        // 首先查找该城市自己的数据中是否有坐标
        if (coordData[cityName]['2小时'] && coordData[cityName]['2小时'].some(city => city.name === cityName)) {
          const cityData = coordData[cityName]['2小时'].find(city => city.name === cityName)
          coord = cityData.coord
        } else {
          // 在所有数据中寻找该城市的坐标
          for (const sourceCityName in coordData) {
            for (const timeRange of ['2小时', '4小时', '6小时']) {
              if (coordData[sourceCityName][timeRange]) {
                const cityData = coordData[sourceCityName][timeRange].find(city => city.name === cityName)
                if (cityData && cityData.coord && cityData.coord.length === 2) {
                  coord = cityData.coord
                  break
                }
              }
            }
            if (coord) break
          }
        }
        
        // 如果城市名是北京、上海、天津、重庆等直辖市，特别处理
        if (!coord) {
          if (cityName === '北京市') coord = [116.3956, 39.93]
          else if (cityName === '上海市') coord = [121.4879, 31.2492]
          else if (cityName === '天津市') coord = [117.2108, 39.1439]
          else if (cityName === '重庆市') coord = [106.5306, 29.5446]
          else if (cityName === '拉萨') coord = [91.1409, 29.6456]
          else if (cityName === '乌鲁木齐') coord = [87.6168, 43.8256]
        }
        
        return {
          name: cityName,
          value: coord,
          cityName: cityName
        }
      }).filter(item => item.value && item.value.length === 2)
    },
    
    handleMapClick(params) {
      // 只在高铁模式下响应点击事件
      if (this.currentMapMode !== 'railway') return
      
      if (params.componentType === 'series' && params.seriesType === 'scatter') {
        const cityName = params.data.cityName
        this.selectedCity = cityName
        this.showRailwayLines(cityName)
      }
    },
    
    handleCitySelect() {
      // 只在高铁模式下响应选择事件
      if (this.currentMapMode !== 'railway') {
        this.currentMapMode = 'railway'
        this.switchMapMode()
      }
      
      if (this.selectedCity) {
        this.showRailwayLines(this.selectedCity)
      } else {
        // 重置图表
        this.resetMap()
        this.cityStats = {
          hours2: 0,
          hours4: 0,
          hours6: 0,
          total: 0
        }
        this.citiesNames = {
          '2小时': [],
          '4小时': [],
          '6小时': []
        }
      }
    },
    
    resetMap() {
      if (!this.chart || !this.mapLoaded) return
      
      if (this.currentMapMode === 'railway') {
        this.chart.setOption({
          series: [
            {
              type: 'scatter',
              coordinateSystem: 'geo',
              symbolSize: 10,
              data: this.getCityPoints(),
              itemStyle: {
                color: '#1890ff'
              },
              emphasis: {
                itemStyle: {
                  color: '#ff4a4a'
                }
              }
            }
          ]
        })
      }
    },
    
    updateCityStats(cityName) {
      if (!coordData[cityName]) {
        this.cityStats = {
          hours2: 0,
          hours4: 0,
          hours6: 0,
          total: 0
        }
        this.citiesNames = {
          '2小时': [],
          '4小时': [],
          '6小时': []
        }
        return
      }
      
      // 获取各时间范围内的城市数量
      const hours2Count = coordData[cityName]['2小时'] ? coordData[cityName]['2小时'].length : 0
      const hours4Count = coordData[cityName]['4小时'] ? coordData[cityName]['4小时'].length : 0
      const hours6Count = coordData[cityName]['6小时'] ? coordData[cityName]['6小时'].length : 0
      
      // 更新数量统计
      this.cityStats = {
        hours2: hours2Count,
        hours4: hours4Count,
        hours6: hours6Count,
        total: hours2Count + hours4Count + hours6Count
      }
      
      // 更新城市名称列表
      this.citiesNames = {
        '2小时': coordData[cityName]['2小时'] ? coordData[cityName]['2小时'].map(city => city.name) : [],
        '4小时': coordData[cityName]['4小时'] ? coordData[cityName]['4小时'].map(city => city.name) : [],
        '6小时': coordData[cityName]['6小时'] ? coordData[cityName]['6小时'].map(city => city.name) : []
      }
    },
    
    showRailwayLines(cityName) {
      if (!this.mapLoaded || !coordData[cityName]) return
      
      // 确保当前是高铁模式
      if (this.currentMapMode !== 'railway') {
        this.currentMapMode = 'railway'
        this.switchMapMode()
        // 稍等一下确保模式切换完成
        setTimeout(() => {
          this.showRailwayLines(cityName)
        }, 100)
        return
      }
      
      // 清除之前的数据
      this.selectedCity = cityName
      
      // 更新城市统计数据
      this.updateCityStats(cityName)
      
      // 获取选中城市的坐标
      let sourceCoord
      const cityPoints = this.getCityPoints()
      const sourceCity = cityPoints.find(city => city.cityName === cityName)
      
      if (sourceCity && sourceCity.value) {
        sourceCoord = sourceCity.value
      } else {
        console.error('Cannot find source city coordinates')
        return
      }
      
      // 准备线数据
      const linesData = {
        '2小时': [],
        '4小时': [],
        '6小时': []
      }
      
      // 获取目标城市并整理为线数据
      for (const timeRange of ['2小时', '4小时', '6小时']) {
        if (coordData[cityName][timeRange]) {
          linesData[timeRange] = coordData[cityName][timeRange].map(targetCity => {
            if (!targetCity.coord || targetCity.coord.length !== 2) {
              return null
            }
            return {
              coords: [sourceCoord, targetCity.coord],
              name: `${cityName} 到 ${targetCity.name}`,
              targetCity: targetCity.name
            }
          }).filter(Boolean)
        }
      }
      
      // 更新图表
      this.chart.setOption({
        series: [
          // 保留原有的散点图
          {
            type: 'scatter',
            coordinateSystem: 'geo',
            symbolSize: 10,
            data: this.getCityPoints(),
            itemStyle: {
              color: '#1890ff'
            },
            emphasis: {
              itemStyle: {
                color: '#ff4a4a'
              }
            }
          },
          // 高亮选中的城市
          {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: [{
              name: cityName,
              value: sourceCoord
            }],
            symbolSize: 15,
            showEffectOn: 'render',
            rippleEffect: {
              brushType: 'stroke'
            },
            hoverAnimation: true,
            itemStyle: {
              color: '#f4e925',
              shadowBlur: 10,
              shadowColor: '#333'
            },
            zlevel: 1
          },
          // 2小时线路
          {
            name: '2小时可达',
            type: 'lines',
            coordinateSystem: 'geo',
            zlevel: 2,
            effect: {
              show: true,
              period: 4,
              trailLength: 0.1,
              symbol: 'arrow',
              symbolSize: 5
            },
            lineStyle: {
              color: '#ff4a4a',
              width: 2,
              curveness: 0.2
            },
            data: linesData['2小时']
          },
          // 4小时线路
          {
            name: '4小时可达',
            type: 'lines',
            coordinateSystem: 'geo',
            zlevel: 2,
            effect: {
              show: true,
              period: 4,
              trailLength: 0.1,
              symbol: 'arrow',
              symbolSize: 5
            },
            lineStyle: {
              color: '#ffaa00',
              width: 2,
              curveness: 0.2
            },
            data: linesData['4小时']
          },
          // 6小时线路
          {
            name: '6小时可达',
            type: 'lines',
            coordinateSystem: 'geo',
            zlevel: 2,
            effect: {
              show: true,
              period: 4,
              trailLength: 0.1,
              symbol: 'arrow',
              symbolSize: 5
            },
            lineStyle: {
              color: '#73c0de',
              width: 2,
              curveness: 0.2
            },
            data: linesData['6小时']
          }
        ]
      })
    },
    
    resizeChart() {
      if (!this.chart) return
      this.chart.resize()
      
      // 重新应用当前地图模式的配置
      if (this.currentMapMode === 'heat') {
        this.showHeatMap()
      } else if (this.currentMapMode === 'railway') {
        if (this.selectedCity) {
          this.showRailwayLines(this.selectedCity)
        } else {
          this.showRailwayMap()
        }
      }
    },
    
    resetView() {
      this.selectedCity = '';
      this.resetMap();
      this.cityStats = {
        hours2: 0,
        hours4: 0,
        hours6: 0,
        total: 0
      };
      this.citiesNames = {
        '2小时': [],
        '4小时': [],
        '6小时': []
      };
      
      // 重置地图视图到初始状态
      if (this.chart && this.mapLoaded) {
        this.chart.setOption({
          geo: {
            zoom: 1.2,
            center: [104.5, 36]
          }
        });
      }
    }
  }
}
</script>

<style scoped>
/*地图部分容器*/
.railway-map-container {
  width: 100%;
  height: 600px;
  position: relative;
  box-shadow: 0 0 15px rgba(0,0,0,0.1);
  border-radius: 8px;
  background: white;
  overflow: hidden;
}

/*左上角选择部分*/ 
.control-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 100;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.city-selector, .map-mode-selector {
  display: flex;
  align-items: center;
}

.city-selector label, .map-mode-selector label {
  margin-right: 10px;
  font-weight: bold;
  white-space: nowrap;
}

.city-selector select, .map-mode-selector select {
  padding: 5px 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: white;
  min-width: 150px;
  margin-right: 10px;
}

.reset-btn {
  padding: 5px 10px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.reset-btn:hover {
  background-color: #e0e0e0;
}

.chart-container {
  width: 100%;
  height: 100%;
}

/*右下角图例*/
.legend {
  position: absolute;
  bottom: 30px;
  right: 30px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.color-box {
  display: inline-block;
  width: 20px;
  height: 10px;
  margin-right: 8px;
}

/* .heat-legend {
  width: 200px;
}

.legend-title {
  margin: 0 0 8px 0;
  font-weight: bold;
  text-align: center;
}

.color-gradient {
  height: 10px;
  width: 100%;
  background: linear-gradient(to right, #f7fbff, #deebf7, #c6dbef, #9ecae1, #6baed6, #4292c6, #2171b5, #08519c, #08306b);
  margin-bottom: 5px;
} */

/* .gradient-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
} */

/*城市统计部分*/
.city-stats-wrapper {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
}

.city-stats {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  max-width: 280px;
  min-width: 200px;
  max-height: calc(100vh - 150px);
  overflow-y: auto;
  backdrop-filter: blur(5px);
}

.city-stats h3 {
  margin-top: 0;
  margin-bottom: 10px;
  text-align: center;
  color: #2c3e50;
  font-size: 16px;
}

.stats-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 10px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f4f6f7;
  padding: 6px 10px;
  border-radius: 6px;
}

.stat-item.total {
  grid-column: span 2;
  background-color: #e8f4f8;
}

.stat-label {
  font-weight: 500;
  color: #607d8b;
  font-size: 12px;
}

.stat-value {
  font-weight: bold;
  color: #2196f3;
  font-size: 12px;
}

.city-list-container {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 8px;
}

.city-list-section {
  margin-bottom: 8px;
}

.city-list-section h4 {
  margin: 0 0 6px 0;
  font-size: 12px;
  color: #546e7a;
}

.city-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.city-tag {
  background-color: #e1f5fe;
  color: #0277bd;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 10px;
}
</style>