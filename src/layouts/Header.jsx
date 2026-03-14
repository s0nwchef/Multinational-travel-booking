import React, { useState, useEffect, useRef } from "react";
import {
  PlaneTakeoff,
  Menu,
  Search,
  Heart,
  Bell,
  LogOut,
  X,
  ChevronRight,
} from "lucide-react";
// Chỉnh
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import HeaderMobile from "./HeaderMobile";

export default function Header({
  onOpenAuth,
  onOpenWishlist,
  onOpenNotifications,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) {
  const [user, setUser] = useState(null);
  const [hoveredPath, setHoveredPath] = useState(null);
  const location = useLocation();
  const navigate = useNavigate(); // Thêm dòng này
  const [isSearching, setIsSearching] = useState(false); // Thêm dòng này
  const [searchVal, setSearchVal] = useState(""); // Thêm dòng này
  const [isOverlapping, setIsOverlapping] = useState(false);
  const navRef = useRef(null);
  const searchRef = useRef(null);

  // Kiểm tra va chạm giữa thanh tìm kiếm và thanh điều hướng
  useEffect(() => {
    const checkOverlap = () => {
      // Nếu không tìm kiếm, reset trạng thái va chạm
      if (!isSearching) {
        setIsOverlapping(false);
        return;
      }

      // Nếu đã bị va chạm rồi (đang ở view 3 thẻ), không cần xét kích thước nữa
      // Điều này giúp giữ nguyên view 3 thẻ cho đến khi tắt tìm kiếm
      if (isOverlapping) return;

      if (!navRef.current || !searchRef.current) return;

      const navRect = navRef.current.getBoundingClientRect();
      const searchRect = searchRef.current.getBoundingClientRect();

      // Kiểm tra xem thanh tìm kiếm có chạm vào thanh điều hướng (đang đầy đủ 5 thẻ) không
      if (searchRect.left < navRect.right + 25) {
        setIsOverlapping(true);
      }
    };

    checkOverlap();
    window.addEventListener("resize", checkOverlap);
    const interval = setInterval(checkOverlap, 100);
    
    return () => {
      window.removeEventListener("resize", checkOverlap);
      clearInterval(interval);
    };
  }, [isSearching, isOverlapping]);

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("currentUser");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    checkUser();
    window.addEventListener("auth-change", checkUser);
    return () => window.removeEventListener("auth-change", checkUser);
  }, []);

  useEffect(() => {
    if (typeof setIsMobileMenuOpen === "function") {
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname, setIsMobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.dispatchEvent(new Event("auth-change"));
    if (typeof setIsMobileMenuOpen === "function") {
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { path: "/destinations", label: "Destination" },
    { path: "/tours", label: "Tours" },
    { path: "/hotels", label: "Hotels" },
    { path: "/help", label: "Help" },
    { path: "/blog", label: "Blog" },
  ];

  const activeIndicatorPath = hoveredPath || location.pathname;

  return (
    <header className="w-full z-50 relative">
      <div
        className={`
        transition-all duration-500 ease-in-out shadow-sm
        ${
          isMobileMenuOpen
            ? "bg-white dark:bg-gray-900 rounded-[2.5rem] mx-0 overflow-hidden"
            : "bg-[#E5E5E5] dark:bg-surface-dark rounded-full"
        }
      `}
      >
        <nav className="px-6 py-3 flex items-center justify-between relative z-10">
          <div className="flex-1 flex justify-start">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <PlaneTakeoff className="text-primary w-8 h-8" />
              <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
                Logo
              </span>
            </Link>
          </div>
          <div
            ref={navRef}
            className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 bg-white dark:bg-gray-800/50 p-1 rounded-full shadow-sm z-10 transition-all duration-300"
            onMouseLeave={() => setHoveredPath(null)}
          >
            {navLinks
              .filter(
                (link) =>
                  !(isSearching && isOverlapping) ||
                  (link.label !== "Help" && link.label !== "Blog")
              )
              .map((link) => {
              const isIndicatorActive = activeIndicatorPath === link.path;
              const isActive = location.pathname === link.path;
              const isHovered = hoveredPath === link.path;

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onMouseEnter={() => setHoveredPath(link.path)}
                  className="relative px-6 py-2.5 rounded-full text-sm font-bold z-20 transition-colors duration-300"
                >
                  <motion.span
                    animate={{
                      color: isIndicatorActive
                        ? "var(--color-primary)"
                        : "#6B7280",
                      scale: isIndicatorActive ? 1.05 : 1,
                    }}
                    className="relative z-10 block"
                  >
                    {link.label}
                  </motion.span>

                  {isIndicatorActive && (
                    <motion.div
                      layoutId="nav-liquid-bg"
                      className="absolute inset-0 rounded-full z-0"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 28,
                        mass: 0.6,
                      }}
                    >
                      <div
                        className={`absolute inset-0 rounded-full transition-colors duration-300 ${
                          isHovered && !isActive
                            ? "bg-orange-50/60"
                            : "bg-gradient-to-r from-orange-100/90 to-orange-50/90 shadow-sm"
                        }`}
                      >
                        <div className="absolute inset-0 bg-primary/10 rounded-full shadow-inner border border-primary/5" />
                      </div>
                    </motion.div>
                  )}
                </NavLink>
              );
            })}
          </div>
          <div className="flex-1 flex justify-end items-center gap-4">
            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Thêm đoạn search này */}
              <div
                ref={searchRef}
                className={`
    flex items-center transition-all duration-300 border-2
    ${
      isSearching
        ? "bg-white dark:bg-gray-800 border-orange-400 shadow-md shadow-orange-100 dark:shadow-none"
        : "bg-orange-50/50 dark:bg-gray-800/40 border-orange-100/50 dark:border-gray-700"
    }
    rounded-2xl px-2 ml-2
  `}
              >
                <AnimatePresence>
                  {isSearching && (
                    <motion.input
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 180, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      /* Thêm outline-none ở đây */
                      className="bg-transparent border-none focus:ring-0 outline-none text-sm py-2 px-2 text-gray-900 dark:text-white placeholder-gray-400 font-medium"
                      placeholder="Where to go?"
                      autoFocus
                      value={searchVal}
                      onChange={(e) => setSearchVal(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && searchVal.trim()) {
                          navigate("/tours", { state: { query: searchVal } });
                          setIsSearching(false);
                        }
                        if (e.key === "Escape") setIsSearching(false);
                      }}
                    />
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (isSearching && searchVal.trim()) {
                      navigate("/tours", { state: { query: searchVal } });
                      setIsSearching(false);
                    } else {
                      setIsSearching(!isSearching);
                    }
                  }}
                  className="p-2 text-orange-500 hover:text-orange-600 transition-colors outline-none focus:outline-none"
                >
                  {isSearching && searchVal ? (
                    <ChevronRight className="w-5 h-5 stroke-[3px]" />
                  ) : (
                    <Search className="w-5 h-5 stroke-[2.5px]" />
                  )}
                </motion.button>
              </div>
              <button
                onClick={onOpenWishlist}
                className="p-2 text-primary relative transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <Heart className="w-6 h-6" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-black rounded-full border-2 border-white"></span>
              </button>
              <button
                onClick={onOpenNotifications}
                className="p-2 text-primary relative transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
            <div className="hidden lg:block">
              {user ? (
                <div className="flex items-center gap-3 bg-primary text-white pl-6 pr-1.5 py-1.5 rounded-full shadow-lg group relative cursor-pointer">
                  <div className="flex flex-col items-start -space-y-0.5">
                    <span className="text-sm font-black leading-tight">
                      {user.name}
                    </span>
                    <span className="text-[10px] font-medium opacity-90">
                      {user.membership}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white/30 overflow-hidden bg-white/20">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60]">
                    <button
                      onClick={handleLogout}
                      className="bg-white text-primary text-xs font-bold px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-orange-100 hover:bg-orange-50 whitespace-nowrap"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout Account
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="bg-primary text-white px-8 py-3 rounded-full text-sm font-black shadow-lg hover:bg-primary-dark transition-all hover:scale-105 active:scale-95"
                >
                  Sign In
                </button>
              )}
            </div>
            <button
              onClick={() => {
                if (typeof setIsMobileMenuOpen === "function") {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }
              }}
              className="lg:hidden p-2 rounded-full hover:bg-orange-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-primary" />
              ) : (
                <Menu className="w-6 h-6 text-primary" />
              )}
            </button>
          </div>
        </nav>

        <HeaderMobile
          isOpen={isMobileMenuOpen}
          navLinks={navLinks}
          onOpenWishlist={onOpenWishlist}
          onOpenNotifications={onOpenNotifications}
          onOpenAuth={onOpenAuth}
          user={user}
          handleLogout={handleLogout}
        />
      </div>
    </header>
  );
}
