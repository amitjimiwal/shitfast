import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const prisma = new PrismaClient()
export async function POST(request: NextRequest) {
     try {
          // Extract data from request body
          const { username, quoteText } = await request.json();
          // Validate input
          if (!username || !quoteText) {
               return NextResponse.json({
                    success: false,
                    error: 'Username and quote text are required',
               }, { status: 400 });
          }
          // Clean username (remove @ if present)
          const cleanUsername = username.startsWith('@') ? username.substring(1) : username;
          console.log('Cleaned username:', cleanUsername);
          const url = `https://x.com/${cleanUsername}/photo`;
          console.log('URL:', url);
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
                    score: relevanceScore,
                    approved: relevanceScore > 0.7,
               },
          });

          return NextResponse.json({
               success: true,
               message: 'Quote submitted successfully',
               data: {
                    relevanceScore,
                    autoApproved: relevanceScore > 0.7,
               },
          });
     } catch (error) {
          console.error('Error processing quote submission:', error);
          return NextResponse.json({
               success: false,
               error: 'Failed to process quote submission',
          }, { status: 500 });
     }
}
// Default
async function evaluateQuoteRelevance(quoteText: string): Promise<number> {
     try {
          const prompt = `
    You are evaluating quotes for a website that features daily dopamine/inspiration for founders and makers who love to ship products fast.
    
    Quote to evaluate: "${quoteText}"
    
    Score this quote from 0.0 to 1.0 based on how well it aligns with the themes of:
    - Shipping products quickly
    - Building user-focused solutions
    - Founder/maker mindset
    - Action over perfectionism
    - All things related to product development and shipping
    - Entrepreneurship and innovation
    - Growth and iteration
    - User experience and feedback
    - Building in public
    - Learning from failure
    - Embracing challenges and risks
    - Building a community around your product
    - The importance of speed and agility in product development
    - The value of feedback and iteration in the product development process
    - The importance of user experience in product development
    - The importance of building in public and sharing your journey with others
    
    Only respond with a single number between 0.0 and 1.0, nothing else.
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
