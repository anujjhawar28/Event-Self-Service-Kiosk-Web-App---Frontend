import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/walk-in',
      name: 'walk-in',
      component: () => import('../views/WalkInCustomer.vue')
    },
    {
      path: '/details/:userId',
      name: 'user-details',
      component: () => import('../views/UserDetails.vue')
    },
    {
      path: '/badge-generate/:userId',
      name: 'badge-generate',
      component: () => import('../views/BadgeGenerate.vue')
    },
    {
      path: '/pre-registered',
      name: 'pre-registered',
      component: () => import('../views/PreRegistered.vue')
    }
  ]
})

export default router
