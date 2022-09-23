declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      ADMIN_SECRET: string;
      RELAY_API_KEY: string;
      RELAY_API_SECRET: string;
      COMMUNITY_FACTORY_ADDRESS: string;
      GANACHE_SEED: string;
      GANACHE_URL: string;
      MONGO_URL: string;
    }
  }
}

export {};
