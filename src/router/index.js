import { createRouter, createWebHashHistory } from 'vue-router'
// import Recommend from '@/views/recommend.vue'
const Recommend = () => import(/* webpackChunkName: "Recommend" */ '../views/recommend.vue')

const routes = [
  {
    path: '/',
    name: 'Recommend',
    component: Recommend
  }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router
