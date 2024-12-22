import fs from "fs/promises";
import path from "path";
import postcss from "postcss";
import postcssModules from "postcss-modules";
import sass from "sass";
import { transform, Plugin } from "esbuild";

const cssModulesPlugin = (): Plugin => ({
  name: "css-modules-ssr",
  setup(build) {
    // Handle `.css` and `.scss` files
    build.onLoad({ filter: /\.(css|scss)$/ }, async (args) => {
      const isScss = path.extname(args.path) === ".scss";

      // Read the file content
      const source = await fs.readFile(args.path, "utf8");

      // Compile SCSS to CSS if necessary
      const cssContent = isScss
        ? (await sass.compileStringAsync(source)).css.toString()
        : source;

      let cssModuleMap = {};
      const postcssResult = await postcss([
        postcssModules({
          generateScopedName: "[name]__[local]___[hash:base64:5]", // Customizable class naming
          getJSON: (_, json) => {
            cssModuleMap = json;
          },
        }),
      ]).process(cssContent, { from: args.path });

      const processedCss = postcssResult.css;

      // Create a React component for injecting the processed CSS
      const componentCode = `
        import React from 'react';

        const CSSInjector = () => (
          <style dangerouslySetInnerHTML={{ __html: ${JSON.stringify(
            processedCss
          )} }} />
        );

        export { CSSInjector };
        export default ${JSON.stringify(cssModuleMap)};
      `;

      // Transform the React component into valid JS
      const result = await transform(componentCode, {
        loader: "tsx",
        sourcefile: args.path,
      });

      return {
        contents: result.code,
        loader: "tsx",
      };
    });
  },
});

export default cssModulesPlugin;
