import React, { useState } from "react";
import { Map, Bed, Bus, Search, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  //Hàm xử lý khi nhấn nút tìm kiếm
  const handleSearch = () => {
    if (searchValue.trim()) {
      // Chuyển hướng sang trang /tours và đính kèm từ khóa
      navigate("/tours", { state: { query: searchValue } });
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const buttonVariants = {
    hidden: { x: 20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="relative w-full h-[550px] rounded-3xl overflow-hidden group"
    >
      <motion.img
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        alt="Scenic mountain lake landscape with a boat"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAISShaqK0IZWndWur78zhJD6hweVkB0yYpn5HJc9CqQPHNaWl6hmepmqSGvGtx4Q3wB3Z3T3jC-y0QrBwPaJ3cn8dmjA97UBKBXrsmDuzjmyRn4dG0HfjJ_Vrb2UNR562q3CUtT6iXrzTmgCLP-te6fCjDdSiMun2WabntNpZnf3g5FSv14uQwYT27_BB51nx2nyzZTXDq-CKOSC7fJphJJMJBr4c8Zs3D12ZHzzWM5S7_Y9iSRMEufacAYtmYw3L5Yz4gJBgP8FXc"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10"></div>

      <motion.div
        variants={containerVariants}
        className="absolute top-6 right-6 flex gap-2 overflow-x-auto max-w-full pb-2 hide-scrollbar z-20"
      >
        <motion.button
          variants={buttonVariants}
          className="flex items-center gap-2 bg-white/90 backdrop-blur-md text-gray-900 px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:bg-white transition-colors"
        >
          <Map className="w-4 h-4" /> Tours
        </motion.button>
        <motion.button
          variants={buttonVariants}
          className="flex items-center gap-2 bg-black/40 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-black/60 transition-colors border border-white/20"
        >
          <Bus className="w-4 h-4" /> Transport
        </motion.button>
      </motion.div>

      <div className="absolute inset-0 flex flex-col justify-center items-center px-4 text-center z-10">
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-xl tracking-tight"
          style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}
        >
          Yours To Explore
        </motion.h1>
        {/* --- KHỐI SEARCH ĐÃ ĐƯỢC CHỈNH SỬA --- */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-2xl bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-full flex items-center gap-2 shadow-2xl"
        >
          <div className="flex-1 flex items-center px-4">
            <Search className="text-white/70 mr-3 w-5 h-5" />
            <input
              className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder-white/70 text-lg"
              placeholder="Where do you want to go?"
              type="text"
              value={searchValue} // 4. Gắn state vào input
              onChange={(e) => setSearchValue(e.target.value)} // 5. Cập nhật state khi gõ
              onKeyDown={(e) => e.key === "Enter" && handleSearch()} // 6. Nhấn Enter để tìm
            />
          </div>
          <motion.button
            onClick={handleSearch} // 7. Click nút để tìm
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-primary hover:bg-primary-dark text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-lg"
          >
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
