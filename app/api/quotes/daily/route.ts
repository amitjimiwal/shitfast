import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/db'; // Adjust the import based on your project structure
export async function GET() {
     try {
          const currentDayQuotes = await prisma.featuredQuote.findMany({
               include: {
                    quote: true
               },
               orderBy: {
                    featuredDate: 'desc'
               }
          });
          const total = currentDayQuotes.length;
          if (total === 1) {
               return NextResponse.json({
                    success: true,
                    quoteOftheDay: currentDayQuotes[0].quote,
                    previousGems: [],
                    message: 'Quotes fetched successfully',
               }, { status: 200 });
          } else if (total === 0) {
               return NextResponse.json({
                    success: true,
                    quoteOftheDay: null,
                    previousGems: [],
                    message: 'No quotes posted for today'
               }, { status: 404 });
          }
          return NextResponse.json({
               success: true, quoteOftheDay: currentDayQuotes[0],
               previousGems: currentDayQuotes.slice(1, 4).map((quote) => quote.quote),
               message: 'Quotes fetched successfully',
          }, {
               status: 200
          });
     } catch (error) {
          if (process.env.NODE_ENV === 'development') {
               console.error('Error fetching daily quote:', error);
          }
          return NextResponse.json({
               success: false,
               error: 'Failed to fetch daily quote'
          }, { status: 500 });
     }
}