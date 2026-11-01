import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_wedding_timeline_orchestrator_2026',
  NODE_ENV: process.env.NODE_ENV || 'development',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  CORS_ORIGIN: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173', 'http://localhost:8080', 'http://localhost:3000'],
  // n8n Integration Configuration
  N8N_MCP_URL: process.env.N8N_MCP_URL || 'https://mand.app.n8n.cloud/mcp-server/http',
  N8N_MCP_TOKEN: process.env.N8N_MCP_TOKEN || '',
  N8N_CUSTOMER_WEBHOOK_URL: process.env.N8N_CUSTOMER_WEBHOOK_URL || '',
  N8N_VENDOR_WEBHOOK_URL: process.env.N8N_VENDOR_WEBHOOK_URL || '',
  N8N_ORGANIZER_WEBHOOK_URL: process.env.N8N_ORGANIZER_WEBHOOK_URL || '',
  N8N_WEBHOOK_BEARER_TOKEN: process.env.N8N_WEBHOOK_BEARER_TOKEN || '',
};
