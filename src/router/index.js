import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/train-models'
    },
    {
      path: '/train-models',
      component: () => import('../views/TrainModels.vue')
    },
    {
      path: '/train-models/:model',
      component: () => import('../views/TrainModels.vue')
    },
    {
      path: '/tech-tree',
      component: () => import('../views/TechTree.vue')
    }
  ]
})

export default router