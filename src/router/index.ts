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
import { watch } from 'vue'
import { PiniaVuePlugin } from 'pinia'


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
      meta: { showSidebar: false },
      beforeEnter: (to, from) => {
        return checkResearch();
      }
    },

    {
      path: '/paper',
      name: 'paperDetails',
      props: true,
      component: DetailView,
      meta: { showSidebar: true },
      beforeEnter: (to, from) => {
        return checkResearch();
      }
    },

    {
      path: '/search',
      name: 'search',
      component: SearchView,
      meta: { showSidebar: true },
      beforeEnter: (to, from) => {
        return checkResearch();
      }
    },

    {
      path: '/recommendations',
      name: 'recommendations',
      component: RecommendationsView,
      meta: { showSidebar: true },
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
    console.log(useOpenResearchStore().getResearch);
    return true;
  }
}

function getCookies(): Map<string, string> {
  let cookies = new Map<string, string>();
  for (let cookie of document.cookie.split(";")) {
    cookies.set(cookie.split("=")[0], cookie.split("=")[1]);
  }
  return cookies;
}

router.beforeEach(async (to, from) => {
  let cookies = getCookies();
  if (to.name !== 'login' && !cookies.get("lara-token")) {
    return { name: 'login' };
  }
  if (to.name === 'login' && cookies.get("lara-token")) {
    return from;
  }
});

export default router
