import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function proxyRequest(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const targetPath = path.join("/");
  const url = new URL(`/${targetPath}`, BACKEND_URL);
  url.search = req.nextUrl.search;

  const headers = new Headers(req.headers);
  headers.delete("host");

  const init: RequestInit = {
    method: req.method,
    headers,
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.text();
  }

  const backendRes = await fetch(url.toString(), init);

  const resHeaders = new Headers();
  backendRes.headers.forEach((value, key) => {
    // Forward all headers including Set-Cookie
    if (key.toLowerCase() === "transfer-encoding") return;
    resHeaders.append(key, value);
  });

  const body = backendRes.body;

  return new NextResponse(body, {
    status: backendRes.status,
    headers: resHeaders,
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PATCH = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
