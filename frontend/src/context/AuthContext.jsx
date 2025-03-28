import { createContext, useState, useEffect } from "react";
import { useNotification } from "./NotificationContext";

const backendUrl = import.meta.env.VITE_backendUrl

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true); // ✅ Add loading state


  // ✅ Check user authentication on page load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        if (res.ok) {
          setUser(data); // ✅ Set authenticated user
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setUser(null);
      } finally {
        setLoading(false); // ✅ Done loading
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data);
        showNotification("Login successful!", "success");
      } else {
        showNotification(`Login Failed ${data.message}`,"failed");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch(`${backendUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        showNotification("Registerd successful!", "success");
      } else {
        showNotification(`Registration Failed ${data.message}`,"failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const handleLogout = async (navigate) => {
    try {
      await fetch(`${backendUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      setUser(null);
      showNotification("logout successfully!", "success");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
