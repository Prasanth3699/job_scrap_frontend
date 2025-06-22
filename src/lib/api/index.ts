// Core API services
export * from "./services/auth";
export * from "./services/jobs";
export * from "./services/job-sources";
export * from "./services/profile";
export * from "./services/settings";
export * from "./services/stats";

// ML and LLM services
export * from "./services/ml";
export * from "./services/ml-analytics";
export * from "./services/llm";

// Export gateway and endpoints for direct access if needed
export {
  coreApi,
  mlApi,
  llmApi,
  makeGatewayUrl,
  makeWebSocketUrl,
  checkGatewayHealth,
} from "./gateway";
export * from "./endpoints";

export { SERVICE_PATHS } from "../config/service-paths";

// export * from "./axios-instance";
// export * from "./auth-api";
// export * from "./settings-api";
// export * from "./stats-api";
// export * from "./jobs-api";
// export * from "./job-source-api";
