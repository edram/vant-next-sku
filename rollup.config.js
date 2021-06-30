import path from "path";
import babel from "@rollup/plugin-babel";
import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/components/sku/index.ts",
  output: {
    format: "es",
    dir: "./lib",
    name: "index",
  },
  plugins: [
    typescript({
      tsconfig: path.resolve(__dirname, "tsconfig.json"),
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
        },
        include: ["components/**/*", "**/*.d.ts"],
      },
    }),
    babel({
      babelHelpers: "bundled",
      extensions: [".js", ".jsx", ".es6", ".es", ".mjs", ".tsx", ".ts"],
    }),
  ],
};
