<template>
  <div class="train-card" @click="handleClick">
    <div class="train-card-image">
      <img :src="train.image" :alt="train.model" />
    </div>
    <div class="train-card-content">
      <h3 class="train-model">{{ train.model }}</h3>
      <p class="train-nickname">{{ train.nickname }}</p>
      <div class="train-info">
        <div class="info-item">
          <span class="label">最高运营时速</span>
          <span class="value">{{ train.max_speed }}km/h</span>
        </div>
        <div class="info-item">
          <span class="label">服役年份</span>
          <span class="value">{{ train.service_year }}</span>
        </div>
        <div class="info-item">
          <span class="label">编组</span>
          <span class="value">{{ train.car_config }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  train: {
    type: Object,
    required: true
  }
})

const handleClick = () => {
  window.open(props.train.external_link, '_blank')
}
</script>

<style scoped>
.train-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.train-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.train-card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.train-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.train-card:hover .train-card-image img {
  transform: scale(1.05);
}

.train-card-content {
  padding: 16px;
}

.train-model {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
}

.train-nickname {
  margin: 4px 0 12px;
  font-size: 0.9rem;
  color: #666;
}

.train-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-item .label {
  font-size: 0.8rem;
  color: #666;
}

.info-item .value {
  font-size: 0.9rem;
  font-weight: 500;
  color: #1a1a1a;
}
</style>