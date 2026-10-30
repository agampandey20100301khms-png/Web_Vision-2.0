import { defineConfig } from "vite";
import collegeInfoHandler from "./api/college-info.js";
import noticesHandler from "./api/notices.js";

export default defineConfig({
  plugins: [
    {
      name: "mait-notice-api",
      configureServer(server) {
        server.middlewares.use("/api/notices", noticesHandler);
        server.middlewares.use("/api/college-info", collegeInfoHandler);
      },
    },
  ],
});
