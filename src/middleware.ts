import { NextRequest, NextResponse } from "next/server";
import { rateLimiter } from "./lib/rate-limiter";

export async function middleware(req: NextRequest) {
  const ip = req.ip ?? "127.0.0.1";
  try {
    const res = await rateLimiter.limit(ip);
    if (!res.success) {
      return new NextResponse("You are writing messages too fast");
    }
    return NextResponse.next();
  } catch (err) {
    console.log(err);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}

export const config = {
  matcher: "/api/message/:path*",
};
