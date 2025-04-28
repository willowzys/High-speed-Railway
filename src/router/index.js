import { createRouter, createWebHashHistory } from 'vue-router'
import TrainModels from '../views/TrainModels.vue'
import TechTree from '../views/TechTree.vue'
import TransportCompetition from '../views/TransportCompetition.vue'

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
    },
    {
      path: '/tech-tree',
      name: 'TechTree',
      component: TechTree
    },
    {
      path: '/transport-competition',
      name: 'TransportCompetition',
      component: TransportCompetition
    }
  ]
})

export default router
