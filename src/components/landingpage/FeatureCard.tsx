"use client";

import { motion } from "framer-motion";

export const FeatureCard = ({
  title,
  description,
  icon,
  gradient = "from-blue-500 to-purple-500",
  delay = 0,
}: {
  title: string;
  description: string;
  icon: string;
  gradient?: string;
  delay?: number;
}) => {
  const [from, to] = gradient.split(" to-");

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      viewport={{ once: true }}
      className="group relative bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 hover:border-blue-400 transition-all duration-300 overflow-hidden"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
      />

      <div className="relative z-10">
        <div
          className={`text-6xl mb-6 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
        >
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};
