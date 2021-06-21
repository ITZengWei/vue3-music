import { createRouter, createWebHashHistory } from 'vue-router'
// import Recommend from '@/views/recommend.vue'
const Recommend = () => import(/* webpackChunkName: "Recommend" */ '../views/recommend.vue')
const Search = () => import(/* webpackChunkName: "Search" */ '../views/search.vue')
const Singer = () => import(/* webpackChunkName: "Singer" */ '../views/singer.vue')
const TopList = () => import(/* webpackChunkName: "TopList" */ '../views/top-list.vue')

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: Recommend
  },
  {
    path: '/search',
    name: 'Search',
    component: Search
  },
  {
    path: '/singer',
    name: 'Singer',
    component: Singer
  },
  {
    path: '/top-list',
    name: 'TopList',
    component: TopList
  },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router
