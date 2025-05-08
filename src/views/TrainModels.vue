<template>
  <div class="train-models">
    <!-- 顶部概览区域 -->
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
    <el-row :gutter="20" class="section-margin">
      <el-col :span="24">
        <el-card class="chart-card highlight-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">中国高铁竞争力分析</span>
            </div>
          </template>
          <TransportationChart />
        </el-card>
      </el-col>
    </el-row>

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

const trainData = ref(trainModelsData.map(train => ({
  ...train,
  image: trainImages[train.model] || '/images/trains/CRH380A.png'
})))
</script>

<style scoped>
.train-models {
  max-width: 1400px;
  margin: 0 auto;
  padding: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.chart-card {
  margin-bottom: 0;
  height: 100%;
  transition: all 0.3s ease;
}

.chart-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.highlight-card {
  border-left: 4px solid #409EFF;
}

.section-margin {
  margin-top: 20px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .train-models {
    padding: 5px;
  }
  
  .section-margin {
    margin-top: 15px;
  }
  
  .card-title {
    font-size: 16px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>