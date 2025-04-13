import { createRouter, createWebHashHistory } from 'vue-router' // 修改为 createWebHashHistory

const router = createRouter({
  history: createWebHashHistory(),  // 使用 Hash 模式
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
