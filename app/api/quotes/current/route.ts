import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/db';
export async function GET() {
     try {
          const currentDayQuotes = await prisma.quote.findMany({
               where: {
                    approved: true,
                    author:'User',
                    submittedAt: {
                         gte: new Date(new Date().setHours(0, 0, 0, 0)),
                         lt: new Date(new Date().setHours(23, 59, 59, 999))
                    }
               },
               orderBy: {
                    submittedAt: 'desc'
               }
          });

          if (!currentDayQuotes) {
               return NextResponse.json({
                    success: true,
                    data: [],
                    error: 'No quotes posted for today'
               }, { status: 404 });
          }
          return NextResponse.json({ success: true, data: currentDayQuotes });
     } catch (error) {
          if(process.env.NODE_ENV === 'development') {
               console.error('Error fetching daily quote:', error);
          }
          return NextResponse.json({
               success: false,
               error: 'Failed to fetch daily quote'
          }, { status: 500 });
     }
}