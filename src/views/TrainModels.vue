<template>
  <div class="train-models">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>中国高铁车型发展概览</span>
            </div>
          </template>
          <TrainEvolutionChart />
        </el-card>
      </el-col>
      
      <el-col :span="24" style="margin-top: 20px">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>高铁车型技术参数对比</span>
            </div>
          </template>
          <TrainParallelChart :data="trainData" />
        </el-card>
      </el-col>

      <el-col :span="24" style="margin-top: 20px">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>高铁车型详细信息</span>
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
import TrainParallelChart from '../components/TrainParallelChart.vue'
import TrainCardGrid from '../components/TrainCardGrid.vue'

const trainData = ref(trainModelsData.map(train => ({
  ...train,
  image: trainImages[train.model] || '/images/trains/CRH380A.png'
})))
</script>

<style scoped>
.train-models {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>