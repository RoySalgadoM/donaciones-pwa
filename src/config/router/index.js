import { createRouter, createWebHistory } from "vue-router";
import Login from "@/modules/auth/pages/Login.vue";

import MainBoard from "@/kernel/layouts/Mainboard.vue";
import Employees from "@/modules/employees/pages/Query.vue";
import Products from "@/modules/products/pages/Query.vue";
import Stores from "@/modules/stores/pages/Query.vue";
import Neighborhoods from "@/modules/neighborhood/pages/Query.vue";
import Pickups from "@/modules/pickups/pages/Query.vue";
import Deliveries from "@/modules/delivery/pages/Query.vue";
import Profile from "@/modules/profile/pages/Query.vue";

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
      component: MainBoard,
      children: [
        {
          path: "usuarios",
          children: [
            {
              path: "query",
              name: "queryUser",
              component: Employees,
            },
          ],
        },
        {
          path: "productos",
          children: [
            {
              path: "query",
              name: "queryProduct",
              component: Products,
            },
          ],
        },
        {
          path: "tiendas",
          children: [
            {
              path: "query",
              name: "queryStore",
              component: Stores,
            },
          ],
        },
        {
          path: "colonias",
          children: [
            {
              path: "query",
              name: "queryNeighborhood",
              component: Neighborhoods,
            },
          ],
        },
        {
          path: "recolecciones",
          children: [
            {
              path: "query",
              name: "queryPickups",
              component: Pickups,
            },
          ],
        },
        {
          path: "repartos",
          children: [
            {
              path: "query",
              name: "queryDeliveries",
              component: Deliveries,
            },
          ],
        },
        {
          path: "perfil",
          children: [
            {
              path: "query",
              name: "queryProfile",
              component: Profile,
            },
          ],
        },
      ],
      meta: {
        privilege: true,
      },
    },
  ],
});

export default router;
