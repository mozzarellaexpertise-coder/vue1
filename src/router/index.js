import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/components/Home.vue'
import FriendsView from '@/components/Friends.vue'
import Formula2DView from '@/components/Formula2D.vue'
import SnakeView from '@/components/Snake.vue'
import PracticeView from '@/components/Practice.vue'
import LocalhostView from '@/components/Localhost.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/friends', component: FriendsView },
  { path: '/2dformula', component: Formula2DView },
  { path: '/snake', component: SnakeView },
  { path: '/Practice', component: PracticeView },
  { path: '/Localhost', component: LocalhostView }  
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router