import { useEffect, useState } from "react";
import authService from "../services/authService.js";

const fallbackUser = {
  ho_ten: "Traveler",
  fullName: "Traveler",
  anh_dai_dien: "",
  avatarUrl: "",
  ngay_tao: null,
  diem: 0,
};

export function useCurrentUserProfile() {
  const [user, setUser] = useState(() => authService.getCurrentUser() || fallbackUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadUser = async () => {
      setLoading(true);
      const localUser = authService.getCurrentUser();
      if (localUser && active) {
        setUser(localUser);
      }

      const freshUser = await authService.fetchCurrentUser();
      if (active) {
        setUser(freshUser || localUser || fallbackUser);
        setLoading(false);
      }
    };

    loadUser();

    const handleAuthChange = () => loadUser();
    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      active = false;
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  return { user, loading };
}
