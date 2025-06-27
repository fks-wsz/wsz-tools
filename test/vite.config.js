import { defineConfig } from 'vite';
import path from 'path';

const SCRIPT_PATH = path.resolve(__dirname, './script');

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        browser: path.resolve(SCRIPT_PATH, 'browser', 'index.html'),
      },
    },
  },
});
