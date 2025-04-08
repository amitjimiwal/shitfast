"use client";
import { useState } from "react";
import SubmitQuoteModal from "./SubmitQuoteModal";
import { Rocket } from "lucide-react";

export default function SubmitQuoteButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <button
        className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 py-3 px-6 rounded-xl font-medium flex items-center gap-2 group transition-all duration-300 shadow-lg shadow-purple-600/20"
        onClick={() => setIsModalOpen(true)}
      >
        Submit quote
        <Rocket
          size={18}
          className="group-hover:translate-x-1 transition-transform"
        />
      </button>
      {isModalOpen && (
        <SubmitQuoteModal onClose={() => setIsModalOpen(!isModalOpen)} />
      )}
    </>
  );
}
