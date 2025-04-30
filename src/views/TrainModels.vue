<template>
  <div class="train-models">
    <el-row :gutter="20">
      <!-- 左列：概览组件 + 竞争力分析组件 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>中国高铁车型发展概览</span>
            </div>
          </template>
          <TrainEvolutionChart />
        </el-card>
        <el-card style="margin-top: 20px">
          <template #header>
            <div class="card-header">
              <span>中国高铁竞争力分析</span>
            </div>
          </template>
          <TransportationChart />
        </el-card>
      </el-col>

      <!-- 右列：谱系图组件 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>中国高铁车型谱系图</span>
            </div>
          </template>
          <Traintree />
        </el-card>
      </el-col>

      <!-- 下方：车型详细信息 -->
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
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>