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
import UserCategoryView from "@/views/UserCategoriesView.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // TODO One test route
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
      path: '/admin/user-categories',
      name: 'user-categories',
      component: UserCategoryView
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
});

router.beforeEach(async (to, from) => {
  console.log(document.cookie);
  if (!document.cookie.includes("lara-token") && to.name !== 'login') {
      return { name: 'login' };
  }
});

export default router
