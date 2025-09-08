import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import sourcemaps from "rollup-plugin-sourcemaps2";

const packageJson = require("./package.json");

export default [
  // --- JS + CSS bundle ---
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      // 🔑 make sure CSS is handled before resolve()
      postcss({
        extract: false, // creates a .css file in dist
        minimize: true, // optional, minify CSS
      }),
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      terser(),
      sourcemaps(),
    ],
    external: ["react", "react-dom"],
  },

  // --- Type declarations bundle ---
  {
    input: "src/index.ts",
    output: [{ file: "dist/types.d.ts", format: "es" }],
    plugins: [
      dts.default({
        respectExternal: true, // avoids bundling css/types
      }),
    ],
    external: [
      "react",
      "react-dom",
      /\.css$/,
      "@types/react",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
    ],
  },
];
