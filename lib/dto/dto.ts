import { z } from 'zod';

export const QuotePostSchema = z.object({
     username: z.string().min(1, 'Username is required'),
     quoteText: z.string().min(1, 'Quote text is required'),
     email: z.string().email('Invalid email address'),
     bio: z.string().min(1, 'Bio is required'),
});

export const SeedQuotePostSchema = z.object({
     username: z.string().min(1, 'Username is required'),
     quoteText: z.string().min(1, 'Quote text is required'),
     email: z.string().email('Invalid email address').optional(),
     bio: z.string().min(1, 'Bio is required'),
});