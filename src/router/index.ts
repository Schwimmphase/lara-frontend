import { createRouter, createWebHistory } from 'vue-router'

// TODO Only for Test reasons
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
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // TODO One test route
    {
      path: '/test',
      name: 'test',
      component: TestView,
      meta: { showSidebar: true }
    },

    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { showSidebar: false }
    },

    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { showSidebar: false }
    },

    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { showSidebar: false }
    },

    {
      path: '/research',
      name: 'researchOverview',
      component: ResearchOverviewView,
      meta: { showSidebar: false }
    },

    {
      path: '/paper',
      name: 'paperDetails',
      props: true,
      component: DetailView,
      meta: { showSidebar: true }
    },

    {
      path: '/search',
      name: 'search',
      component: SearchView,
      meta: { showSidebar: true }
    },

    {
      path: '/recommendations',
      name: 'recommendations',
      component: RecommendationsView,
      meta: { showSidebar: true }
    }
  ]
});

router.beforeEach(async (to, from) => {
  if (!document.cookie.includes("lara-token") && to.name !== 'login') {
      return { name: 'login' };
  }
  if (document.cookie.includes("lara-token") && to.name === 'login') {
    return from;
  }
});

export default router
