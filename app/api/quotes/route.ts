import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
     apiKey: process.env.OPENAI_API_KEY,
});

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
          // const cleanUsername = username.startsWith('@') ? username.substring(1) : username;

          // Use LLM to evaluate quote relevance
          const relevanceScore = await evaluateQuoteRelevance(quoteText);

          // In production, you would save to database here
          // const newQuote = await prisma.quote.create({
          //   data: {
          //     text: quoteText,
          //     author: 'User', // Could be fetched from X API in production
          //     authorUsername: cleanUsername,
          //     score: relevanceScore,
          //     approved: relevanceScore > 0.7, // Auto-approve high-scoring quotes
          //   },
          // });

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

// Function to evaluate quote relevance using LLM
async function evaluateQuoteRelevance(quoteText: string): Promise<number> {
     try {
          const prompt = `
    You are evaluating quotes for a website that features daily inspiration for founders and makers who love to ship products fast.
    
    Quote to evaluate: "${quoteText}"
    
    Score this quote from 0.0 to 1.0 based on how well it aligns with the themes of:
    - Shipping products quickly
    - Building user-focused solutions
    - Founder/maker mindset
    - Action over perfectionism
    
    Only respond with a single number between 0.0 and 1.0, nothing else.
    `;

          const response = await openai.chat.completions.create({
               model: "gpt-4",
               messages: [
                    { role: "system", content: "You evaluate quotes for relevance to shipping and building products quickly." },
                    { role: "user", content: prompt }
               ],
               temperature: 0.3, // Lower temperature for more consistent scoring
               max_tokens: 10
          });

          // Extract and parse the score
          const scoreText = response.choices[0].message.content?.trim() || "0.5";
          const score = parseFloat(scoreText);

          // Ensure the score is within bounds
          return isNaN(score) ? 0.5 : Math.max(0, Math.min(1, score));
     } catch (error) {
          console.error('Error evaluating quote with LLM:', error);
          // Return a moderate score if evaluation fails
          return 0.5;
     }
}
