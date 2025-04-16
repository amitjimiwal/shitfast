import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/db';
import { getPreviousDayValues } from '@/lib/func';
import { LLMQUOTEINPUT } from '@/lib/types/quote';
import { groq } from '@/lib/groq';
export async function GET() {
     try {
          const { startOfYesterday, endOfYesterday } = getPreviousDayValues();
          let quoteWithMaxScoreandMaxLikes = await prisma.quote.findMany({
               where: {
                    approved: true,
                    author: 'User',
                    submittedAt: {
                         gte: startOfYesterday,
                         lt: endOfYesterday,
                    }
               }
          });
          let LLMQuote: LLMQUOTEINPUT[] = [];
          if (!quoteWithMaxScoreandMaxLikes) {
               if (process.env.NODE_ENV === 'development') {
                    console.error('No quotes found for yesterday , using the seeded codes Now');
               }

               //TODO: Logic to Pick up the QUOTE FROM RANDOMSHIPS
               // If no quotes found for yesterday, use seeded quotes
               quoteWithMaxScoreandMaxLikes = await prisma.quote.findMany({
                    where: {
                         approved: true,
                         author: 'Seed',
                    }
               });
          }

          LLMQuote = quoteWithMaxScoreandMaxLikes.map((quote) => {
               const { text, authorUsername, email, bio, approved, featured } = quote;
               return {
                    id: quote.id,
                    text,
                    bio,
                    authorUsername,
                    email,
                    approved,
                    featured
               };
          });

          const bestQuote = await getBestQuote(LLMQuote);
          if (!bestQuote) {
               throw new Error('Failed to select best quote');
               //TODO: Logic to Pick up the QUOTE FROM RANDOMSHIPS
          }

          //get the quote from the database
          const quote = await prisma.quote.findUnique({
               where: {
                    id: bestQuote,
               },
          });
          if (!quote) {
               throw new Error('Quote not found');
               //TODO:THINK ABOUT A WORKAROUND
          }
          //add the quote in the featured quotes table
          await prisma.featuredQuote.create({
               data: {
                    quoteId: bestQuote,
                    featuredDate: new Date()
               }
          });

          //update the featured field and date in the quote table
          await prisma.quote.update({
               where: {
                    id: bestQuote,
               },
               data: {
                    featured: true,
                    featuredDate: new Date()
               }
          });
          return NextResponse.json({ success: true, message: "Cron Job Has Run successfully" });
     } catch (error) {
          console.error('Error in cron job', error);
          return NextResponse.json({
               success: false,
               error: 'Cron job has failed'
          }, { status: 500 });
     }
}
async function getBestQuote(quotes: LLMQUOTEINPUT[]): Promise<string | null> {
     try {
          const prompt = `
   You are a highly critical evaluator for a platform that delivers daily dopamine hits and actionable inspiration specifically for founders, makers, and builders obsessed with shipping products fast and delivering real value to users.
   
   You will be given an array of quotes in JSON format. 
   
   Task:
   - Select the SINGLE best quote from the list.
   - Output the id exactly as given in the input — no modifications.
   
   Selection Criteria (Extremely Strict):
   - The quote must *directly* align with these values:
      - Shipping products fast
      - Founder/maker mindset
      - Action over perfection
      - Iteration, learning from failure, user feedback
      - Building in public / transparency
      - Risk-taking and execution over ideas
      - Progress over polish
      - Solving real user problems
   
   Scoring Guidelines:
   - Only select a quote that would inspire a real founder or maker to stop reading and go build or ship something immediately.
   - Ignore generic life or success quotes.
   - Ignore fluffy motivational content.
   - Ruthlessly optimize for real-world builder energy.
   
   Output Format:
   Respond ONLY with the selected quote id — copy-paste exactly from the input without changes.
   
   Input Quotes:
   ${JSON.stringify(quotes, null, 2)}
   `;

          const completion = await groq.chat.completions.create({
               messages: [
                    {
                         role: "user",
                         content: prompt,
                    },
               ],
               model: "llama-3.3-70b-versatile",
          });

          const responseText = completion.choices[0].message.content?.trim() || "";

          return responseText;
     } catch (error) {
          console.error("Error evaluating quotes with LLM:", error);
          return null;
     }
}