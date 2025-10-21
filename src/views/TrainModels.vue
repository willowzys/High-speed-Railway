<template>
  <div class="train-models">
    <!-- 顶部概览区域 -->
    
    <el-row :gutter="20" class="section-margin">
      <el-col :span="24">
        <el-card class="chart-card1">
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
  border-radius: 8px 8px 0 0;
}

.card-title {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  text-align: center;
  margin: 0 auto;
}

.chart-card1 {
  margin-bottom: 3px;
  height: 730px;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 10px 20px rgba(16, 197, 82, 0.08);
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


.section-margin {
  margin-top: 30px;
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
