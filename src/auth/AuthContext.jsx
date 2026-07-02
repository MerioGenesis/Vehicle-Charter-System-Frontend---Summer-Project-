import { createContext, useContext, useState, useCallback } from "react";
import { loadSession, saveSession, clearSession } from "../api/session";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadSession()?.user ?? null);

  // session = { token, user }
  const login = useCallback((session) => {
    saveSession(session);
    setUser(session.user);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  // Patches the current user in place (e.g. after editing a profile field)
  // and keeps localStorage in sync so a refresh doesn't lose the change.
  const updateCurrentUser = useCallback((patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      const session = loadSession();
      if (session) saveSession({ ...session, user: next });
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- co-locating the hook with its Provider is clearer than a separate file for two tightly-coupled exports
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
