import React from 'react';
import { ShieldCheck, Tag, Headset, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function WhyChooseUs() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "backOut" },
    },
  };

  return (
      <section id="why-choose-us" className="mt-4 mb-4">
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="bg-[#EAEAEA] dark:bg-surface-dark rounded-3xl p-8 lg:p-12 shadow-sm"
        >
          <motion.h2
              variants={itemVariants}
              className="text-2xl font-bold text-gray-900 dark:text-white mb-10 text-center"
          >
            Why choose Logo
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div variants={itemVariants} className="text-center group">
              <motion.div
                  whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
                  className="w-16 h-16 mx-auto bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
              >
                <ShieldCheck className="text-primary w-8 h-8" />
              </motion.div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Trusted Platform</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Secure booking for millions.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center group">
              <motion.div
                  whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
                  className="w-16 h-16 mx-auto bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
              >
                <Tag className="text-blue-600 dark:text-blue-400 w-8 h-8" />
              </motion.div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Best Price Guarantee</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">We'll refund the difference.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center group">
              <motion.div
                  whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
                  className="w-16 h-16 mx-auto bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
              >
                <Headset className="text-green-600 dark:text-green-400 w-8 h-8" />
              </motion.div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">24/7 Support</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Real human help anytime.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center group">
              <motion.div
                  whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
                  className="w-16 h-16 mx-auto bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
              >
                <Zap className="text-purple-600 dark:text-purple-400 w-8 h-8" />
              </motion.div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Instant Confirmation</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tickets sent immediately.</p>
            </motion.div>
          </div>
        </motion.div>
      </section>
  );
}
