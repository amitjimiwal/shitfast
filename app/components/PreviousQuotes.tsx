import { Heart } from "lucide-react";
import Image from "next/image";
const previousQuotes = [
  {
    id: "2",
    text: "Focus obsessively on one metric that matters. Let the rest follow.",
    author: "Growth Guru",
    authorUsername: "growthhacker",
    likes: 245,
  },
  {
    id: "3",
    text: "Your first version should embarrass you. If it doesn't, you shipped too late.",
    author: "Ship It Sam",
    authorUsername: "shipsamsam",
    likes: 512,
  },
  {
    id: "4",
    text: "Build for tomorrow, but launch for today. Perfection is the enemy of done.",
    author: "Launch Lady",
    authorUsername: "launchlady",
    likes: 347,
  },
];

export default function PreviousQuotes() {
  return (
    <div className="space-y-4">
      {previousQuotes.map((quote) => (
        <div key={quote.id} className="relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-cyan-400/5 transform group-hover:translate-y-0 translate-y-full transition-transform duration-500"></div>

          <div className="p-6 rounded-xl bg-black/40 backdrop-blur-md border border-purple-500/10 shadow-lg relative group-hover:border-purple-500/30 transition-all duration-300">
            <p className="text-lg mb-3 text-gray-200">
              &ldquo;{quote.text}&rdquo;
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image
                  width={40}
                  height={40}
                  src={`/favicon.ico`}
                  alt={quote.author}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-white">{quote.author}</p>
                  <p className="text-xs text-gray-400">
                    @{quote.authorUsername}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-gray-400">
                <Heart size={16} className="text-pink-500" />
                <span className="text-sm">{quote.likes}</span>
              </div>
            </div>

            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-600/10 blur-2xl rounded-full group-hover:animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
