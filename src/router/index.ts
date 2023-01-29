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
import { useOpenResearchStore } from '@/stores/openResearch'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // TODO Test route
    {
      path: '/test',
      name: 'test',
      component: TestView,
      meta: {
        showSidebar: true,
        showSearchInSidebar: true,
      }
    },

    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        showSidebar: false,
        showSearchInSidebar: false,
      }
    },

    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: {
        showSidebar: false,
        showSearchInSidebar: false,
      }
    },

    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        showSidebar: false,
        showSearchInSidebar: false,
      }
    },

    {
      path: '/research',
      name: 'researchOverview',
      component: ResearchOverviewView,
      meta: {
        showSidebar: false,
        showSearchInSidebar: false,
      },
      beforeEnter: (to, from) => {
        return checkResearch();
      }
    },

    {
      path: '/paper',
      name: 'paperDetails',
      props: true,
      component: DetailView,
      meta: {
        showSidebar: true,
        showSearchInSidebar: true,
      },
      beforeEnter: (to, from) => {
        return checkResearch();
      }
    },

    {
      path: '/search',
      name: 'search',
      component: SearchView,
      meta: {
        showSidebar: true,
        showSearchInSidebar: false,
      },
      beforeEnter: (to, from) => {
        return checkResearch();
      }
    },

    {
      path: '/recommendations',
      name: 'recommendations',
      component: RecommendationsView,
      meta: {
        showSidebar: false,
        showSearchInSidebar: true,
      },
      beforeEnter: (to, from) => {
        return checkResearch();
      }
    }
  ]
});

let checkResearch = () => {
  if (useOpenResearchStore().getResearch == null) {
    console.error("NAVIGATION DENIED : no open research");
    return { name: 'home' }
  } else if (useOpenResearchStore().getResearch != null) {
    // Research is set
    return true;
  }
}

router.beforeEach(async (to, from) => {
  if (!document.cookie.includes("lara-token") && to.name !== 'login') {
      return { name: 'login' };
  }
  if (document.cookie.includes("lara-token") && to.name === 'login') {
    return from;
  }
});

export default router;
