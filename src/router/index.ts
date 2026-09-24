import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useConfigStore } from "@/stores/config";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/dashboard",
    component: () => import("@/layouts/default-layout/DefaultLayout.vue"),
    meta: {
      middleware: "auth",
    },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/views/Dashboard.vue"),
        meta: {
          pageTitle: "Dashboard",
          breadcrumbs: ["Dashboards"],
        },
      },
      {
        path: "/profile",
        name: "profile-overview",
        component: () => import("@/views/profile/Settings.vue"),
        meta: {
          pageTitle: "Account Settings",
          breadcrumbs: ["Profile", "Overview"],
        },
      },

      {
        path: "/clients/clients-listing",
        name: "clients-listing",
        component: () => import("@/views/apps/clients/ClientList.vue"),
        meta: {
          pageTitle: "Clients Listing",
          breadcrumbs: ["Clients"],
        },
      },
      {
        path: "/clients/create",
        name: "client-create",
        component: () => import("@/views/apps/clients/ClientCreate.vue"),
        meta: {
          pageTitle: "Add Client",
          breadcrumbs: ["Clients"],
        },
      },
      {
        path: "/clients/edit/:id",
        name: "client-edit",
        component: () => import("@/views/apps/clients/ClientEdit.vue"),
        meta: {
          pageTitle: "Edit Client",
          breadcrumbs: ["Clients"],
        },
      },
      {
        path: "/clients/details/:id",
        name: "client-details",
        component: () => import("@/views/apps/clients/ClientDetails.vue"),
        meta: {
          pageTitle: "Client Details",
          breadcrumbs: ["Clients", "Details"],
        },
      },
      {
        path: "/addresses/addresses-listing",
        name: "addresses-listing",
        component: () => import("@/views/apps/addresses/AddressList.vue"),
        meta: {
          pageTitle: "Addresses",
          breadcrumbs: ["Addresses"],
        },
      },
      {
        path: "/addresses/create",
        name: "address-create",
        component: () => import("@/views/apps/addresses/AddressCreate.vue"),
        meta: {
          pageTitle: "Add Address",
          breadcrumbs: ["Addresses"],
        },
      },
      {
        path: "/addresses/edit/:id",
        name: "address-edit",
        component: () => import("@/views/apps/addresses/AddressEdit.vue"),
        meta: {
          pageTitle: "Edit Address",
          breadcrumbs: ["Addresses"],
        },
      },
      {
        path: "/addresses/details/:id",
        name: "address-details",
        component: () => import("@/views/apps/addresses/AddressDetails.vue"),
        meta: {
          pageTitle: "Address Details",
          breadcrumbs: ["Addresses", "Address Details"],
        },
      },

      {
        path: "/maids/maids-listing",
        name: "maids-listing",
        component: () => import("@/views/apps/maids/MaidList.vue"),
        meta: {
          pageTitle: "Maids",
          breadcrumbs: ["Maids"],
        },
      },
      {
        path: "/maids/create",
        name: "maid-create",
        component: () => import("@/views/apps/maids/MaidCreate.vue"),
        meta: {
          pageTitle: "Add Maid",
          breadcrumbs: ["Maids"],
        },
      },
      {
        path: "/maids/edit/:id",
        name: "maid-edit",
        component: () => import("@/views/apps/maids/MaidEdit.vue"),
        meta: {
          pageTitle: "Edit Maid",
          breadcrumbs: ["Maids"],
        },
      },
      {
        path: "/maids/details/:id",
        name: "maid-details",
        component: () => import("@/views/apps/maids/MaidDetails.vue"),
        meta: {
          pageTitle: "Maid Details",
          breadcrumbs: ["Maids", "Maid Details"],
        },
      },

      {
        path: "/admins/admins-listing",
        name: "admins-listing",
        component: () => import("@/views/apps/admins/AdminList.vue"),
        meta: {
          pageTitle: "Admins Listing",
          breadcrumbs: ["Admins"],
        },
      },
      {
        path: "/admins/create",
        name: "admin-create",
        component: () => import("@/views/apps/admins/AdminCreate.vue"),
        meta: {
          pageTitle: "Add Admin",
          breadcrumbs: ["Admins"],
        },
      },
      {
        path: "/admins/edit/:id",
        name: "admin-edit",
        component: () => import("@/views/apps/admins/AdminEdit.vue"),
        meta: {
          pageTitle: "Edit Admin",
          breadcrumbs: ["Admins"],
        },
      },
      {
        path: "/roles/roles-listing",
        name: "roles-listing",
        component: () => import("@/views/apps/roles/RoleList.vue"),
        meta: {
          pageTitle: "Roles Listing",
          breadcrumbs: ["Roles"],
        },
      },
      {
        path: "/roles/details/:id",
        name: "role-details",
        component: () => import("@/views/apps/roles/RoleDetails.vue"),
        meta: {
          pageTitle: "Role Details",
          breadcrumbs: ["Roles"],
        },
      },
      {
        path: "/roles/create",
        name: "role-create",
        component: () => import("@/views/apps/roles/RoleFormPage.vue"),
        meta: {
          pageTitle: "Add Role",
          breadcrumbs: ["Roles"],
        },
      },
      {
        path: "/roles/edit/:id",
        name: "role-edit",
        component: () => import("@/views/apps/roles/RoleFormPage.vue"),
        meta: {
          pageTitle: "Edit Role",
          breadcrumbs: ["Roles"],
        },
      },
      {
        path: "/locations/governorates",
        name: "governorates-listing",
        component: () => import("@/views/apps/locations/GovernorateList.vue"),
        meta: {
          pageTitle: "Governorates",
          breadcrumbs: ["Locations", "Governorates"],
        },
      },
      {
        path: "/locations/governorates/create",
        name: "governorate-create",
        component: () =>
          import("@/views/apps/locations/governorates/GovernorateCreate.vue"),
        meta: {
          pageTitle: "Add Governorate",
          breadcrumbs: ["Locations", "Governorates"],
        },
      },
      {
        path: "/locations/governorates/edit/:id",
        name: "governorate-edit",
        component: () =>
          import("@/views/apps/locations/governorates/GovernorateEdit.vue"),
        meta: {
          pageTitle: "Edit Governorate",
          breadcrumbs: ["Locations", "Governorates"],
        },
      },
      {
        path: "/locations/areas",
        name: "areas-listing",
        component: () => import("@/views/apps/locations/AreaList.vue"),
        meta: {
          pageTitle: "Areas",
          breadcrumbs: ["Locations", "Areas"],
        },
      },
      {
        path: "/locations/areas/create",
        name: "area-create",
        component: () => import("@/views/apps/locations/areas/AreaCreate.vue"),
        meta: {
          pageTitle: "Add Area",
          breadcrumbs: ["Locations", "Areas"],
        },
      },
      {
        path: "/locations/areas/edit/:id",
        name: "area-edit",
        component: () => import("@/views/apps/locations/areas/AreaEdit.vue"),
        meta: {
          pageTitle: "Edit Area",
          breadcrumbs: ["Locations", "Areas"],
        },
      },

      {
        path: "/settings",
        name: "system-settings",
        component: () => import("@/views/apps/settings/Settings.vue"),
        meta: {
          pageTitle: "System Settings",
          breadcrumbs: ["Settings"],
        },
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/AuthLayout.vue"),
    children: [
      {
        path: "/sign-in",
        name: "sign-in",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/SignIn.vue"),
        meta: {
          pageTitle: "Sign In",
        },
      },

      {
        path: "/password-reset",
        name: "password-reset",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/PasswordReset.vue"),
        meta: {
          pageTitle: "Password reset",
        },
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/SystemLayout.vue"),
    children: [
      {
        // the 404 route, when none of the above matches
        path: "/404",
        name: "404",
        component: () => import("@/views/crafted/authentication/Error404.vue"),
        meta: {
          pageTitle: "Error 404",
        },
      },
      {
        path: "/403",
        name: "403",
        component: () => import("@/views/crafted/authentication/Error403.vue"),
        meta: {
          pageTitle: "Error 403",
        },
      },
      {
        path: "/500",
        name: "500",
        component: () => import("@/views/crafted/authentication/Error500.vue"),
        meta: {
          pageTitle: "Error 500",
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to) {
    // If the route has a hash, scroll to the section with the specified ID; otherwise, scroll to the top of the page.
    if (to.hash) {
      return {
        el: to.hash,
        top: 80,
        behavior: "smooth",
      };
    } else {
      return {
        top: 0,
        left: 0,
        behavior: "smooth",
      };
    }
  },
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const configStore = useConfigStore();

  // current page view title
  document.title = `${to.meta.pageTitle} - ${import.meta.env.VITE_APP_NAME}`;

  // reset config to initial state
  configStore.resetLayoutConfig();

  // verify auth token before each page change
  authStore.verifyAuth();

  // before page access check if page requires authentication
  if (to.meta.middleware == "auth") {
    if (authStore.isAuthenticated) {
      next();
    } else {
      next({ name: "sign-in" });
    }
  } else {
    next();
  }
});

export default router;
