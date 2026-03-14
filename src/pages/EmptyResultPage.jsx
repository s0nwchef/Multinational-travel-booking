import React from "react";
import EmptyState from "../features/search/EmptyState";
import SuggestedTours from "../features/search/SuggestedTour";
import { motion } from "framer-motion";

export default function EmptyResultsPage({ searchTerm, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-[1400px] mx-auto pb-20 px-4"
    >
      <section className="bg-gray-50/50 rounded-[4rem] border border-gray-100 overflow-hidden mb-16">
        <EmptyState searchTerm={searchTerm} onReset={onReset} />
      </section>

      <SuggestedTours />
    </motion.div>
  );
}
