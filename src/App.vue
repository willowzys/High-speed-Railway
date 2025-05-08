<template>
  <div id="app">
    <div class="chart-box fullscreen">
      <RailwayMap />
    </div>
    <div class="chart-box fullscreen">
      <RailChart />
    </div>
  </div>
</template>

<script>
import RailChart from './components/RailChart.vue'
import RailwayMap from './components/RailwayMap.vue'

export default {
  name: 'App',
  components: { RailChart, RailwayMap },
}
</script>

<style>
/* 只在 html 层控制滚动 */
html {
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
}
body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden; /* 禁止其他滚动 */
}

.chart-box {
  height: 100vh;
  width: 100%;
  background: white;
  padding: 20px;
  box-sizing: border-box;
  scroll-snap-align: start;
}
</style>