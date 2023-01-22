import { createRouter, createWebHistory } from 'vue-router'

// TODO Only for Test reasons
import TestHomeView from '../views/_test_HomeView.vue'
import TestView from '../views/TestView.vue'

// Import all views
import AdminView from '../views/AdminView.vue'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import ResearchOverviewView from '../views/ResearchOverviewView.vue'
import DetailView from '../views/DetailView.vue'
import SearchView from '../views/SearchView.vue'
import RecommendationsView from '../views/RecommendationsView.vue'


const router = createRouter({
  history: createWebHistory(), // import.meta.env.BASE_URL
  routes: [
    // TODO Two test routes
    {
      path: '/testHome',
      name: 'testHome',
      component: TestHomeView
    },

    {
      path: '/test',
      name: 'test',
      component: TestView
    },

    {
      path: '/',
      name: 'home',
      component: HomeView
    },

    {
      path: '/admin',
      name: 'admin',
      component: AdminView
    },

    {
      path: '/login',
      name: 'login',
      component: LoginView
    },

    {
      path: '/research',
      name: 'researchOverview',
      component: ResearchOverviewView
    },

    {
      path: '/paper',
      name: 'paperDetails',
      props: true,
      component: DetailView
    },

    {
      path: '/search',
      name: 'search',
      component: SearchView
    },

    {
      path: '/recommendations',
      name: 'recommendations',
      component: RecommendationsView
    }
  ]
})

export default router
