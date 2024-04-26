import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface IPData {
  count: number;
  lastReset: number;
}

const rateLimitMap: Map<string, IPData> = new Map();
export function middleware(request: NextRequest) {
  const ip: any = request.headers.get("x-forwarded-for") || request.ip;
  const limit: number = 5; // Limiting requests to 5 per minute per IP
  const windowMs: number = 60 * 1000 * 24; // 1 minute
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, {
      count: 0,
      lastReset: Date.now(),
    });
  }
  const ipData: IPData = rateLimitMap.get(ip)!;

  if (Date.now() - ipData.lastReset > windowMs) {
    ipData.count = 0;
    ipData.lastReset = Date.now();
  }
  const response = NextResponse.next();
  const expirationTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  response.cookies.set("_chat", "fast", {
    expires: new Date(expirationTime),
  });

  if (ipData.count >= limit) {
    return NextResponse.json("Too Many Request");
  }
  ipData.count += 1;
  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/api/chat/:path*",
};
