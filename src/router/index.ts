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
        path: 'jefe-de-riesgos',
        name: 'JefeRiesgos',
        props: true,
        component: () => import("../views/ListUser.vue"),
      },
      {
        path: 'lista-especialistas',
        name: 'ListaEspecialistas',
        props: true,
        component: () => import("../views/ListUser.vue"),
      },

      {
        path: 'especialistas',
        name: 'Especialistas',
        props: true,
        component: () => import("../views/ListVerification.vue"),
      },

      {
        path: 'evaluaciones',
        name: 'ModificarEvaluaciones',
        props: true,
        component: () => import("../views/ListEvaluacion.vue"),
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
        path: `profile/especialista/:id?`,
        name: 'ProfileEspecialista',
        props: true,
        component: () => import("../views/UserProfile.vue"),
      },
      {
        path: `profile/analista/:id?`,
        name: 'ProfileAnalista',
        props: true,
        component: () => import("../views/UserProfile.vue"),
      },
      {
        path: ' ',
        name: 'TableUser',
        alias: ['listas-verificacion'], // colocar cualquier url para este componente dinamico como alias
        component: () => import("../views/TableUser.vue"),
      },
      {
        path: 'listas-verificacion/:lvCodigo',
        name: 'ListasVerificacion',
        component: () => import("../views/ListaVerificacion.vue"),
      },
      {
        path: 'new/listas-verificacion',
        name: 'ListasVerificacionCrear',
        component: () => import("../views/ListaVerificacion.vue"),
      }
    ]
  },
  // {
  //   path: '/evaluacion/:id/registrar', <-- verificar como se desea ingresar a esta ruta
  //   name: urlConstants.REALIZAR_PRUEBA_REGISTRAR,
  //   props: true,
  //   component: () => import("../views/Evaluacion.vue"),
  // },
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
  {
    path: '/evaluacion/:ev_codigo/prueba/:pr_codigo/resumen',
    name: 'PruebaResultado',
    component: () => import("../views/EvaluacionResumen.vue"),
  },

  {
    path: '/plan-tratamiento/:tr_codigo?',
    name: 'PlanTratamiento',
    component: () => import("../views/PlanTratamiento.vue"),
  },
  {
    path: '/plan-tratamiento2/:tr_codigo?',
    name: 'PlanTratamiento2',
    component: () => import("../views/PlanTratamiento2.vue"),
  },

  {
    path: '/lista-verificacion/:lv_codigo/prueba/:pr_codigo/resumen',
    name: 'PruebaResumen',
    component: () => import("../views/PruebaResumen.vue"),
  },
  {
    path: '/accion-mitigacion/edicion/:acm_id',
    name: 'AccionMitigacion',
    component: () => import("../views/AccionMitigacion.vue"),
  },
  {
    path: '/resultado-evaluaciones',
    name: 'ResutadoEvaluaciones',
    component: () => import("../views/TableUser.vue"),
  },
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
