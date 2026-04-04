import React from "react";

const Globe = () => {
    return (
        <>
            <style>
                {`
          @keyframes earthRotate {
            0% { background-position: 0 0; }
            100% { background-position: 400px 0; }
          }
          @keyframes twinkling { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
          @keyframes twinkling-slow { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
          @keyframes twinkling-long { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
          @keyframes twinkling-fast { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
        `}
            </style>
            <div className="flex items-center justify-center h-screen">
                <div
                    className="relative w-[250px] h-[250px] rounded-full overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.4),-5px_0_12px_#c3f4ff_inset,15px_2px_30px_#000_inset,-24px_-2px_40px_#c3f4ffcc_inset,250px_0_50px_#00000088_inset,150px_0_45px_#000000cc_inset]"
                    style={{
                        backgroundImage: "url('https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/globe.jpeg')",
                        backgroundSize: "cover",
                        backgroundPosition: "left",
                        animation: "earthRotate 30s linear infinite",
                    }}
                >
                </div>
            </div>
        </>
    );
};

export default Globe;
