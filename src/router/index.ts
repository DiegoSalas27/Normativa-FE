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
    children: [
      {
        path: '',
        name: 'Main',
        props: true,
        component: () => import("../views/Main.vue"),
      },
      {
        path: "profile/:id?",
        name: "Profile",
        props: true,
        component: () => import("../views/UserProfile.vue"),
      },
      {
        path: 'alta-gerencia',
        name: 'AltaGerencia',
        props: true,
        component: () => import("../views/ListUser.vue"),
      },
      {
        path: 'analistas',
        name: 'Analistas',
        props: true,
        component: () => import("../views/ListUser.vue"),
      },
      {
        path: 'profile/jefe-de-riesgos/:id?',
        name: 'ProfileJefeRiesgos',
        props: true,
        component: () => import("../views/UserProfile.vue"),
      },
      {
        path: `profile/alta-gerencia/:id?`,
        name: 'ProfileAltaGerencia',
        props: true,
        component: () => import("../views/UserProfile.vue"),
      },
      {
        path: `profile/analista/:id?`,
        name: 'ProfileAnalista',
        props: true,
        component: () => import("../views/UserProfile.vue"),
      },
    ]
  },
  {
    path: '/evaluacion/:id?',
    name: urlConstants.REALIZAR_PRUEBA,
    props: true,
    component: () => import("../views/Evaluacion.vue"),
  },
  {
    path: '/evaluacion/:ev_codigo/prueba/nuevo',
    name: 'PruebaNuevo',
    component: () => import("../views/Prueba.vue"),
  },
  {
    path: '/evaluacion/:ev_codigo/prueba/:pr_codigo?',
    name: 'Prueba',
    component: () => import("../views/Prueba.vue"),
  },
  // {
  //   path: '/prueba',
  //   name: urlConstants.REALIZAR_PRUEBA_EVALUACION,
  //   component: () => import("../views/Prueba.vue"),
  // },
  {
    path: '/:notFound(.*)',
    redirect: '/',
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
