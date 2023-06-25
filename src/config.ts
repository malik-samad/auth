import dotenv from "dotenv"

export const ENVIRONMENT = process.env.NODE_ENV || process.env.NODE_CONFIG_ENV || "production"

dotenv.config({ path: `.env.${ENVIRONMENT}` });

export const {
    AUTH_SECRET,
    MONGO_USER,
    MONGO_PASWWORD,
    MONGO_HOST,
    MONGO_DATABASE,
} = process.env

export const MONGO_CONNECTION_STRING = `mongodb+srv://${MONGO_USER}:${MONGO_PASWWORD}@${MONGO_HOST}/${MONGO_DATABASE}?retryWrites=true&w=majority`