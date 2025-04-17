import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/db'; // Adjust the import based on your project structure
export async function GET() {
     try {
          const featuredQuote = await prisma.featuredQuote.findFirst({
               include: {
                    quote: true
               },
               orderBy: {
                    featuredDate: 'desc'
               }
          });
          if (!featuredQuote) {
               return NextResponse.json({
                    success: false,
                    error: 'No featured quote found'
               }, { status: 404 });
          }
          //refactor
          const { id, text, authorUsername, approved, featuredDate, bio } = featuredQuote?.quote;
          return NextResponse.json({
               success: true, quipOftheDay: {
                    id,
                    text,
                    authorUsername,
                    approved,
                    featuredDate,
                    bio,
               },
               message: 'Quip fetched successfully',
          }, {
               status: 200
          });
     } catch (error) {
          if (process.env.NODE_ENV === 'development') {
               console.error('Error fetching daily Quip:', error);
          }
          return NextResponse.json({
               success: false,
               error: 'Failed to fetch daily Quip'
          }, { status: 500 });
     }
}