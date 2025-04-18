import { NextResponse, type NextRequest } from 'next/server'

// Limit the middleware to paths starting with `/api/`
export const config = {
     matcher: '/api/:function*',
}
const limit = 10; // Limiting requests to 5 per minute per IP
const windowMs = 60 * 1000; // 1 minute

interface RateLimitParams {
     count: number;
     lastRequest: number; // Using number for timestamp
}

const rateLimiterMap = new Map<string, RateLimitParams>();

export function middleware(request: NextRequest) {
     // Get the IP
     const ip = request.headers.get('x-forwarded-for');
     if (!ip) {
          return NextResponse.json({
               success: false,
               error: 'Invalid Request from Suspicious IP',
          }, { status: 400 });
     }

     const now = Date.now();

     if (!rateLimiterMap.has(ip)) {
          rateLimiterMap.set(ip, {
               count: 1,
               lastRequest: now,
          });
          return NextResponse.next();
     }

     const ipData = rateLimiterMap.get(ip);
     if (!ipData) {
          rateLimiterMap.set(ip, {
               count: 0,
               lastRequest: now,
          });
          return NextResponse.next();
     }

     // Reset counter if window has passed
     if (now - ipData.lastRequest > windowMs) {
          ipData.count = 0;
          ipData.lastRequest = now;
     }

     // Check rate limit
     if (ipData.count >= limit) {
          return NextResponse.json(
               { success: false, error: 'Too Many Requests' },
               { status: 429 }
          );
     }

     // Increment counter
     ipData.count += 1;
     ipData.lastRequest = now;

     return NextResponse.next();
}