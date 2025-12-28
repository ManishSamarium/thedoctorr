import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../api/auth.api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on app load
  useEffect(() => {
    const loadUser = async () => {
      try {
        setError(null);
        const res = await getMe();
        if (res.data) {
          setUser(res.data);
        } else {
          setUser(null);
        }
      } catch (err) {
        // User is not logged in, which is fine
        console.debug("User not authenticated:", err.message);
        setUser(null);
        setError(null); // Don't show error for not being logged in
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Improved setUser function that properly updates state
  const updateUser = (userData) => {
    if (userData) {
      setUser(userData);
    } else {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser: updateUser, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
