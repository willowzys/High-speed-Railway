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
          <!-- <button class="reset-btn" @click="resetView">重置地图</button> -->
        </div>
        
        <div class="map-mode-selector">
          <label for="map-mode">地图模式：</label>
          <select id="map-mode" v-model="currentMapMode" @change="switchMapMode">
            <option value="heat">省份热力图</option>
            <option value="railway">高铁城市圈</option>
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

  <div v-if="connectionDetails" class="connection-info-display">
    <h3>连线信息</h3>
    <p>起点: {{ connectionDetails.startCity }}</p>
    <p>终点: {{ connectionDetails.endCity }}</p>
    <p>距离: {{ connectionDetails.distance }}</p>
    <p>通勤时间: {{ connectionDetails.time }}</p>
    <button @click="clearConnectionInfo">清除连线</button>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import coordData from 'assets/coord-data.json'
import cityGeoCoords from 'assets/cityGeoCoords.json'

export default {
  name: 'RailwayMap',
  data() {
    return {
      chart: null,
      mapLoaded: false,
      selectedCity: '',
      selectedProvince: '',
      currentView: 'china',
      isZooming: false, // 新增：防止重复点击
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
        { name: '广东省', value: 3019, code: '440000' },
        { name: '山东省', value: 2924, code: '370000' },
        { name: '安徽省', value: 2725, code: '340000' },
        { name: '江苏省', value: 2547, code: '320000' },
        { name: '四川省', value: 2497, code: '510000' },
        { name: '广西壮族自治区', value: 2410, code: '450000' },
        { name: '江西省', value: 2294, code: '360000' },
        { name: '湖南省', value: 2291, code: '430000' },
        { name: '福建省', value: 2251, code: '350000' },
        { name: '辽宁省', value: 2195, code: '210000' },
        { name: '浙江省', value: 2188, code: '330000' },
        { name: '河南省', value: 2162, code: '410000' },
        { name: '湖北省', value: 2134, code: '420000' },
        { name: '甘肃省', value: 1854, code: '620000' },
        { name: '河北省', value: 1852, code: '130000' },
        { name: '贵州省', value: 1786, code: '520000' },
        { name: '黑龙江省', value: 1501, code: '230000' },
        { name: '山西省', value: 1318, code: '140000' },
        { name: '云南省', value: 1180, code: '530000' },
        { name: '重庆市', value: 1164, code: '500000' },
        { name: '陕西省', value: 1019, code: '610000' },
        { name: '吉林省', value: 855, code: '220000' },
        { name: '新疆维吾尔自治区', value: 719, code: '650000' },
        { name: '海南省', value: 653, code: '460000' },
        { name: '内蒙古自治区', value: 648, code: '150000' },
        { name: '宁夏回族自治区', value: 458, code: '640000' },
        { name: '天津市', value: 414, code: '120000' },
        { name: '北京市', value: 374, code: '110000' },
        { name: '青海省', value: 268, code: '630000' },
        { name: '上海市', value: 195, code: '310000' },
        { name: '西藏自治区', value: 0, code: '540000' },
        { name: '香港特别行政区', value: null, code: '810000' }, // 注意：数据源可能有所不同
        { name: '澳门特别行政区', value: null, code: '820000' }, // 注意：数据源可能有所不同
        { name: '台湾省', value: null, code: '710000' } // 注意：数据源可能有所不同
      ],
      provinceCityMap: {
        '广东省': ['广州市', '深圳市', '珠海市', '汕头市',  '佛山市', '江门市', '湛江市', '茂名市', '肇庆市', '惠州市', '梅州市', '汕尾市', '河源市', '阳江市', '清远市', '东莞市', '中山市', '潮州市', '揭阳市', '云浮市', '韶关市',],
        '四川省': ['成都市', '绵阳市', '自贡市', '攀枝花市', '泸州市', '德阳市', '广元市', '遂宁市', '内江市', '乐山市', '南充市', '眉山市', '宜宾市', '广安市', '达州市', '雅安市', '巴中市', '资阳市', '阿坝藏族羌族自治州', '甘孜藏族自治州', '凉山彝族自治州'],
        // ... 其他省份的城市映射
      },

      selectedCity1: null,
      cityConnectionsData: {
        '成都市-绵阳市': { distance: '约120km', time: '约44分钟' },
        '成都市-乐山市': { distance: '约140km', time: '约1小时' },
        '成都市-德阳市': { distance: '约65km', time: '约25分钟' },
        '成都市-眉山市': { distance: '约60km', time: '约31分钟' },
        '成都市-内江市': { distance: '约150km', time: '约50分钟' },
        '成都市-广元市': { distance: '约290km', time: '约1小时30分钟' },
        '成都市-自贡市': { distance: '约150km', time: '约50分钟' },
        '成都市-宜宾市': { distance: '约200km', time: '约1小时34分钟' },
        '成都市-南充市': { distance: '约210km', time: '约1小时37分钟' },
        '成都市-泸州市': { distance: '约230km', time: '约1小时30分钟' },
        '成都市-广安市': { distance: '约260km', time: '约1小时30分钟' },
        '成都市-资阳市': { distance: '约60km', time: '约25分钟' },
        '成都市-巴中市': { distance: '约310km', time: '约1小时30分钟' },
        '成都市-雅安市': { distance: '约115km', time: '约1小时19分钟' },
        '成都市-阿坝藏族羌族自治州': { distance: '约300km', time: '暂无数据' },
        '成都市-甘孜藏族自治州': { distance: '约260km', time: '暂无数据' },
        '成都市-凉山彝族自治州': { distance: '约436km', time: '约3小时' },
      },
      // 用于存储当前绘制的连接线数据
      currentLineData: [],
      // 新增：用于显示连接信息的对象
      connectionDetails: null, // 初始化为 null，表示不显示
      
      minValue: 0,
      maxValue: 0
    }
  },
  mounted() {
    this.initChart()
    window.addEventListener('resize', this.resizeChart)
    
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
      console.log('Initializing chart...')
      
      const chartDom = document.getElementById('railway-map')
      if (!chartDom) {
        console.error('Chart container not found!')
        return
      }
      
      this.chart = echarts.init(chartDom)
      console.log('Chart instance created')

       try {
        console.log('Loading China map data...')
        const basePath = import.meta.env.BASE_URL;
        const response = await fetch(`${basePath}assets/China.json`);
        
        const mapData = await response.json()
        
        echarts.registerMap('china', mapData)
        this.mapLoaded = true
        console.log('China map data loaded and registered')
        
        // 先显示地图
        this.switchMapMode()
        
        // 使用 nextTick 确保在 Vue 更新周期后绑定事件
        this.$nextTick(() => {
          this.bindChartEvents()
        })
        
      } catch (error) {
        console.error('Failed to load map data:', error)
      }
    },

    // 独立的事件绑定方法
    bindChartEvents() {
      if (!this.chart) {
        console.warn('Chart not available for event binding')
        return
      }

      console.log('Binding click events...')

      // 清除旧的事件监听器
      this.chart.off('click')
      this.chart.off('mouseover')

      // 使用箭头函数确保 this 上下文正确
      this.chart.on('click', (params) => {
        console.log('=== CHART CLICKED ===')
        console.log('Params:', params)
        console.log('Component type:', params.componentType)
        console.log('Series type:', params.seriesType)
        console.log('Name:', params.name)
        console.log('Current mode:', this.currentMapMode)
        console.log('Current view:', this.currentView)

        // 如果点击的是地图区域 (如省份)
        if (params.componentType === 'geo' || params.componentType === 'series' && params.seriesType === 'map') {
          if( this.currentMapMode === 'railway') {
            return;
          }
          console.log('点击了地图区域');
          this.handleMapClick(params);
          // 清除连线和已选择的城市
          this.selectedCity1 = null;
          this.currentLineData = [];
          this.chart.setOption({ series: [{ name: '高铁路线', data: [] }] }); // 立即清除线
        }
        // 如果点击的是散点 (即城市) 并且当前视图是省份视图 (即已经放大了)
        else if (params.componentType === 'series' && params.seriesType === 'scatter' && this.currentMapMode === 'heat') {
          console.log('点击了城市散点:', params.name);
          this.handleCityScatterClick(params);
        }
        else if(params.componentType === 'series' && params.seriesType === 'scatter' && this.currentMapMode === 'railway') {
          console.log('点击了高铁城市散点:', params.name);
          this.handleMapClick(params);
          this.showRailwayLines(params.name);
        }
        else {
          console.warn('点击了非地图或散点元素:', params);
        }
      })

      this.chart.on('mouseover', (params) => {
        console.log('Mouse over:', params.name, 'Type:', params.componentType)
      })

      console.log('Event listeners bound successfully')
    },

    // 处理地图点击事件
    handleMapClick(params) {
      if (this.currentMapMode === 'heat' && this.currentView === 'china') {
        console.log('Attempting to zoom to province:', params.name)

        if (this.isZooming) {
          console.log('Already zooming, ignoring click')
          return
        }

        this.zoomToProvince(params.name)
      } 
      else if (this.currentMapMode === 'railway') {
        console.log('Railway mode click detected')
      }

      this.selectedCity1 = null;
      this.currentLineData = [];
      this.connectionDetails = null; // 清除显示的信息
      this.chart.setOption({ series: [{ name: '高铁路线', data: [] }] }); // 立即清除线
    },
    
    // 放大到省份视图

    async zoomToProvince(provinceName) {
      if (this.isZooming) {
        console.log('Already zooming, returning early')
        return
      }
      
      this.isZooming = true
      console.log('Starting zoom to province:', provinceName)
      
      try {
        const province = this.provinceData.find(p => p.name === provinceName)
        if (!province) {
          console.error('Province not found:', provinceName)
          return
        }
        
        if (!province.value) {
          console.error('Province code not found for:', provinceName)
          return
        }
        
        console.log('Loading province map data for code:', province.value)
        
        // 仅使用本地路径（public/assets/provinces/目录下的JSON文件）
        const baseUrl = import.meta.env.BASE_URL;
        const localUrl = `${baseUrl}assets/provinces/${province.code}_full.json`;
        
        let provinceMapData = null
        let loadSuccess = false
        
        try {
          console.log('Trying local URL:', localUrl)
          const response = await fetch(localUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            }
          })
          
          if (response.ok) {
            provinceMapData = await response.json()
            loadSuccess = true
            console.log('Province map data loaded successfully from local:', localUrl)
          } else {
            console.error('Local map data request failed with status:', response.status)
          }
        } catch (err) {
          console.error('Error loading local province map data:', err.message)
        }
        
        if (!loadSuccess || !provinceMapData) {
          console.error('Local map data load failed, using fallback view')
          this.showSimplifiedProvinceView(province)
          return
        }
        
        echarts.registerMap(province.code, provinceMapData)
        
        this.selectedProvince = provinceName
        this.currentView = province.code
        
        this.showProvinceMap(province)
        
      } catch (error) {
        console.error('Failed to process province map data:', error)
        const province = this.provinceData.find(p => p.name === provinceName)
        if (province) {
          this.showSimplifiedProvinceView(province)
        }
      } finally {
        this.isZooming = false
        console.log('Zoom operation completed, isZooming set to false')
      }

      this.selectedProvince = provinceName;
      // 当进入省份视图时，重置连线状态和信息
      this.selectedCity1 = null;
      this.currentLineData = [];
      this.connectionDetails = null; // 清除显示的信息
    },
    
    // 显示省份地图
    showProvinceMap(province) {
      const cities = this.getProvinceCities(province.name)

      // 重置点击选择和连线数据
      this.selectedCity1 = null;
      this.currentLineData = [];

      const option = {
        backgroundColor: '#ffffff',
        title: {
          text: province.name,
          left: 'center',
          top: 20,
          textStyle: {
            fontSize: 18,
            fontWeight: 'bold'
          }
        },
        geo: {
          map: province.code,
          label: {
            show: true,
            fontSize: 10
          },
          roam: true,
          zoom: 1,
          itemStyle: {
            areaColor: '#f0f0f0',
            borderColor: '#999999'
          },
          emphasis: {
            itemStyle: {
              areaColor: '#e0e0e0'
            }
          }
        },
        series: [
          {
            name: '城市散点',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbolSize: 8,
            data: cities,
            itemStyle: {
              color: '#1890ff'
            },
            emphasis: {
              itemStyle: {
                color: '#ff4a4a'
              }
            },
            label: {
              show: false,
              position: 'top',
              fontSize: 10,
              formatter: '{b}'
            },
             // 添加 tooltip 来显示城市信息
            tooltip: {
              formatter: function (params) {
                  return params.name; // 点击散点时显示城市名称
              }
            }
          },
          // 新增：用于显示连线的 series
          {
            name: '高铁路线',
            type: 'lines',
            coordinateSystem: 'geo',
            zlevel: 2, // 确保线在散点上方
            effect: {
              show: true,
              period: 6, // 箭头流动速度
              trailLength: 0.7, // 尾巴长度
              color: '#fff',
              symbolSize: 3 // 箭头大小
            },
            lineStyle: {
              normal: {
                color: '#c23531', // 线的颜色
                width: 2,
                opacity: 0.6,
                curveness: 0.2 // 线的弯曲度
              }
            },
            data: this.currentLineData, // 绑定到 currentLineData

            label: { // 保持默认隐藏，或只在强调时显示
              show: false // 默认不显示，如果需要悬停显示可以设为 true 并调整 formatter
            },
            tooltip: {
            // 配置 tooltip 显示
            show: true,
            formatter: function (params) {
                // params.data 是 currentLineData 里的一个对象
                // params.data.extra 就是我们存的 connectionInfo
                if (params.data && params.data.extra) {
                    const info = params.data.extra;
                    return `
                        ${params.seriesName}<br/>
                        ${params.data.coords[0][0]}, ${params.data.coords[0][1]} - ${params.data.coords[1][0]}, ${params.data.coords[1][1]}<br/>
                        距离: ${info.distance}<br/>
                        通勤时间: ${info.time}
                    `;
                }
                return '';
              }
            }
          }
        ]
      };
      this.chart.setOption(option, true)

      this.addBackButton()
    },
    

    // 新增：获取省份内的城市数据
    getProvinceCities(provinceName) {
      const cityNames = this.provinceCityMap[provinceName] || [];
      const cities = [];

      console.log('该省份的城市列表:', cityNames);

      cityNames.forEach(cityName => {
        // 从 cityGeoCoords 中查找城市坐标
        if (cityGeoCoords[cityName]) { 
          cities.push({
            name: cityName,
            value: cityGeoCoords[cityName] 
          });
        } else {
          console.warn(`警告：城市 '${cityName}' 的地理坐标数据未找到在 cityGeoCoords 中。`);
        }
      });

      console.log('最终生成的城市点数据:', cities);
      return cities;
    },
    
    // 新增：添加返回按钮
    addBackButton() {
      // 在图表上添加一个返回按钮
      const option = this.chart.getOption()
      option.graphic = [{
        type: 'group',
        right: 20,
        top: 20,
        children: [{
          type: 'rect',
          shape: {
            width: 60,
            height: 30
          },
          style: {
            fill: '#1890ff',
            stroke: '#1890ff'
          },
          onclick: () => {
            this.backToChina()
          }
        }, {
          type: 'text',
          style: {
            text: '返回',
            x: 30,
            y: 15,
            textAlign: 'center',
            textVerticalAlign: 'middle',
            fill: '#fff',
            fontSize: 12
          },
          onclick: () => {
            this.backToChina()
          }
        }]
      }]
      
      this.chart.setOption(option)
    },
    
    // 新增：返回中国地图
    backToChina() {
      this.selectedProvince = ''
      this.currentView = 'china'
      this.switchMapMode()
    },

    // 新增：处理城市散点点击事件
    handleCityScatterClick(params) {
      console.log('DEBUG: 进入 handleCityScatterClick()。');
      const clickedCityName = params.name;
      const clickedCityCoords = params.value;

      // 清除上次的显示信息，如果存在的话
      this.connectionDetails = null; 
      this.chart.setOption({ series: [{ name: '高铁路线', data: [] }] });

      if (this.selectedProvince !== '四川省') {
        console.log('当前不在四川省视图，不处理城市连线。');
        this.selectedCity1 = null;
        this.currentLineData = [];
        this.chart.setOption({ series: [{ name: '高铁路线', data: [] }] });
        return;
      }
      
      if (this.selectedCity1 === null) {
        // 第一次点击：选中第一个城市
        this.selectedCity1 = { name: clickedCityName, value: clickedCityCoords };
        console.log('已选择第一个城市:', this.selectedCity1.name);
      } else {
        // 第二次点击：连接两个城市并显示信息
        if (this.selectedCity1.name === clickedCityName) {
          console.log('点击了同一个城市，取消选择。');
          this.selectedCity1 = null;
          this.currentLineData = [];
          this.chart.setOption({ series: [{ name: '高铁路线', data: [] }] });
          return;
        }

        let startCity = this.selectedCity1.name;
        let endCity = clickedCityName;

        let connectionKey;
        if (startCity === '成都市') {
          connectionKey = `${startCity}-${endCity}`;
        } else if (endCity === '成都市') {
          connectionKey = `${endCity}-${startCity}`;
        } else {
          
          console.warn('只能连接成都市与同省份其他城市。');
          this.selectedCity1 = null;
          this.currentLineData = [];
          this.chart.setOption({ series: [{ name: '高铁路线', data: [] }] });
          return;
        }
        
        const connectionInfo = this.cityConnectionsData[connectionKey];

        if (connectionInfo) {
          // 绘制连线
          this.currentLineData = [{
            coords: [
              this.selectedCity1.value, // 起点坐标
              clickedCityCoords // 终点坐标
            ],
            extra: connectionInfo
          }];

          // 更新 ECharts option 来显示连线
          this.chart.setOption({
            series: [
              {
                name: '高铁路线',
                data: this.currentLineData,
                // 确保 label 不显示，因为它不是我们显示信息的方式了
                label: { show: false } 
              }
            ]
          }, false);

          this.connectionDetails = {
            startCity: startCity,
            endCity: endCity,
            distance: connectionInfo.distance,
            time: connectionInfo.time
          };

          console.log(`连接 ${startCity} 和 ${endCity}，距离：${connectionInfo.distance}，通勤时间：${connectionInfo.time}`);

        } else {
          console.warn(`未找到 ${connectionKey} 的连接数据。`);
          this.currentLineData = [];
        }

        // 重置选择，以便下一次点击可以开始新的连线
        this.selectedCity1 = null;
      }
    },

    clearConnectionInfo() {
      this.selectedCity1 = null;
      this.currentLineData = [];
      this.connectionDetails = null;
      this.chart.setOption({ series: [{ name: '高铁路线', data: [] }] }); // 清除ECharts上的线
      console.log('连线信息已清除。');
    },
        
    switchMapMode() {
      if (!this.mapLoaded) return
      
      if (this.currentMapMode === 'railway') {
        this.connectionDetails = null; // 清除显示的信息
        this.showRailwayMap()
      } else if (this.currentMapMode === 'heat') {
        this.showHeatMap()
      }
    },
    
    showRailwayMap() {
      // 设置高铁地图的基本配置
      console.log('DEBUG: 进入 showRailwayMap()。当前模式:', this.currentMapMode);

      const initialCityPoints = this.getCityPoints(); // 获取初始城市点
      console.log('DEBUG: showRailwayMap() 中 scatter 系列的 data 数量:', initialCityPoints.length);

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
          zoom: 1.4,
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
            data: initialCityPoints,
            itemStyle: {
              color: '#1890ff'
            },
            emphasis: {
              itemStyle: {
                color: '#ff4a4a'
              }
            },
          }
        ]
      }
      
      this.chart.setOption(option, true)
      console.log('DEBUG: showRailwayMap() setOption 完成。');
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
          zoom: 1.4,
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
        
    handleCitySelect() {
      // 只在高铁模式下响应选择事件
      if (this.currentMapMode !== 'railway') {
        this.currentMapMode = 'railway'
        this.switchMapMode()
      }
      
      if (this.selectedCity) {
        this.showRailwayLines(this.selectedCity)
      } else {
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
      
      this.selectedCity = cityName
      this.updateCityStats(cityName)
      let sourceCoord
      const cityPoints = this.getCityPoints()
      const sourceCity = cityPoints.find(city => city.cityName === cityName)
      
      if (sourceCity && sourceCity.value) {
        sourceCoord = sourceCity.value
      } else {
        console.error('Cannot find source city coordinates')
        return
      }
      
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
    
    // resetView() {
    //   this.selectedCity = '';
    //   this.cityStats = { hours2: 0, hours4: 0, hours6: 0, total: 0 };
    //   this.citiesNames = { '2小时': [], '4小时': [], '6小时': [] };
      
    //   if (this.chart && this.mapLoaded) {
    //     this.chart.clear(); 
    //     this.initChart();   
    //   }
    // }
  }
}
</script>

<style scoped>


.connection-info-display {
  position: absolute;
  top: 100px;
  right: 120px;
  background: rgba(255, 255, 255, 0.9);
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  line-height: 1.6;
}

.connection-info-display h3 {
  margin-top: 0;
  color: #0056b3;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
  margin-bottom: 10px;
}

.connection-info-display p {
  margin: 5px 0;
}

.connection-info-display button {
  margin-top: 15px;
  padding: 8px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.connection-info-display button:hover {
  background-color: #0056b3;
}

/*地图部分容器*/
.railway-map-container {
  width: 100%;
  height: 670px;
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
