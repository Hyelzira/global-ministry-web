import { createContext, useContext, useState } from 'react';

interface AdminThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
});

export const AdminThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false); // white by default

  const toggleTheme = () => setIsDark(d => !d);

  return (
    <AdminThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </AdminThemeContext.Provider>
  );
};

export const useAdminTheme = () => useContext(AdminThemeContext);