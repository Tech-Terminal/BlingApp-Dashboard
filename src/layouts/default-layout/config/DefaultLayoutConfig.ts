import type LayoutConfigTypes from "@/layouts/default-layout/config/types";

const config: LayoutConfigTypes = {
  general: {
    mode: "light",
    iconsType: "duotone",
  },
  main: {
    type: "default",
    primaryColor: "#085E5E",
    logo: {
      dark: "media/white_logo.svg",
      light: "media/logo.svg",
    },
  },
  illustrations: {
    set: "sketchy-1",
  },
  scrollTop: {
    display: true,
  },
  header: {
    display: true,
    menuIcon: "keenthemes",
    width: "fluid",
    fixed: {
      desktop: true,
      tabletAndMobile: true,
    },
  },
  toolbar: {
    display: true,
    width: "fluid",
    fixed: {
      desktop: true,
      tabletAndMobile: true,
    },
  },
  pageTitle: {
    display: true,
    breadcrumb: true,
    direction: "column",
  },
  aside: {
    display: true,
    theme: "dark",
    fixed: true,
    menuIcon: "keenthemes",
    minimized: false,
    minimize: true,
    hoverable: true,
  },
  content: {
    width: "fixed",
  },
  footer: {
    width: "fluid",
  },
};

export default config;
