<template>
  <div class="train-card-grid">
    <div class="filters">
      <el-select v-model="selectedSeries" placeholder="选择车型系列" clearable>
        <el-option
          v-for="series in trainSeries"
          :key="series"
          :label="series"
          :value="series"
        />
      </el-select>
      <el-select v-model="sortBy" placeholder="排序方式">
        <el-option label="最高运营时速" value="max_speed" />
        <el-option label="服役年份" value="service_year" />
      </el-select>
      <el-switch
        v-model="ascending"
        active-text="升序"
        inactive-text="降序"
      />
    </div>
    <div class="card-grid">
      <TrainCard
        v-for="train in filteredAndSortedTrains"
        :key="train.model"
        :train="train"
        @click="handleTrainClick(train)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import TrainCard from './TrainCard.vue'

const props = defineProps({
  trains: {
    type: Array,
    required: true
  }
})

// 状态管理
const selectedSeries = ref('')
const sortBy = ref('service_year')
const ascending = ref(true)

// 获取所有车型系列
const trainSeries = computed(() => {
  const series = new Set()
  props.trains.forEach(train => {
    if (train.model.startsWith('CRH1')) series.add('CRH1系')
    else if (train.model.startsWith('CRH2')) series.add('CRH2系')
    else if (train.model.startsWith('CRH3')) series.add('CRH3系')
    else if (train.model.startsWith('CRH5')) series.add('CRH5系')
    else if (train.model.startsWith('CRH6')) series.add('CRH6系')
    else if (train.model.startsWith('CR300')) series.add('CR300系')
    else if (train.model.startsWith('CR400')) series.add('CR400系')
    else series.add('其他')
  })
  return Array.from(series)
})

// 过滤和排序逻辑
const filteredAndSortedTrains = computed(() => {
  let result = [...props.trains]
  
  // 过滤
  if (selectedSeries.value) {
    result = result.filter(train => {
      if (selectedSeries.value === '其他') {
        return !['CRH1', 'CRH2', 'CRH3', 'CRH5', 'CRH6', 'CR300', 'CR400'].some(prefix => 
          train.model.startsWith(prefix)
        )
      }
      return train.model.startsWith(selectedSeries.value.slice(0, -1))
    })
  }
  
  // 排序
  result.sort((a, b) => {
    let valueA = a[sortBy.value]
    let valueB = b[sortBy.value]
    
    // 确保数值比较
    if (sortBy.value === 'max_speed') {
      valueA = parseInt(valueA)
      valueB = parseInt(valueB)
    }
    
    return ascending.value 
      ? valueA - valueB 
      : valueB - valueA
  })
  
  return result
})

// 点击处理
const handleTrainClick = (train) => {
  if (train.external_link) {
    window.open(train.external_link, '_blank')
  } else {
    ElMessage({
      message: `${train.model} 暂无外部链接`,
      type: 'warning'
    })
  }
}
</script>

<style scoped>
.train-card-grid {
  padding: 20px;
}

.filters {
  margin-bottom: 24px;
  display: flex;
  gap: 16px;
  align-items: center;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .card-grid {
    grid-template-columns: 1fr;
  }
}
</style>