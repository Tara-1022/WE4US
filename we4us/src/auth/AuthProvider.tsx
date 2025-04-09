import { createContext, useState, useContext, useMemo, useEffect } from "react";
import { setClientToken, getCommunityList, getCurrentUserDetails } from "../library/LemmyApi";
import { fetchProfileByUsername } from "../library/PostgresAPI";
import { useProfileContext } from "../components/ProfileContext";
import { useLemmyInfo } from "../components/LemmyContextProvider";

// Storing jwt in localstorage is our best current option https://stackoverflow.com/questions/69294536/where-to-store-jwt-token-in-react-client-side-in-secure-way
// since making backend changes is not feasible at present
// additionally, most references follow this approach
// References:
// https://dev.to/sanjayttg/jwt-authentication-in-react-with-react-router-1d03
// https://medium.com/@simonsruggi/how-to-implement-jwt-authentication-with-react-and-node-js-5d8bf3e718d0
// TODO: Inspect security considerations & possibly explore setting credentials via cookies

type contextValueType = {
  token: string | null;
  setToken: (newToken: string | null) => void;
}

// Note: AuthContext must only be used in components under AuthProvider
const AuthContext = createContext<contextValueType>({
  token: null,
  setToken: () => { }
});

// Dev note: token must be set/reset ONLY via the provided function
export const useAuth = () => {
  return useContext(AuthContext);
};

async function getPostgresProfile(username: string) {
  try {
    const postgresProfile = await fetchProfileByUsername(username);
    if (!postgresProfile) throw new Error("Postgres Profile empty!");
    return postgresProfile;
  } catch (error) {
    console.error("Error fetching postgres profile details:", error);
    window.alert("Unable to fetch Postgres profile info. Some features of the site may not work; try logging out and logging back in. If the issue persists, contact the admins.");
  }
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const { setProfileInfo } = useProfileContext();
  const { setLemmyInfo } = useLemmyInfo();

  async function setProfileContext() {
    try {
      const userDetails = await getCurrentUserDetails();
      if (!userDetails) {
        throw new Error("No User details found");
      }

      // Store Lemmy profile info separately
      const lemmyProfileInfo = {
        lemmyId: userDetails.local_user_view.person.id,
        displayName: userDetails.local_user_view.person.display_name || userDetails.local_user_view.person.name,
        userName: userDetails.local_user_view.person.name,
        isAdmin: userDetails.local_user_view.local_user.admin
      };

      setProfileInfo(lemmyProfileInfo);

      // Fetch PostgreSQL details
      const postgresProfile = await getPostgresProfile(lemmyProfileInfo.userName);
      if (!postgresProfile) return;
      setProfileInfo({ ...lemmyProfileInfo, ...postgresProfile });

    }  catch (error) {
        console.error("Error fetching profile details:", error);
        window.alert("Unable to fetch Lemmy profile info. Some features of the site may not work; try logging out and logging back in. If the issue persists, contact the admins.");
      }
  }

  function setLemmyContext() {
    getCommunityList().then((communityList) => {
        setLemmyInfo({communities: communityList});
      })
      .catch((error) => {
        console.error("Error fetching community list:", error);
      });
  }

  useEffect(() => {
    setClientToken(token);
    if (token) {
      setProfileContext().catch((error) => {
        console.error(error);
      });
      setLemmyContext();
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);
  

  // ensure unnecessary rerenders are not triggered
  const contextValue: contextValueType = useMemo(
    () => ({ token, setToken}),
    [token]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}