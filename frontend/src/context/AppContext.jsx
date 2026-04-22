import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { getMe, loginApi, logoutApi } from "../services/api";
import { text } from "../utils/lang";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  const [lang, setLang] = useState(
    localStorage.getItem("lang") || "vi"
  );

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const t = useMemo(() => {
    const dict = text?.[lang] || text?.vi || {};
    return (key) => dict[key] || key;
  }, [lang]);

  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return null;
    }
    try {
      const data = await getMe();
      setUser(data.user || null);
      return data.user || null;
    } catch (e) {
      if (e?.status === 401) {
        localStorage.removeItem("token");
        setUser(null);
        return null;
      }
      throw e;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await refreshUser();
      } catch (_e) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async ({ email, password }) => {
    const data = await loginApi({ email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user || null);
    return data.user || null;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (_e) {
      // ignore network errors; logout is client-side token removal
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        lang,
        setLang,
        t,
        user,
        authLoading,
        refreshUser,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);