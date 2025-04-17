"use client";
import { useState } from "react";
import Image from "next/image";
import { Heart, Share2, Twitter, Copy, Check } from "lucide-react";

type Quote = {
  id: string;
  text: string;
  authorUsername: string;
  approved: boolean;
  featuredDate: string;
  bio: string;
};

export default function QuoteDisplay({ quote }: { quote?: Quote }) {
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (quote) {
      navigator.clipboard.writeText(
        `"${quote.text}" - ${quote.authorUsername}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLike = () => {
    //TODO: api to update the like count on click
    setLiked(!liked);
  };

  // If no quote is provided, use a default
  const displayQuote = quote || {
    id: "1",
    text: "The best way to build a product is to start shipping on day one. Iterate relentlessly.",
    authorUsername: "foundermcship",
    approved: true,
    featuredDate: new Date().toISOString(),
    bio: "Founder of ShipFast, a platform for builders.",
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-1000"></div>
      <div className="relative bg-black/60 backdrop-blur-lg rounded-2xl px-8 pt-10 pb-8 shadow-xl hover:shadow-2xl transition duration-300">
        <div className="absolute -top-5 left-8 bg-gradient-to-r from-purple-600 to-cyan-500 p-2 rounded-full shadow-lg shadow-purple-500/30">
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983V18H0Z" />
          </svg>
        </div>

        <blockquote className="text-xl md:text-2xl font-medium leading-relaxed mb-6">
          &quot;{displayQuote.text}&quot;
        </blockquote>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full p-0.5">
              <div className="bg-black rounded-full p-1">
                <Image
                  width={40}
                  height={40}
                  src="/avatar.svg"
                  alt={displayQuote.authorUsername}
                  className="w-10 h-10 rounded-full"
                />
              </div>
            </div>
            <div className="ml-3">
              <p className="font-bold text-white">{displayQuote.bio}</p>
              <p className="text-sm text-gray-400">
                @{displayQuote.authorUsername}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 p-2 rounded-full transition-all ${
                liked
                  ? "text-pink-500 bg-pink-500/10"
                  : "text-gray-400 hover:text-pink-500 hover:bg-gray-800"
              }`}
            >
              <Heart size={18} className={liked ? "fill-pink-500" : ""} />
            </button>

            <button
              onClick={handleCopy}
              className={`flex items-center gap-1 p-2 rounded-full transition-all ${
                copied
                  ? "text-green-500 bg-green-500/10"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
              title="Copy quote"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>

            <div className="relative group/share">
              <button className="flex items-center gap-1 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
                <Share2 size={18} />
              </button>

              <div className="absolute right-0 mt-2 py-2 w-48 bg-gray-900 rounded-xl shadow-xl border border-gray-800 opacity-0 invisible group-hover/share:opacity-100 group-hover/share:visible transition-all duration-300 ease-in-out z-10">
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  <Twitter size={16} />
                  <span>Share on Twitter</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                  </svg>
                  <span>Share on LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
