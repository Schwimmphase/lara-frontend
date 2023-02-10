import { createRouter, createWebHistory } from 'vue-router'

// Import all views
import AdminView from '../views/AdminView.vue'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import ResearchOverviewView from '../views/ResearchOverviewView.vue'
import DetailView from '../views/DetailView.vue'
import SearchView from '../views/SearchView.vue'
import RecommendationsView from '../views/RecommendationsView.vue'
import UserCategoryView from "@/views/UserCategoriesView.vue";
import { useOpenResearchStore } from '@/stores/openResearch';
import { watch } from 'vue';
import { PiniaVuePlugin } from 'pinia';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        showSidebar: false,
        showSearchInSidebar: false,
        showRecommendationsInSidebar: false,
      }
    },

    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: {
        showSidebar: false,
        showSearchInSidebar: false,
        showRecommendationsInSidebar: false,
      }
    },

    {
      path: '/admin/user-categories',
      name: 'userCategories',
      component: UserCategoryView,
      meta: {
        showSidebar: false,
        showSearchInSidebar: false,
        showRecommendationsInSidebar: false,
      }
    },

    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        showSidebar: false,
        showSearchInSidebar: false,
        showRecommendationsInSidebar: false,
      }
    },

    {
      path: '/research',
      name: 'researchOverview',
      component: ResearchOverviewView,
      meta: {
        showSidebar: false,
        showSearchInSidebar: false,
        showRecommendationsInSidebar: false,
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
        showRecommendationsInSidebar: true,
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
        showRecommendationsInSidebar: true,
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
        showSidebar: true,
        showSearchInSidebar: true,
        showRecommendationsInSidebar: false,
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
    console.error("ERROR")
    console.log(cookies.get("lara-token"))
    return { name: 'login' };
  }
  if (to.name === 'login' && cookies.get("lara-token")) {
    return from;
  }
});

export default router;
