export default {
  plugins: {
    "postcss-rtlcss": {
      // Metronic sets dir="rtl" on html tag, so we want this to apply
      mode: "combined", // Or 'override' depending on how it's structured, 'combined' works well with Vue SFCs and global styles if dir="rtl" is used
      ignorePrefixedRules: false,
    },
  },
};
