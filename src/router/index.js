import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/home.vue'
import FriendsView from '../components/friends.vue'
import Formula2DView from '../components/2Dformula.vue'
import snake from '@/components/snake.vue'
    
const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/friends', name: 'friends', component: FriendsView },
  { path: '/2dformula', name: '2dformula', component: Formula2DView },
  { path: '/snake', name: 'snake', component: snake }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router