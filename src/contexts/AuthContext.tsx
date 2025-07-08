
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('cyberguard_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // For demo purposes, auto-login as demo user
      const demoUser = {
        id: 'demo-user-1',
        email: 'admin@cyberguard.com',
        name: 'Security Administrator',
        role: 'admin'
      };
      setUser(demoUser);
      localStorage.setItem('cyberguard_user', JSON.stringify(demoUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = {
      id: 'user-1',
      email,
      name: 'Security Administrator',
      role: 'admin'
    };
    
    setUser(user);
    localStorage.setItem('cyberguard_user', JSON.stringify(user));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cyberguard_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
