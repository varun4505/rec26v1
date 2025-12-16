"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Edit2 } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";

export default function NotFound() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "input" | "checking">("idle");
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Mouse parallax effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Define transforms
  const rotateX = useTransform(y, [0, 1], [10, -10]);
  const rotateY = useTransform(x, [0, 1], [-10, 10]);
  const posX = useTransform(x, [-1, 1], [-20, 20]);
  const posY = useTransform(y, [-1, 1], [-20, 20]);

  useEffect(() => {
    // Set light cursor border for this page
    document.documentElement.style.setProperty("--cursor-border", "#ffffff");

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); 

    return () => {
      clearTimeout(timer);
      document.documentElement.style.removeProperty("--cursor-border");
    };
  }, []);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const { clientX, clientY, currentTarget } = event;
    const { width, height } = currentTarget.getBoundingClientRect();
    const centerX = width / 2;
    const centerY = height / 2;
    // Normalize values between -1 and 1
    x.set((clientX - centerX) / centerX);
    y.set((clientY - centerY) / centerY);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setStatus("checking");
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] text-white overflow-hidden relative perspective-1000"
    >
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#f86800] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Interactive 404 Title */}
        <motion.div
          style={{
            rotateX,
            rotateY,
            x: posX,
            y: posY,
          }}
          className="perspective-1000"
        >
          <h1 className="font-array text-[#f8680067] text-[10rem] md:text-[18rem] leading-none tracking-tight select-none drop-shadow-2xl">
            404
          </h1>
        </motion.div>

        <div className="mt-8 h-24 flex items-center justify-center w-full max-w-xl">
          <AnimatePresence mode="wait">
            {/* STATE: IDLE */}
            {status === "idle" && (
              <motion.p
                key="idle-text"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="font-khand text-2xl md:text-3xl font-light tracking-wide text-gray-400"
              >
                This sector is empty...{" "}
                <button
                  onClick={() => setStatus("input")}
                  className="text-gray-200 hover:text-[#f86800] transition-colors duration-300 border-b border-[#f86800]/50 hover:border-[#f86800] outline-none"
                >
                  or did you uncover a fragment?
                </button>
              </motion.p>
            )}

            {/* STATE: INPUT */}
            {status === "input" && (
              <motion.form
                key="input-form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                onSubmit={handleSubmit}
                className="w-full flex justify-center"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="paste what you found"
                  className="w-[320px] bg-transparent border-b border-gray-700 text-center text-2xl font-khand text-[#f86800] placeholder-gray-600 outline-none py-2 focus:border-[#f86800] focus:placeholder-gray-800 transition-all duration-500"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                />
              </motion.form>
            )}

            {/* STATE: CHECKING (Holds indefinitely) */}
            {status === "checking" && (
              <motion.div
                key="checking-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-1"
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-2 h-2 rounded-full bg-[#f86800]"
                  />
                  <span className="font-khand text-2xl text-white tracking-wide">
                    Okay, we&apos;ll check it.
                  </span>
                </div>

                {/* Edit Trigger - Input Hidden */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => setStatus("input")}
                  className="flex items-center gap-2 group outline-none mt-1 opacity-60 hover:opacity-100 transition-all duration-300"
                >
                  <span className="font-khand text-lg text-gray-500 group-hover:text-[#f86800] transition-colors">
                    changed your mind?
                  </span>
                  <Edit2 size={12} className="text-gray-500 group-hover:text-[#f86800] transition-colors" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={() => router.back()}
        className="absolute bottom-12 font-khand text-gray-600 hover:text-white transition-colors text-lg tracking-[0.2em] uppercase outline-none"
      >
        Back
      </motion.button>
    </div>
  );
}