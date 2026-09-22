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
    heading: "Company Management",
    route: "/companies",
    pages: [
      {
        route: "/companies/companies-listing",
        keenthemesIcon: "briefcase",
        bootstrapIcon: "bi-building",
        permission: "company",
      },
      {
        heading: "Company Requests",
        route: "/companies/requests",
        keenthemesIcon: "document",
        bootstrapIcon: "bi-file-earmark-text",
        permission: "company_request",
      },
    ],
  },

  {
    heading: "Medical Core",
    route: "/active-ingredients",
    pages: [
      {
        heading: "Warning Guides",
        route: "/warning-guides",
        keenthemesIcon: "message-text-2",
        bootstrapIcon: "bi-exclamation-triangle",
        permission: "warning_guide",
      },
      {
        heading: "Active Ingredient Categories",
        route: "/active-ingredient-categories",
        keenthemesIcon: "category",
        bootstrapIcon: "bi-tags",
        permission: "active_ingredient_category",
      },
      {
        route: "/symptoms",
        keenthemesIcon: "virus",
        bootstrapIcon: "bi-activity",
        permission: "symptom",
      },
      {
        route: "/chronic-conditions",
        keenthemesIcon: "pulse",
        bootstrapIcon: "bi-heart-pulse",
        permission: "chronic_condition",
      },
    ],
  },

  {
    heading: "Pharmaceutical Data",
    route: "/active-ingredients",
    pages: [
      {
        route: "/active-ingredients",
        keenthemesIcon: "capsule",
        bootstrapIcon: "bi-capsule",
        permission: "active_ingredient",
      },
      {
        route: "/medicines",
        keenthemesIcon: "pill",
        bootstrapIcon: "bi-prescription2",
        permission: "medicine",
      },
      {
        route: "/drug-interactions",
        keenthemesIcon: "shield-slash",
        bootstrapIcon: "bi-shield-slash",
        permission: "drug_interaction",
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
