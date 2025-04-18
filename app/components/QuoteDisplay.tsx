"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { Heart, Twitter, Copy, Check } from "lucide-react";
import html2canvas from "html2canvas";

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
  const quoteRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    if (quote) {
      navigator.clipboard.writeText(
        `"${quote.text}"\n ${quote.authorUsername}\n ${quote.bio}`
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
    text: "All the pleasure of life is in general ideas, but all the uses in life lie in specific solutions.",
    authorUsername: "Holmes",
    approved: true,
    featuredDate: new Date().toISOString(),
    bio: "By ShitFast",
  };
  const handleShareOnX = async () => {
    // Create X share URL
    const text = `"${displayQuote.text}" - @${displayQuote.authorUsername}\n\nShared via @stackforgelabs 's ShitFast`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}`;

    // Open X share dialog
    window.open(shareUrl, "_blank");
  };

  return (
    <div className="relative group" ref={quoteRef}>
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
              <button
                onClick={handleShareOnX}
                className="flex items-center gap-1 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
              >
                <Twitter size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
