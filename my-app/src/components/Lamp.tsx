"use client";
import { motion } from "framer-motion";
import { LampContainer } from "../components/ui/lamp";

export function LampDemo() {
  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 bg-gradient-to-br from-slate-300 to-white py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
      >
        Leaf Stem <br /> Analyser
      </motion.h1>

      {/* Animated image section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.5, // Adjust delay as needed
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-4 flex justify-center"
      >
        {/* Replace 'your-image-source' with the actual path to your image */}
        {/* <motion.img
          src="/logo.png"
          alt="Logo"
          className="w-40 h-40 md:w-40 md:h-40 object-contain"
          onAnimationComplete={onAnimationComplete}
        /> */}
      </motion.div>
    </LampContainer>
  );
}
