import { i18nMiddleware } from "./middlewares/i18nMiddleware";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  return i18nMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};