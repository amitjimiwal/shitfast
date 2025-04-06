import { NextResponse } from 'next/server';

export async function GET() {
     try {
          // In production, fetch from database:
          // const todaysQuote = await prisma.quote.findFirst({
          //   where: {
          //     featured: true,
          //     featuredDate: {
          //       gte: new Date(new Date().setHours(0, 0, 0, 0))
          //     }
          //   }
          // });

          // For demo purposes, return a sample quote
          const todaysQuote = {
               id: '1',
               text: "The best way to build a product is to start shipping on day one. Iterate relentlessly.",
               author: "Founder McShipFast",
               authorUsername: "foundermcship",
               submittedAt: new Date().toISOString(),
               approved: true,
               featured: true,
               featuredDate: new Date().toISOString(),
               score: 0.95
          };

          return NextResponse.json({ success: true, data: todaysQuote });
     } catch (error) {
          console.error('Error fetching daily quote:', error);
          return NextResponse.json({
               success: false,
               error: 'Failed to fetch daily quote'
          }, { status: 500 });
     }
}