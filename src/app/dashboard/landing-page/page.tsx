"use client";

import { JobProcessor } from "@/components/dashboard/job-processor";
import { useAuth } from "@/hooks/auth/use-auth";
import { motion } from "framer-motion";

export default function ModernLanding() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h1 className="text-5xl md:text-7xl font-bold">
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Coming Soon
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            We&apos;re working on something exciting! Our job portal will be
            launching soon.
          </p>
          <div className="flex justify-center">
            <div className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-lg font-semibold">
              Stay Tuned!
            </div>
          </div>
          <div>
            {isAuthenticated ? (
              <JobProcessor />
            ) : (
              <div className="text-center p-6 bg-gray-800 rounded-lg">
                <p>Please login to access job processing features</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
