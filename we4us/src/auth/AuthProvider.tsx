import { createContext, useState, useContext, useMemo, useEffect } from "react";

// Storing jwt in localstorage is our best current option https://stackoverflow.com/questions/69294536/where-to-store-jwt-token-in-react-client-side-in-secure-way
// since making backend changes is not feasible at present
// additionally, most references follow this approach
// References:
// https://dev.to/sanjayttg/jwt-authentication-in-react-with-react-router-1d03
// https://medium.com/@simonsruggi/how-to-implement-jwt-authentication-with-react-and-node-js-5d8bf3e718d0
// TODO: Inspect security considerations & possibly explore setting credentials via cookies

type contextValueType = {
  token: string | null;
  setToken: (newToken: string) => void;
}

// AuthContext must only be used in components under AuthProvider
const AuthContext = createContext<contextValueType>({
  token: null,
  setToken: () => { }
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  // update store whenever token changes
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token])

  // ensure unnecessary rerenders are not triggered
  const contextValue: contextValueType = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token]
  );
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}