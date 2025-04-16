import { prisma } from "@/lib/db/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { SeedQuotePostSchema } from "@/lib/dto/dto";
export async function POST(request: NextRequest) {
     try {
          // Check if the request is from a bot
          const userAgent = request.headers.get('User-Agent');
          if (userAgent && userAgent.includes('bot')) {
               if (process.env.NODE_ENV === 'development') {
                    console.error('Request from bot:', userAgent);
               }
               return NextResponse.json({
                    success: false,
                    error: 'Bots are not allowed to submit quotes',
               }, { status: 403 });
          }
          //check the secret Key Pased in the Auth BEarare
          const authHeader = request.headers.get('Authorization');
          if (!authHeader || authHeader !== `Bearer ${process.env.SEED_SECRET}`) {
               if (process.env.NODE_ENV === 'development') {
                    console.error('Invalid or missing Authorization header');
               }
               return NextResponse.json({
                    success: false,
                    error: 'Invalid or missing Authorization header',
               }, { status: 401 });
          }

          //body parsing
          const body = await request.json();
          // Validate input using Zod schema
          const isValid = SeedQuotePostSchema.safeParse(body);

          if (!isValid.success) {
               if (process.env.NODE_ENV === 'development') {
                    console.error('Invalid request body:', isValid.data);
               }
               return NextResponse.json({
                    success: false,
                    error: isValid.data,
               }, { status: 400 });
          }
          const { username, quoteText, bio, email } = body;
          // Clean username (remove @ if present)
          const cleanUsername = username.startsWith('@') ? username.substring(1) : username;
          await prisma.quote.create({
               data: {
                    text: quoteText,
                    author: 'Seed',
                    authorUsername: cleanUsername,
                    email: email ? email : 'shit-anon@gmail.com',
                    bio,
                    approved: true,
               },
          });
          return NextResponse.json({
               success: true,
               message: 'Quote Seeded successfully',
          });
     } catch (error) {
          if (process.env.NODE_ENV === 'development') {
               console.error('Error processing quote submission:', error);
          }
          return NextResponse.json({
               success: false,
               error: 'Failed to process quote submission',
          }, { status: 500 });
     }
}