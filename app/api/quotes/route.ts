import { prisma } from '@/lib/db/db';
import { NextRequest, NextResponse } from 'next/server';
import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: NextRequest) {
     try {
          // Extract data from request body
          const { username, quoteText, email, bio } = await request.json();
          // Validate input
          if (!username || !quoteText || !email || !bio) {
               if (process.env.NODE_ENV === 'development') {
                    console.error('Request body:', { username, quoteText, email, bio });
               }
               return NextResponse.json({
                    success: false,
                    error: 'Missing required fields: username, quoteText, email, bio',
               }, { status: 400 });
          }
          // Clean username (remove @ if present)
          const cleanUsername = username.startsWith('@') ? username.substring(1) : username;

          //check whether the email is already used for a quote for that particular day
          const currentDayQuotes = await prisma.quote.findMany({
               where: {
                    email,
                    submittedAt: {
                         gte: new Date(new Date().setHours(0, 0, 0, 0)),
                         lt: new Date(new Date().setHours(23, 59, 59, 999)),
                    },
               },
          });
          if (currentDayQuotes.length > 0) {
               if (process.env.NODE_ENV === 'development') {
                    console.error('Current day quote already submitted by the user', currentDayQuotes);
               }
               return NextResponse.json({
                    success: false,
                    error: 'You have already submitted a quote today. Please try again tomorrow.',
               }, { status: 400 });
          }
          const relevanceScore = await evaluateQuoteRelevance(quoteText);
          if (relevanceScore < 0.5) {
               return NextResponse.json({
                    success: false,
                    error: 'We encourage you to submit quotes that are more relevant to our community.',
               }, { status: 400 });
          }
          await prisma.quote.create({
               data: {
                    text: quoteText,
                    author: 'User',
                    authorUsername: cleanUsername,
                    email,
                    bio,
                    approved: relevanceScore > 0.7,
               },
          });

          return NextResponse.json({
               success: true,
               message: 'Quote submitted successfully',
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

async function evaluateQuoteRelevance(quoteText: string): Promise<number> {
     try {
          const prompt = `
You are evaluating a quote for a website designed to deliver daily dopamine hits and actionable inspiration specifically for founders, makers, and builders who are obsessed with shipping products fast and delivering real value to users.

Evaluate the following quote:
> "${quoteText}"

Score this quote from 0.0 to 1.0 based on how deeply and directly it aligns with the core themes and values of fast-paced product development and the founder/maker mindset.

Scoring Guidelines (Be Extremely Strict and Thoughtful):
- Only award high scores (0.8 - 1.0) to quotes that *directly* inspire action, execution, user empathy, iteration, speed, risk-taking, and a bias toward shipping over perfection.
- Medium scores (0.4 - 0.7) are for quotes that support entrepreneurial thinking or growth mindsets but lack direct relevance to building, shipping, or product execution.
- Low scores (0.0 - 0.3) are for generic quotes about life, success, or motivation that don’t speak specifically to building products, taking action, or serving users.
- A perfect score (1.0) should only be given to quotes that could directly motivate a founder to close their browser and go ship something immediately.

Core Themes to Consider:
- Shipping products fast
- Building user-first solutions
- Founder/maker mindset
- Action over perfection
- Speed, agility, and iteration
- Learning from failure and feedback
- Building in public / transparency
- Risk-taking and embracing uncertainty
- Crafting great user experiences
- Community-driven product building
- Solving real problems
- Execution over ideas
- Progress over polish

Scoring Format:
Respond with a single number between 0.0 and 1.0 — nothing else.

Be highly critical. Assume the reader is a no-nonsense founder or maker who cares about real-world building, not empty platitudes.
`;


          const completion = await groq.chat.completions
               .create({
                    messages: [
                         {
                              role: "user",
                              content: `${prompt} \n\n`,
                         },
                    ],
                    model: "llama-3.3-70b-versatile",
               })
          // Extract and parse the score
          const scoreText = completion.choices[0].message.content?.trim() || "0.5";
          const score = parseFloat(scoreText);

          // Ensure the score is within bounds
          return isNaN(score) ? 0.5 : Math.max(0, Math.min(1, score));
     } catch (error) {
          console.error('Error evaluating quote with LLM:', error);
          // Return a moderate score if evaluation fails
          return 0.5;
     }
}
