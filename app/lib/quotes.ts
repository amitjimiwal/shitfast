import { cache } from 'react';

// Define Quote interface
export interface Quote {
     id: string;
     text: string;
     author: string;
     authorUsername: string;
     submittedAt: string;
     approved: boolean;
     featured: boolean;
     featuredDate: string;
     score: number;
}

export interface PreviousQuote {
     id: string;
     text: string;
     author: string;
     authorUsername: string;
     featuredDate: string;
}

// Use React's cache function to deduplicate requests
export const getDailyQuote = cache(async (): Promise<Quote> => {
     try {
          // In production, this would make an actual API call
          // const response = await fetch('https://your-domain.com/api/quotes/daily', { next: { revalidate: 3600 } });
          // if (!response.ok) throw new Error('Failed to fetch daily quote');
          // const data = await response.json();
          // return data.data;

          // For demo purposes, return a hardcoded quote
          return {
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
     } catch (error) {
          console.error('Error fetching daily quote:', error);
          throw error;
     }
});

export const getPreviousQuotes = cache(async (): Promise<PreviousQuote[]> => {
     try {
          // In production, this would make an actual API call
          // const response = await fetch('https://your-domain.com/api/quotes/previous', { next: { revalidate: 3600 } });
          // if (!response.ok) throw new Error('Failed to fetch previous quotes');
          // const data = await response.json();
          // return data.data;

          // For demo purposes, return hardcoded quotes
          return [
               {
                    id: '2',
                    text: "Don't worry about what competitors are doing. Just ship your vision.",
                    author: "Ship Queen",
                    authorUsername: "shipqueen",
                    featuredDate: new Date(Date.now() - 86400000).toISOString() // yesterday
               },
               {
                    id: '3',
                    text: "A good product shipped today beats a perfect product shipped next year.",
                    author: "Builder Bro",
                    authorUsername: "buildrbro",
                    featuredDate: new Date(Date.now() - 172800000).toISOString() // 2 days ago
               }
          ];
     } catch (error) {
          console.error('Error fetching previous quotes:', error);
          throw error;
     }
});

export async function submitQuote(username: string, quoteText: string) {
     try {
          const response = await fetch('/api/quotes', {
               method: 'POST',
               headers: {
                    'Content-Type': 'application/json',
               },
               body: JSON.stringify({ username, quoteText })
          });

          if (!response.ok) {
               throw new Error('Failed to submit quote');
          }

          return await response.json();
     } catch (error) {
          console.error('Error submitting quote:', error);
          throw error;
     }
}