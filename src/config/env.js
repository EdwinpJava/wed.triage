import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT || 3000),
  nodeEnv: process.env.NODE_ENV || 'development',
  sessionSecret: process.env.SESSION_SECRET || 'tramed-dev-secret',
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/tramed?schema=public',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  aiProvider: process.env.AI_PROVIDER || 'demo',
  aiApiKey: process.env.AI_API_KEY || '',
  aiModel: process.env.AI_MODEL || 'gpt-4o-mini',
};
