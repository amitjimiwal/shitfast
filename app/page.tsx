import { Suspense } from "react";
import QuoteDisplay from "./components/QuoteDisplay";
import SubmitQuoteButton from "./components/SubmitQuoteButton";
import { Sparkles, Twitter, Github } from "lucide-react";

async function getDailyQuote() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/quotes/daily`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch daily quote");
    }
    const data = await response.json();
    return data.quipOftheDay;
  } catch (error) {
    console.error("Error fetching daily quote:", error);
    return null;
  }
}

export default async function Home() {
  const dailyQuote = await getDailyQuote();
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10">
        {/* Animated grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(120,41,226,0.15)_0,_rgba(0,0,0,0)_50%)]"></div>

        {/* Animated blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-overlay filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-cyan-400/20 rounded-full mix-blend-overlay filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-fuchsia-600/20 rounded-full mix-blend-overlay filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

        {/* Noise texture overlay */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
      </div>

      <main className="container mx-auto px-4 py-12 max-w-4xl relative z-10">
        <header className="mb-16 text-center">
          <div className="inline-block animate-bounce-slow mb-4">
            <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-400 px-4 py-1 rounded-full text-sm font-medium">
              <Sparkles size={14} />
              <span>ship faster. build better.</span>
            </div>
          </div>

          <h1 className="text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
            ShitFast
          </h1>

          <p className="text-lg text-gray-300 max-w-lg mx-auto relative">
            <span className="absolute -left-8 top-0 text-purple-400 animate-pulse">
              {"<"}
            </span>
            Daily Neuro-boost for builders who don&apos;t just dream but ship
            <span className="absolute -right-8 top-0 text-purple-400 animate-pulse">
              {"/>"}
            </span>
          </p>
        </header>

        <section className="mb-80 perspective-1000">
          <div className="hover:rotate-y-1 transition-transform duration-700">
            <Suspense fallback={<QuoteDisplaySkeleton />}>
              <QuoteDisplay quote={dailyQuote} />
            </Suspense>
          </div>
        </section>

        <section className="mb-16 bg-gradient-to-r from-purple-900/30 to-cyan-900/30 p-8 rounded-2xl border border-purple-800/30 backdrop-blur-sm z-50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-white">
                Ready to share your wisdom?
              </h2>
              <p className="text-gray-300">
                Join the party of builders who inspire others
              </p>
            </div>
            <SubmitQuoteButton />
          </div>
        </section>
      </main>

      <footer className="py-12 relative">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/10 pt-8">
            <div className="text-sm text-gray-400">
              <div className="font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 mb-1">
                ShitFast
              </div>
              Built by{" "}
              <span className="underline text-white font-bold">
                @notamit_dev
              </span>
              , for builders.
            </div>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github size={18} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function QuoteDisplaySkeleton() {
  return (
    <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-purple-500/20 shadow-lg shadow-purple-500/10 p-8 mb-8 animate-pulse">
      <div className="h-6 bg-gray-700 rounded mb-4"></div>
      <div className="h-6 bg-gray-700 rounded mb-4 w-3/4"></div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gray-700"></div>
          <div className="ml-3">
            <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
