import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia(
        "(prefers-color-scheme: dark)",
    );
    const handleThemeChange = (e) => {
      if (e.matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };
    handleThemeChange(darkModeMediaQuery);
    darkModeMediaQuery.addEventListener("change", handleThemeChange);
    return () =>
        darkModeMediaQuery.removeEventListener("change", handleThemeChange);
  }, []);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        if (data.dbConnected) {
          console.log("MongoDB connected:", data);
        } else {
          console.warn("MongoDB not connected:", data);
        }
      })
      .catch((error) => {
        console.error("Cannot reach /api/health:", error);
      });
  }, []);

  return (
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
  );
};

export default App;
