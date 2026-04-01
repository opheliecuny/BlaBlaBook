import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function proxyRequest(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
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

    if (req.method !== "GET" && req.method !== "HEAD" && req.method !== "OPTIONS") {
      init.body = await req.text();
    }

    const backendRes = await fetch(url.toString(), init);

    const resHeaders = new Headers();
    backendRes.headers.forEach((value, key) => {
      if (key.toLowerCase() === "transfer-encoding") return;
      resHeaders.append(key, value);
    });

    const body = backendRes.body;

    return new NextResponse(body, {
      status: backendRes.status,
      headers: resHeaders,
    });
  } catch {
    return NextResponse.json(
      { message: "Backend unavailable" },
      { status: 502 }
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PATCH = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
export const OPTIONS = proxyRequest;
