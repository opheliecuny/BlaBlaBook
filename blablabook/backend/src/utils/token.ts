import crypto from "node:crypto";
import jwt from "jsonwebtoken"; 
import { config } from "../../config";

export function generateAuthenticationTokens(user) {
  const payload = {
    userId: user.id,
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

