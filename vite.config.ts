import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteTsconfigPaths(),
    svgr({
      include: '**/*.svg?react',
    }),
  ],
  server: {
    //host: "127.0.0.1",
    host: "0.0.0.0", // Change this to your IP address 

    port: 3000,
  },
  define: {
    'process.platform': JSON.stringify(process.platform),
    'process.env': {}
  },
});
