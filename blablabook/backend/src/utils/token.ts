import crypto from "node:crypto";
import jwt from "jsonwebtoken"; 
// import type { User } from "../models/index.ts";
import { config } from "../../config.ts";

export function generateAuthenticationTokens(user: User) {
  const payload = {
    userId: user.id,
    role: user.role
  };
  
  const accessToken = jwt.sign(payload, config.jwtSecret, { expiresIn: "1h" }); 

  const refreshToken = crypto.randomBytes(128).toString("base64"); 

  return {
    accessToken: {
      token: accessToken,
      type: "Bearer",
      expiresInMS: 1 * 60 * 60 * 1000 // 1h
    },
    refreshToken: {
      token: refreshToken,
      type: "Bearer",
      expiresInMS: 7 * 24 * 60 * 60 * 1000 // 7j
    }
  };
}

