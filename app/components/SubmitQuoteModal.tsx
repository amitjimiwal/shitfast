"use client";
import { useState, FormEvent, useEffect } from "react";
import { X, Check, Loader2, Send, Quote } from "lucide-react";

interface SubmitQuoteModalProps {
  onClose: () => void;
}

export default function SubmitQuoteModal({ onClose }: SubmitQuoteModalProps) {
  const [username, setUsername] = useState("");
  const [quoteText, setQuoteText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | "success" | "error">(
    null
  );
  const [isVisible, setIsVisible] = useState(false);

  // Animation on mount
  useEffect(() => {
    // Small delay for the animation to be noticeable
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In production, this would be an actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      // In production:
      /* 
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
      */

      setSubmitStatus("success");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error submitting quote:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Calculate remaining characters (max 280)
  const maxChars = 280;
  const remainingChars = maxChars - quoteText.length;
  const isOverLimit = remainingChars < 0;

  return (
    <div
      className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`bg-slate-800 rounded-xl shadow-2xl border border-slate-700 max-w-md w-full p-6 relative transition-all duration-500 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        } floating-glow`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t"></div>
        <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
          <Quote size={16} />
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-slate-700/50 transition-all duration-200"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-2 text-white flex items-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
            Submit Your Quote
          </span>
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Share your wisdom with the ShipFast community
        </p>

        {submitStatus === "success" ? (
          <div className="text-center py-8 animate-fadeIn">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white mb-4">
              <Check size={32} />
            </div>
            <p className="text-xl font-medium text-white mb-2">
              Quote submitted!
            </p>
            <p className="text-gray-400">
              Your quote will be reviewed and may be featured soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label
                htmlFor="username"
                className="text-sm font-medium text-gray-300 mb-1 flex items-center"
              >
                X Username
                <span className="ml-1 text-xs text-gray-500">(without @)</span>
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="yourhandle"
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-700/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <label
                  htmlFor="quoteText"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Your Quote
                </label>
                <span
                  className={`text-xs ${
                    isOverLimit
                      ? "text-red-400"
                      : remainingChars < 50
                      ? "text-yellow-400"
                      : "text-gray-400"
                  }`}
                >
                  {remainingChars} characters left
                </span>
              </div>
              <textarea
                id="quoteText"
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
                placeholder="Share your shipping/building wisdom here..."
                required
                rows={4}
                maxLength={maxChars}
                className={`w-full px-4 py-3 rounded-lg border ${
                  isOverLimit ? "border-red-500" : "border-slate-600"
                } bg-slate-700/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
              />
              <p className="mt-1 text-xs text-gray-400 italic">
                Great quotes are concise and focus on shipping products,
                building fast, or founder mindset.
              </p>
            </div>

            {submitStatus === "error" && (
              <div className="p-3 bg-red-900/30 border border-red-500/50 text-red-200 rounded-lg text-sm flex items-start animate-fadeIn">
                <div className="mr-2 mt-0.5 text-red-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <div>
                  Something went wrong with your submission. Please try again.
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting || isOverLimit}
                className={`px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center min-w-[100px] transition-all duration-300 ${
                  isSubmitting || isOverLimit
                    ? "opacity-70 cursor-not-allowed"
                    : ""
                }`}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin h-5 w-5 text-white" />
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
                    Submit
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
