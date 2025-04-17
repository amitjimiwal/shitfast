"use client";
import { useState, FormEvent, useEffect } from "react";
import {
  X,
  Check,
  Loader2,
  Send,
  Quote,
  Mail,
  User,
  MessageSquare,
  Info,
} from "lucide-react";

// Types
interface SubmitQuoteModalProps {
  onClose: () => void;
}

interface FormData {
  username: string;
  email: string;
  bio: string;
  quoteText: string;
}

interface ApiResponse {
  success: boolean;
  error?: string;
}

// Constants
const MAX_QUOTE_LENGTH = 280;
const MAX_BIO_LENGTH = 20;
const SUCCESS_CLOSE_DELAY = 2000;

export default function SubmitQuoteModal({ onClose }: SubmitQuoteModalProps) {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    bio: "",
    quoteText: "",
  });

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<null | "success" | "error">(
    null
  );
  const [isVisible, setIsVisible] = useState(false);

  // Derived state
  const remainingQuoteChars = MAX_QUOTE_LENGTH - formData.quoteText.length;
  const remainingBioChars = MAX_BIO_LENGTH - formData.bio.length;
  const isQuoteOverLimit = remainingQuoteChars < 0;
  const isBioOverLimit = remainingBioChars < 0;
  const isFormValid =
    formData.username &&
    formData.email &&
    formData.quoteText &&
    !isQuoteOverLimit &&
    !isBioOverLimit;

  // Animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Form field change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // API interaction
  const submitQuote = async (): Promise<ApiResponse> => {
    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit quote");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unexpected error occurred");
    }
  };

  // Form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await submitQuote();
      setSubmitStatus("success");

      setTimeout(() => {
        onClose();
      }, SUCCESS_CLOSE_DELAY);
    } catch (error) {
      console.error("Error submitting quote:", error);
      setError(
        error instanceof Error ? error.message : "Failed to submit quote"
      );
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal when clicking backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
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
            Submit Your Quip
          </span>
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Share your Quip with the ShitFast
        </p>

        {submitStatus === "success" ? (
          <SuccessMessage />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <FormField
              id="username"
              label="X Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="yourhandle"
              required
              hint="(without @)"
              icon={<User size={16} />}
            />

            <FormField
              id="email"
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              icon={<Mail size={16} />}
            />

            <div className="space-y-1">
              <div className="flex justify-between">
                <label
                  htmlFor="bio"
                  className="text-sm font-medium text-gray-300 mb-1 flex items-center"
                >
                  <Info size={16} className="mr-2" />
                  Short Bio
                </label>
                <span
                  className={`text-xs ${
                    isBioOverLimit
                      ? "text-red-400"
                      : remainingBioChars < 30
                      ? "text-yellow-400"
                      : "text-gray-400"
                  }`}
                >
                  {remainingBioChars} characters left
                </span>
              </div>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us a bit about yourself"
                rows={2}
                maxLength={MAX_BIO_LENGTH}
                className={`w-full px-4 py-3 rounded-lg border ${
                  isBioOverLimit ? "border-red-500" : "border-slate-600"
                } bg-slate-700/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
              />
              <p className="mt-1 text-xs text-gray-400 italic">
                A brief description of who you are 
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <label
                  htmlFor="quoteText"
                  className="text-sm font-medium text-gray-300 mb-1 flex items-center"
                >
                  <MessageSquare size={16} className="mr-2" />
                  Your Quote
                </label>
                <span
                  className={`text-xs ${
                    isQuoteOverLimit
                      ? "text-red-400"
                      : remainingQuoteChars < 50
                      ? "text-yellow-400"
                      : "text-gray-400"
                  }`}
                >
                  {remainingQuoteChars} characters left
                </span>
              </div>
              <textarea
                id="quoteText"
                name="quoteText"
                value={formData.quoteText}
                onChange={handleChange}
                placeholder="Share your shipping/building Quip here..."
                required
                rows={4}
                maxLength={MAX_QUOTE_LENGTH}
                className={`w-full px-4 py-3 rounded-lg border ${
                  isQuoteOverLimit ? "border-red-500" : "border-slate-600"
                } bg-slate-700/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
              />
              <p className="mt-1 text-xs text-gray-400 italic">
                Great Quips are concise and focus on shipping products,
                building fast, or founder mindset.
              </p>
            </div>

            {submitStatus === "error" && error && (
              <ErrorMessage message={error} />
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className={`px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center min-w-[100px] transition-all duration-300 ${
                  isSubmitting || !isFormValid
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

// Extract reusable components
function FormField({
  id,
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
  hint,
  icon,
}: {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  hint?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-300 mb-1 flex items-center"
      >
        {icon && <span className="mr-2">{icon}</span>}
        {label}
        {hint && <span className="ml-1 text-xs text-gray-500">{hint}</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-700/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
      />
    </div>
  );
}

function SuccessMessage() {
  return (
    <div className="text-center py-8 animate-fadeIn">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white mb-4">
        <Check size={32} />
      </div>
      <p className="text-xl font-medium text-white mb-2">Quote submitted!</p>
      <p className="text-gray-400">
        Your quote will be reviewed and may be featured soon.
      </p>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
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
      <div>{message}</div>
    </div>
  );
}
