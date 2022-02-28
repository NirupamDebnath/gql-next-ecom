import * as esbuild from "esbuild";

// Automatically exclude all node_modules from the bundled version
// const { nodeExternalsPlugin } = require('esbuild-node-externals');

esbuild
  .build({
    entryPoints: ["./index.ts"],
    outfile: "build/index.js",
    bundle: true,
    minify: true,
    platform: "node",
    sourcemap: true,
    target: "node16",
    treeShaking: true,
    // plugins: [nodeExternalsPlugin()],
    plugins: [],
  })
  .catch(() => process.exit(1));
