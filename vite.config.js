import { defineConfig, loadEnv } from "vite";
import collegeInfoHandler from "./api/college-info.js";
import noticesHandler from "./api/notices.js";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  for (const key of ["FREE_LLM_BASE_URL", "FREE_LLM_MODEL", "FREE_LLM_API_KEY"]) {
    if (!process.env[key] && env[key]) process.env[key] = env[key];
  }

  return {
    plugins: [
      {
        name: "mait-notice-api",
        configureServer(server) {
          server.middlewares.use("/api/notices", noticesHandler);
          server.middlewares.use("/api/college-info", collegeInfoHandler);
        },
      },
    ],
  };
});
