import { createContext, useContext, useState, useMemo } from "react";
import Cookies from "js-cookie";
import { CURRENT_PROJECT } from "constants/cookies";

interface CookieContextState {
  recentProjectCookie: string;
  setRecentProjectCookie: (recentProjectCookie: string) => void;
}

export const CookieContext = createContext<CookieContextState | null>(null);

const useCookieContext = (): CookieContextState => {
  const context = useContext(CookieContext);
  if (context === null || context === undefined) {
    throw new Error("useCookieContext must be used within a CookieProvider");
  }
  return context;
};

const CookieProvider: React.VFC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [recentProject, setRecentProject] = useState(
    Cookies.get(CURRENT_PROJECT)
  );
  const cookieContext = useMemo(
    () => ({
      recentProjectCookie: recentProject,
      setRecentProjectCookie: (newProject: string) => {
        setRecentProject(newProject);
        Cookies.set(CURRENT_PROJECT, newProject);
      },
    }),
    [recentProject]
  );

  return (
    <CookieContext.Provider value={cookieContext}>
      {children}
    </CookieContext.Provider>
  );
};

export { CookieProvider, useCookieContext };
