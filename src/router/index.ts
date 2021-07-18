import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import { urlConstants } from "./../common/constants";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/auth",
    name: "Authentication",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Authentication.vue"),
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    props: true,
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Dashboard.vue"),
  },
  {
    path: "/profile",
    name: "Profile",
    props: true,
    component: () => import("../views/UserProfile.vue"),
  },
  {
    path: '/alta-gerencia',
    name: urlConstants.ALTA_GERENCIA,
    props: true,
    component: () => import("../views/ListUser.vue"),
  },
  {
    path: '/analistas',
    name: urlConstants.ANALISTAS,
    props: true,
    component: () => import("../views/ListUser.vue"),
  },
  {
    path: '/profile/jefe-de-riesgos/:id?',
    name: urlConstants.PROFILE_JEFE_DE_RIESGOS,
    props: true,
    component: () => import("../views/UserProfile.vue"),
  },
  {
    path: `/profile/alta-gerencia/:id?`,
    name: urlConstants.PROFILE_ALTA_GERENCIA,
    props: true,
    component: () => import("../views/UserProfile.vue"),
  },
  {
    path: `/profile/analista/:id?`,
    name: urlConstants.PROFILE_ANALISTA,
    props: true,
    component: () => import("../views/UserProfile.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
