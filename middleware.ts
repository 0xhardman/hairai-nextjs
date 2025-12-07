import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Free version - no payment middleware
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}
