declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      ARWEAVE_WALLET_PRIVATE_KEY: string;
      ARWEAVE_WALLET_ADDRESS: string;
      ARWEAVE_START_BLOCK: string;
      ADMIN_SECRET: string;
      RELAY_API_KEY: string;
      RELAY_API_SECRET: string;
      REDIS_URL: string;
      ORGANIZATION_FACTORY_ADDRESS: string;
      GANACHE_SEED: string;
      GANACHE_URL: string;
      MONGO_URL: string;
    }
  }
}

export {};
