export interface Quote {
     id: string;
     text: string;
     email: string;
     bio: string;
     author: string;
     authorUsername: string;
     submittedAt: Date;
     approved: boolean;
     featured: boolean;
}

export interface FeaturedQuote {
     id: string;
     quoteId: string;
     quote: Quote;
     featuredDate: Date;
}
export interface LLMQUOTEINPUT {
     id: string;
     text: string;
     bio: string;
     authorUsername: string;
     approved: boolean;
     featured: boolean;
}