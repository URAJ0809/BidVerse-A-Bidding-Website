// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';

// Create the context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  // On initial load, try to get user from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('bidverseUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // When user logs in, store user in state + localStorage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('bidverseUser', JSON.stringify(userData));
  };

  // When user logs out, clear from state + localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('bidverseUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}
