import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
// import json from "@rollup/plugin-json";
// import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
// import polyfillNode from 'rollup-plugin-polyfill-node'
// import typescript from '@rollup/plugin-typescript';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // json(),
    react(),
    // commonjs(),
    resolve(),
    // typescript()
    // polyfillNode(),
  ],
  server: {
    port: 8080
  },
  build: {
    rollupOptions: {
      output: {
        mimeType: "module",
      },
    },
  },
});

