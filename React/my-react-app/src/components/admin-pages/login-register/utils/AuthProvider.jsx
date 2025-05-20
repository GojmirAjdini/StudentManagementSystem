import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from './services/axiosInstance';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await axiosInstance.get("admin/check-authentication");
        setUserRole(res.data.role);
      } catch (err) {
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  return (
    <AuthContext.Provider value={{ userRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
