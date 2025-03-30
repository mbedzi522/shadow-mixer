
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Allow all connections and disable hostname verification for Tor compatibility
    strictPort: true,
    cors: true,
    hmr: {
      // Enable HMR over any protocol
      protocol: 'ws',
      // Allow HMR from any host
      host: 'localhost',
      clientPort: 8080
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Required for proper Tor operation - makes sure paths are relative
  base: './',
}));
