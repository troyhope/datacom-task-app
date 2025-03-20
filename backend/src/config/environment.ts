type EnvironmentConfig = {
  apiUrl: string;
  environment: "development" | "production";
};

const configs: Record<string, EnvironmentConfig> = {
  development: {
    apiUrl: "http://localhost:3001",
    environment: "development",
  },
  production: {
    apiUrl: "https://zbs1g2yu7i.execute-api.ap-southeast-2.amazonaws.com/dev",
    environment: "production",
  },
};

const currentEnv = process.env.NODE_ENV || "development";
export const config = configs[currentEnv];
