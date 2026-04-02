export const config = {
  port: parseInt(process.env.PORT || "3000"),
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(",").map(s => s.trim()) || "*",
  jwtSecret: process.env.JWT_SECRET || "jwt-secret"
};