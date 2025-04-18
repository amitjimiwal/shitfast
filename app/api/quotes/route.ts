import { prisma } from '@/lib/db/db';
import { NextRequest, NextResponse } from 'next/server';
import { groq } from '@/lib/groq';
import { QuotePostSchema } from '@/lib/dto/dto';
import sendMail from '@/lib/mail';
import { getQuoteSubmissionTemplate } from '@/lib/template/submit';
export async function POST(request: NextRequest) {
     try {
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
          //body parsing
          const body = await request.json();
          // Validate input using Zod schema
          const isValid = QuotePostSchema.safeParse(body);

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
          //check email and send email
          const responseEmailSent = await sendMail({
               to: email,
               subject: 'Wooo! Your Maxim is with us',
               html: getQuoteSubmissionTemplate(cleanUsername, quoteText),
          });
          if (!responseEmailSent.success) {
               if (process.env.NODE_ENV === 'development') {
                    console.error('Error sending email:', responseEmailSent.error);
               }
               return NextResponse.json({
                    success: false,
                    error: 'Failed to verify email !  Please try with correct email.',
               }, { status: 500 });
          }
          await prisma.quote.create({
               data: {
                    text: quoteText,
                    author: 'User',
                    authorUsername: cleanUsername,
                    email,
                    bio,
                    approved: relevanceScore >= 0.5,
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

Score this quote from 0.0 to 1.0 based on how deeply and directly it aligns with the core themes and values of fast- paced product development and the founder / maker mindset.

Scoring Guidelines(Be Extremely Strict and Thoughtful):
               - Only award high scores(0.8 - 1.0) to quotes that * directly * inspire action, execution, user empathy, iteration, speed, risk - taking, and a bias toward shipping over perfection.
- Medium scores(0.4 - 0.7) are for quotes that support entrepreneurial thinking or growth mindsets but lack direct relevance to building, shipping, or product execution.
- Low scores(0.0 - 0.3) are for generic quotes about life, success, or motivation that don’t speak specifically to building products, taking action, or serving users.
- A perfect score(1.0) should only be given to quotes that could directly motivate a founder to close their browser and go ship something immediately.

Core Themes to Consider:
          - Shipping products fast
               - Building user - first solutions
                    - Founder / maker mindset
                         - Action over perfection
                              - Speed, agility, and iteration
                                   - Learning from failure and feedback
                                        - Building in public / transparency
                                        - Risk - taking and embracing uncertainty
                                             - Crafting great user experiences
                                                  - Community - driven product building
                                                       - Solving real problems
                                                            - Execution over ideas
                                                                 - Progress over polish
                                                                      - Distribution and reach
                                                                           - Market fit and user feedback
                                                                                - Moats and defensibility
                                                                                     - Product - market fit
                                                                                          - Growth and scaling
                                                                                               - Hustle and hard work

Scoring Format:
Respond with a single number between 0.0 and 1.0 — nothing else.

Be highly critical.Assume the reader is a no - nonsense founder or maker who cares about real - world building, not empty platitudes.
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
