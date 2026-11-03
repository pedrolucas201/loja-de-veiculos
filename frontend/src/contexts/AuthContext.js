// src/contexts/AuthContext.js
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = useCallback(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);

        // Verifica se o token expirou (tempo em segundos no JWT, Date.now() em milissegundos)
        if (decoded.exp * 1000 < Date.now()) {
          console.warn("AuthContext: Token expirado, efetuando logout.");
          logout();
        } else {
          setUser(decoded);
          const currentIsAdmin = decoded.role === 'admin';
          setIsAdmin(currentIsAdmin);
        }
      } catch (error) {
        console.error("AuthContext: Erro ao decodificar token JWT:", error);
        logout();
      }
    } else {
      setUser(null);
      setIsAdmin(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = (token) => {
    localStorage.setItem('token', token);
    checkAuthStatus(); // Dispara a reavaliação do token
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAdmin(false);
  };

  const authValue = {
    user,
    isAdmin, // Valor atual de isAdmin
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};