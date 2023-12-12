import { createRouter, createWebHistory } from "vue-router";
import Login from "@/modules/auth/pages/Login.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Login",
      component: Login,
    },
    {
      path: "/donaciones",
      component: () => import("@/kernel/layouts/Mainboard.vue"),
      children: [
        {
          path: "usuarios",
          children: [
            {
              path: "query",
              name: "queryUser",
              component: () => import("@/modules/employees/pages/Query.vue"),
            },
          ],
        },
        {
          path: "productos",
          children: [
            {
              path: "query",
              name: "queryProduct",
              component: () => import("@/modules/products/pages/Query.vue"),
            },
          ],
        },
        {
          path: "tiendas",
          children: [
            {
              path: "query",
              name: "queryStore",
              component: () => import("@/modules/stores/pages/Query.vue"),
            },
          ],
        },
        {
          path: "colonias",
          children: [
            {
              path: "query",
              name: "queryNeighborhood",
              component: () => import("@/modules/neighborhood/pages/Query.vue"),
            },
          ],
        },
        {
          path: "recolecciones",
          children: [
            {
              path: "query",
              name: "queryPickups",
              component: () => import("@/modules/pickups/pages/Query.vue"),
            },
          ],
        },
        {
          path: "repartos",
          children: [
            {
              path: "query",
              name: "queryDeliveries",
              component: () => import("@/modules/delivery/pages/Query.vue"),
            },
          ],
        },
      ],
    },
  ],
});

export default router;
