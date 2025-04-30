import { createRouter, createWebHashHistory } from 'vue-router'
import TrainModels from '../views/TrainModels.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/train-models'
    },
    {
      path: '/train-models',
      name: 'TrainModels',
      component: TrainModels
    }
  ]
})

export default router
