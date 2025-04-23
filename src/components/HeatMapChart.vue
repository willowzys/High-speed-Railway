<template>
  <div class="heatmap-wrapper">
    <div ref="heatMap" class="chart-container"></div>
  </div>
</template>

  <script>
  import * as echarts from 'echarts'
  import geoJson from '@/assets/China.json' // 确保你已经引入了地图 GeoJSON
  
  export default {
    name: 'HeatMapChart',
    mounted() {
      const chart = echarts.init(this.$refs.heatMap)
      echarts.registerMap('china', geoJson)
  
      chart.setOption({
        title: {
          text: '各省高铁里程热力图',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            console.log(params);
            const { name, value } = params;
            if (value === null || value === undefined) {
              return `${name}<br/>高铁里程: 暂无数据`;
            }
            return `${name}<br/>高铁里程: ${value} km`;
          }
        },
        visualMap: {
          min: 0,
          max: 3000,
          left: 'left',
          top: 'bottom',
          text: ['高', '低'],
          calculable: true,
          // inRange: {
          //   color: ['#7FC1CD', '#5BB4E0', '#0052D4'] 
          // },
          // outOfRange: {
          //   color: '#ccc' // 无效数据的颜色（灰色）
          // }
        },
        series: [{
          name: '高铁里程',
          type: 'map',
          map: 'china',
          roam: true,
          data: [
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
            { name: '上海省', value: 195 },
            { name: '西藏自治区', value: 0 },
            { name: '香港特别行政区', value: null },
            { name: '澳门特别行政区', value: null },
            { name: '台湾省', value: null }
          ]
        }]
      })
    }
  }
  </script>
  
  <style scoped>
  .heatmap-wrapper {
    width: 100%;
    height: 100%;
  }

  .chart-container {
  width: 100%;
  height: 100%;
}

  </style>