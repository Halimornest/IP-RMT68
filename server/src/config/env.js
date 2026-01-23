import dotenv from "dotenv";

dotenv.config();

function required(key) {
  if (!process.env[key]) {
    throw new Error(`Missing required env variable: ${key}`);
  }
  return process.env[key];
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,

  db: {
    host: required("DB_HOST"),
    name: required("DB_NAME"),
    user: required("DB_USER"),
    pass: required("DB_PASS"),
  },

  jwtSecret: required("JWT_SECRET"),

  openaiApiKey: required("OPENAI_API_KEY"),
};
