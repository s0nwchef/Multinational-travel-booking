import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Globe from "./globe";
import { cn } from "../../lib/utils";

const defaultGlobeConfig = {
  positions: [
    { top: "50%", left: "75%", scale: 1.4 },  // Hero: Right side, balanced
    { top: "25%", left: "50%", scale: 0.9 },  // Innovation: Top side, subtle
    { top: "15%", left: "90%", scale: 2 },  // Discovery: Left side, medium
    { top: "50%", left: "50%", scale: 1.8 },  // Future: Center, large backdrop
  ]
};

// Parse percentage string to number
const parsePercent = (str) => parseFloat(str.replace('%', ''));

function ScrollGlobe({ sections, globeConfig = defaultGlobeConfig, className }) {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [globeTransform, setGlobeTransform] = useState("");
  const containerRef = useRef(null);
  const sectionRefs = useRef([]);
  const animationFrameId = useRef();

  // Pre-calculate positions for performance
  const calculatedPositions = useMemo(() => {
    return globeConfig.positions.map(pos => ({
      top: parsePercent(pos.top),
      left: parsePercent(pos.left),
      scale: pos.scale
    }));
  }, [globeConfig.positions]);

  // Simple, direct scroll tracking
  const updateScrollPosition = useCallback(() => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(Math.max(scrollTop / docHeight, 0), 1);

    setScrollProgress(progress);

    // Simple section detection
    const viewportCenter = window.innerHeight / 2;
    let newActiveSection = 0;
    let minDistance = Infinity;

    sectionRefs.current.forEach((ref, index) => {
      if (ref) {
        const rect = ref.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);

        if (distance < minDistance) {
          minDistance = distance;
          newActiveSection = index;
        }
      }
    });

    // Direct position update - no interpolation
    const currentPos = calculatedPositions[newActiveSection];
    const transform = `translate3d(${currentPos.left}vw, ${currentPos.top}vh, 0) translate3d(-50%, -50%, 0) scale3d(${currentPos.scale}, ${currentPos.scale}, 1)`;

    setGlobeTransform(transform);

    setActiveSection(newActiveSection);
  }, [calculatedPositions]);

  // Throttled scroll handler with RAF
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        animationFrameId.current = requestAnimationFrame(() => {
          updateScrollPosition();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Use passive listeners and immediate execution
    window.addEventListener("scroll", handleScroll, { passive: true });
    updateScrollPosition(); // Initial call

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [updateScrollPosition]);

  // Initial globe position
  useEffect(() => {
    const initialPos = calculatedPositions[0];
    const initialTransform = `translate3d(${initialPos.left}vw, ${initialPos.top}vh, 0) translate3d(-50%, -50%, 0) scale3d(${initialPos.scale}, ${initialPos.scale}, 1)`;
    setGlobeTransform(initialTransform);
  }, [calculatedPositions]);

  return (
      <div
          ref={containerRef}
          className={cn(
              "relative w-full max-w-screen overflow-x-hidden min-h-screen bg-black text-white",
              className
          )}
      >
        {/* Background Image Layers - Maximum visibility */}
        <div className="fixed inset-0 z-0">
          {sections.map((section, index) => (
              <div
                  key={`bg-${index}`}
                  className={cn(
                      "absolute inset-0 transition-opacity duration-1000 ease-in-out bg-cover bg-center",
                      activeSection === index ? "opacity-100" : "opacity-0"
                  )}
                  style={{
                    backgroundImage: `url('${section.backgroundImage}')`,
                    filter: 'contrast(1.05)'
                  }}
              />
          ))}
          {/* Minimal Overlay for text readability only */}
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
        </div>

        {/* Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-0.5 bg-white/10 z-50">
          <div
              className="h-full bg-orange-500 will-change-transform shadow-[0_0_8px_rgba(255,91,0,0.5)]"
              style={{
                transform: `scaleX(${scrollProgress})`,
                transformOrigin: 'left center',
                transition: 'transform 0.15s ease-out',
              }}
          />
        </div>

        {/* Enhanced Navigation - Fully Responsive */}
        <div className="hidden sm:flex fixed right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40">
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            {sections.map((section, index) => (
                <div key={index} className="relative group">
                  <div
                      className={cn(
                          "nav-label absolute right-5 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2",
                          "px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-[32px] text-xs sm:text-sm font-medium whitespace-nowrap",
                          "bg-black/90 backdrop-blur-md border border-white/10 shadow-xl z-50",
                          activeSection === index ? "animate-fadeOut" : "opacity-0"
                      )}
                  >
                    <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2">
                      <div className="w-1 sm:w-1.5 lg:w-2 h-1 sm:h-1.5 lg:h-2 rounded-full bg-orange-500 animate-pulse" />
                      <span className="text-white">
                    {section.badge || `Section ${index + 1}`}
                  </span>
                    </div>
                  </div>

                  <button
                      onClick={() => {
                        sectionRefs.current[index]?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'center'
                        });
                      }}
                      className={cn(
                          "relative w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-full border-2 transition-all duration-300 hover:scale-125",
                          activeSection === index
                              ? "bg-orange-500 border-orange-500 shadow-[0_0_10px_rgba(255,91,0,0.5)]"
                              : "bg-transparent border-white/20 hover:border-orange-500/60"
                      )}
                      aria-label={`Go to ${section.badge || `section ${index + 1}`}`}
                  />
                </div>
            ))}
          </div>
        </div>

        {/* Ultra-smooth Globe */}
        <div
            className="fixed z-10 pointer-events-none will-change-transform transition-all duration-[1400ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
            style={{
              transform: globeTransform,
              filter: `opacity(${activeSection === 3 ? 0.95 : 1})`,
            }}
        >
          <div className="scale-75 sm:scale-90 lg:scale-100">
            <Globe />
          </div>
        </div>

        {/* Dynamic sections */}
        {sections.map((section, index) => (
            <section
                key={section.id}
                ref={(el) => (sectionRefs.current[index] = el)}
                className={cn(
                    "relative min-h-screen flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-12 z-20 py-12 sm:py-16 lg:py-20",
                    section.align === 'center' && "items-center text-center",
                    section.align === 'right' && "items-end text-right",
                    section.align !== 'center' && section.align !== 'right' && "items-start text-left"
                )}
            >
              <div className="w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl">

                <h1 className={cn(
                    "font-bold mb-6 sm:mb-8 leading-[1.1] tracking-tight",
                    index === 0
                        ? "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl"
                        : "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl"
                )}>
                  {section.subtitle ? (
                      <div className="space-y-1 sm:space-y-2">
                        <div className="text-white">
                          {section.title}
                        </div>
                        <div className="text-orange-500 text-[0.6em] sm:text-[0.7em] font-black uppercase tracking-widest">
                          {section.subtitle}
                        </div>
                      </div>
                  ) : (
                      <div className="text-white">
                        {section.title}
                      </div>
                  )}
                </h1>

                <div className={cn(
                    "text-white/80 leading-relaxed mb-8 sm:mb-10 text-base sm:text-lg lg:text-xl font-light",
                    section.align === 'center' ? "max-w-full mx-auto text-center" : "max-w-full"
                )}>
                  <p className="mb-3 sm:mb-4">{section.description}</p>
                </div>

                {/* Features */}
                {section.features && (
                    <div className="grid gap-3 sm:gap-4 mb-8 sm:mb-10">
                      {section.features.map((feature) => (
                          <div
                              key={feature.title}
                              className="group p-4 sm:p-5 lg:p-6 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:border-orange-500/30"
                          >
                            <div className="flex items-start gap-3 sm:gap-4">
                              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-orange-500 mt-1.5 sm:mt-2" />
                              <div className="flex-1 space-y-1.5 sm:space-y-2">
                                <h3 className="font-bold text-white text-base sm:text-lg">{feature.title}</h3>
                                <p className="text-white/60 leading-relaxed text-sm sm:text-base">{feature.description}</p>
                              </div>
                            </div>
                          </div>
                      ))}
                    </div>
                )}

                {/* Actions */}
                {section.actions && (
                    <div className={cn(
                        "flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4",
                        section.align === 'center' && "justify-center",
                        section.align === 'right' && "justify-end",
                        (!section.align || section.align === 'left') && "justify-start"
                    )}>
                      {section.actions.map((action) => (
                          <button
                              key={action.label}
                              onClick={action.onClick}
                              className={cn(
                                  "px-8 py-4 rounded-[32px] font-black transition-all duration-300 hover:scale-[1.05] active:scale-[0.95] text-sm sm:text-base w-full sm:w-auto",
                                  action.variant === 'primary'
                                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600"
                                      : "border-2 border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white"
                              )}
                          >
                            {action.label}
                          </button>
                      ))}
                    </div>
                )}
              </div>
            </section>
        ))}
      </div>
  );
}

// Demo component showcasing the ScrollGlobe
export default function GlobeScrollDemo() {
  const demoSections = [
    {
      id: "hero",
      badge: "Logo",
      title: "Hành Trình Trong Tầm Tay",
      subtitle: "Đặt Tour Dễ Dàng, Trải Nghiệm Đẳng Cấp",
      backgroundImage: "https://i.pinimg.com/1200x/30/a4/a9/30a4a99d01feea27088d6fa609fb9c35.jpg",
      description: "Logo mang đến cho bạn những chuyến đi không chỉ là du lịch, mà là những kỉ niệm vô giá. Với hệ thống đặt tour thông minh, chúng tôi giúp bạn kết nối với những điểm đến mơ ước chỉ trong vài giây.",
      align: "left",
      actions: [
        { label: "Khám Phá Tour Ngay", variant: "primary", onClick: () => window.location.href = "/home" },
        { label: "Về Chúng Tôi", variant: "secondary", onClick: () => window.location.href = "/about" },
      ]
    },
    {
      id: "asia",
      badge: "Châu Á",
      title: "Vẻ Đẹp Á Đông",
      subtitle: "Khám Phá Đông Nam Á",
      backgroundImage: "/landingpage/Châu Á.png",
      description: "Từ những thửa ruộng bậc thang xanh mướt đến những di sản văn hóa nghìn năm. Châu Á luôn là trái tim của những hành trình khám phá đầy cảm hứng và màu sắc.",
      align: "center",
      features: [
        { title: "Tour Đặc Sắc", description: "Những lịch trình được thiết kế riêng biệt để bạn cảm nhận trọn vẹn văn hóa bản địa." },
        { title: "Giá Cả Cạnh Tranh", description: "Cam kết chất lượng dịch vụ tốt nhất với mức giá hợp lý nhất thị trường." }
      ]
    },
    {
      id: "europe",
      badge: "Châu Âu",
      title: "Cổ Kính & Sang Trọng",
      subtitle: "Trái Tim Châu Âu",
      backgroundImage: "/landingpage/Châu Âu.png",
      description: "Khám phá những thành phố lãng mạn như Paris, những kênh đào thơ mộng ở Venice hay vẻ đẹp cổ điển của Prague. Châu Âu luôn là điểm đến mơ ước cho những tâm hồn yêu nghệ thuật và lịch sử.",
      align: "left",
      features: [
        { title: "Kiến Trúc Tuyệt Mỹ", description: "Chiêm ngưỡng những lâu đài và nhà thờ cổ kính hàng thế kỷ." },
        { title: "Trải Nghiệm Đẳng Cấp", description: "Dịch vụ du lịch sang trọng và tinh tế bậc nhất thế giới." }
      ]
    },
    {
      id: "america",
      badge: "Châu Mỹ",
      title: "Sôi Động & Phóng Khoáng",
      subtitle: "Khám Phá Châu Mỹ",
      backgroundImage: "https://i.pinimg.com/1200x/2f/99/ab/2f99abcec76233fb6bec55d524991bc6.jpg",
      description: "Từ những tòa nhà chọc trời ở New York đến vẻ đẹp hoang dã của Amazon, Châu Mỹ là vùng đất của những sự tương phản thú vị. Hãy sẵn sàng cho những cuộc phiêu lưu không giới hạn.",
      align: "center",
      actions: [
        { label: "Tham Gia Ngay", variant: "primary", onClick: () => window.location.href = "/home" },
        { label: "Khám Phá Thêm", variant: "secondary", onClick: () => window.location.href = "/destination" }
      ]
    }
  ];

  return (
      <ScrollGlobe
          sections={demoSections}
      />
  );
}
