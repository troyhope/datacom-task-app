type EnvironmentConfig = {
  apiUrl: string;
  environment: "development" | "production";
};

const configs: Record<string, EnvironmentConfig> = {
  development: {
    apiUrl: "http://localhost:3001", // Local development API
    environment: "development",
  },
  production: {
    apiUrl: "https://zbs1g2yu7i.execute-api.ap-southeast-2.amazonaws.com/dev", // Production API
    environment: "production",
  },
};

const currentEnv = import.meta.env.PROD ? "production" : "development";
export const config = configs[currentEnv];
