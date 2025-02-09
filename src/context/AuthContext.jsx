import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = ({ email, password }) => {
    // Simulate login with mock authentication.
    if (email && password) {
      setUser({ email });
      return true;
    }
    return false;
  };

  const signup = ({ email, password }) => {
    // Simulate signup.
    if (email && password) {
      setUser({ email });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}