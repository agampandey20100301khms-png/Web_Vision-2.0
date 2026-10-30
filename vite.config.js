import { defineConfig } from "vite";
import noticesHandler from "./api/notices.js";

export default defineConfig({
  plugins: [
    {
      name: "mait-notice-api",
      configureServer(server) {
        server.middlewares.use("/api/notices", noticesHandler);
      },
    },
  ],
});
