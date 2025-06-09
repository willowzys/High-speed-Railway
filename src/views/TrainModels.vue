<template>
  <div class="train-models">
    <!-- 顶部概览区域 -->
    
    <el-row :gutter="20" class="section-margin">
      <el-col :span="24">
        <el-card class="chart-card">
          <!-- <template #header> -->
            <!-- <div class="card-header">
              <span class="card-title">中国高铁总里程增长数据</span>
            </div> -->
          <!-- </template> -->
          <RailChart />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="section-margin">
      <el-col :span="24">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">高铁竞争力分析</span>
            </div>
          </template>
          <TransportationChart />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="section-margin">
      <el-col :span="24">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">各省份高铁里程热力图和可达性分析</span>
            </div>
          </template>
          <RailwayMap />
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">中国高铁车型发展概览</span>
            </div>
          </template>
          <TrainEvolutionChart />
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">中国高铁车型谱系图</span>
            </div>
          </template>
          <Traintree />
        </el-card>
      </el-col>
    </el-row>

    <!-- 中部分析区域 -->
  
    
    <!-- 底部详细信息区域 -->
    <el-row :gutter="20" class="section-margin">
      <el-col :span="24">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">高铁车型详细信息</span>
            </div>
          </template>
          <TrainCardGrid :trains="trainData" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import trainModelsData from '../../data/high_speed_train_models_cleaned.json'
import trainImages from '../../data/train_images.json'
import TrainEvolutionChart from '../components/TrainEvolutionChart.vue'
import TrainCardGrid from '../components/TrainCardGrid.vue'
import Traintree from '../components/Traintree.vue'
import TransportationChart from '../components/TransportationChart.vue';
import RailChart from '../components/RailChart.vue'
import RailwayMap from '../components/RailwayMap.vue'

const trainData = ref(trainModelsData.map(train => ({
  ...train,
  image: trainImages[train.model] || '/images/trains/CRH380A.png'
})))
</script>

<style scoped>
/* .train-models {
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 10px;
  box-sizing: border-box;
  background: linear-gradient(135deg, #f5f7fa 0%, #e6e9f0 100%);
  display: flex;
  flex-direction: column;
  gap: 20px;
} */

.el-row {
  width: 100%;
  margin: 0 !important;
}

.el-col {
  padding: 15px;
  box-sizing: border-box;
}


.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  /* padding: 10px 15px; */
  border-radius: 8px 8px 0 0;
}

.card-title {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  text-align: center;
  margin: 0 auto;
}


.chart-card {
  margin-bottom: 3px;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 10px 20px rgba(16, 197, 82, 0.08);
}

.chart-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(214, 22, 22, 0.12);
}

.chart-card:hover::before {
  opacity: 1;
}

/* .highlight-card {
  border-left: 6px solid #3498db;
} */

.section-margin {
  margin-top: 30px;
}

/* 科技感卡片背景 */
.chart-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  z-index: 1;
}


/* 响应式调整 */
@media (max-width: 768px) {
  .train-models {
    padding: 10px;
  }
  
  .section-margin {
    margin-top: 20px;
  }
  
  .card-title {
    font-size: 16px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #3498db;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #2980b9;
}
</style>