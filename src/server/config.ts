import { execSync } from "child_process";
import dotenv = require("dotenv")
dotenv.config()

export const PORT = parseInt(process.env.BACK_PORT || "3000")

export const HOST = process.env.VIRTUAL_HOST || "localhost:"+PORT
export const HTTPS_ENABLED = !!process.env.HTTPS_ENABLED
export const BASE_URL = (HTTPS_ENABLED ? "https" : "http") + "://" + HOST

export const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost/quesdon"
// export const REDIS_URL = process.env.REDIS_URL || "redis://localhost"

export const SECRET_KEY = process.env.SECRET_KEY || "shibuyarin16544"

export var GIT_COMMIT = execSync("git rev-parse HEAD").toString().trim()

export const PUSHBULLET_CLIENT_ID = process.env.PUSHBULLET_CLIENT_ID
export const PUSHBULLET_CLIENT_SECRET = process.env.PUSHBULLET_CLIENT_SECRET