import type { MenuItem } from "@/layouts/default-layout/config/types";

const MainMenuConfig: Array<MenuItem> = [
  {
    pages: [
      {
        heading: "dashboard",
        route: "/dashboard",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-app-indicator",
      },
    ],
  },

  {
    heading: "User Management",
    route: "/clients",
    pages: [
      {
        heading: "clients",
        route: "/clients/clients-listing",
        keenthemesIcon: "profile-user",
        bootstrapIcon: "bi-people",
        permission: "client",
      },
      {
        heading: "addresses",
        route: "/addresses/addresses-listing",
        keenthemesIcon: "geolocation",
        bootstrapIcon: "bi-geo-alt",
        permission: "address",
      },
      {
        heading: "maids",
        route: "/maids/maids-listing",
        keenthemesIcon: "user",
        bootstrapIcon: "bi-person-heart",
        permission: "maid",
      },
    ],
  },

  {
    heading: "Platform Settings",
    route: "/settings",
    pages: [
      {
        heading: "admins",
        route: "/admins/admins-listing",
        keenthemesIcon: "security-user",
        bootstrapIcon: "bi-person-badge",
        permission: "admin",
      },
      {
        heading: "roles",
        route: "/roles/roles-listing",
        keenthemesIcon: "element-7",
        bootstrapIcon: "bi-shield-lock",
        permission: "role",
      },
      {
        heading: "governorates",
        route: "/locations/governorates",
        keenthemesIcon: "geolocation",
        bootstrapIcon: "bi-geo-alt",
        permission: "governorate",
      },
      {
        heading: "areas",
        route: "/locations/areas",
        keenthemesIcon: "map",
        bootstrapIcon: "bi-pin-map",
        permission: "area",
      },
      {
        heading: "settings",
        route: "/settings",
        keenthemesIcon: "setting-2",
        bootstrapIcon: "bi-gear-fill",
        permission: "setting",
      },
    ],
  },
];

export default MainMenuConfig;
