<template>
  <div id="app">
    <div class="container">
      <div class="chart-box map-box">
        <HeatMapChart />
      </div>
      <div class="chart-box line-box">
        <RailChart />
      </div>
    </div>
  </div>
</template>

<script>
import RailChart from './components/RailChart.vue'
import HeatMapChart from './components/HeatMapChart.vue'

export default {
  name: 'App',
  components: { RailChart, HeatMapChart },
}
</script>

<style>
#app {
  padding: 40px;
  background: #f5f7fa;
  min-height: 100vh;
}

.container {
  display: flex;
  flex-direction: row;
  gap: 40px;
}

/* 公共样式 */
.chart-box {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* 单独控制宽度 */
.map-box {
  flex: 1;
  border: 1px solid #efa; /* 添加边框以便更清晰地观察区域 */
}

.line-box {
  flex: 1;
}
</style>
