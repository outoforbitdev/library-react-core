import type { StorybookConfig } from "@storybook/react-webpack5";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-webpack5-compiler-swc", "@storybook/addon-docs"],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  /**
   * Storybook 10 bundles css-loader 7, which defaults CSS modules to named
   * exports only. The components use default imports
   * (`import styles from "./x.module.css"`), so restore the css-loader 6
   * behavior of exposing the class map as the default export with class names
   * kept as written (css-loader 7 camelCases them when namedExport is false).
   */
  webpackFinal: async (webpackConfig) => {
    for (const rule of webpackConfig.module?.rules ?? []) {
      if (!rule || typeof rule !== "object" || !Array.isArray(rule.use)) {
        continue;
      }
      for (const use of rule.use) {
        if (
          use &&
          typeof use === "object" &&
          typeof use.loader === "string" &&
          use.loader.includes("css-loader")
        ) {
          use.options = {
            ...(typeof use.options === "object" ? use.options : {}),
            modules: {
              auto: true,
              namedExport: false,
              exportLocalsConvention: "as-is",
            },
          };
        }
      }
    }
    return webpackConfig;
  },
};
export default config;
