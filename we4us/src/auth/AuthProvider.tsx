import { createContext, useState, useContext, useMemo, useEffect } from "react";
import { setClientToken, getCommunityList, getCurrentUserDetails } from "../library/LemmyApi";
import { fetchProfileByUsername } from "../library/PostgresAPI";
import { useProfileContext } from "../components/ProfileContext";
import { useLemmyInfo } from "../components/LemmyContextProvider";
import { TOKEN_AGE_MS, TOKEN_VALIDITY_MS } from '../constants';

// Storing jwt in localstorage is our best current option https://stackoverflow.com/questions/69294536/where-to-store-jwt-token-in-react-client-side-in-secure-way
// since making backend changes is not feasible at present
// additionally, most references follow this approach
// References:
// https://dev.to/sanjayttg/jwt-authentication-in-react-with-react-router-1d03
// https://medium.com/@simonsruggi/how-to-implement-jwt-authentication-with-react-and-node-js-5d8bf3e718d0
// TODO: Inspect security considerations & possibly explore setting credentials via cookies

type contextValueType = {
  tokenA: string | null;
  tokenB: string | null;
  setTokenA: (newToken: string | null) => void;
  setTokenB: (newToken: string | null) => void;
  setLastUpdateTimestamp: (timestamp: number) => void;
  setProfileContext: () => void;
  setLemmyContext: () => void;
}

// Note: AuthContext must only be used in components under AuthProvider
const AuthContext = createContext<contextValueType>({
  tokenA: null,
  tokenB: null,
  setTokenA: () => { },
  setTokenB: () => { },
  setLastUpdateTimestamp: () => { },
  setProfileContext: () => { },
  setLemmyContext: () => { }
});

// Dev note: token must be set/reset ONLY via the provided function
export const useAuth = () => {
  return useContext(AuthContext);
};

async function getPostgresProfile(username: string) {
  try {
    const postgresProfile = await fetchProfileByUsername(username);
    if (!postgresProfile) throw new Error("Postgres Profile empty!");
    return {
      cohort: postgresProfile.cohort,
      companyOrUniversity: postgresProfile.company_or_university,
      currentRole: postgresProfile.current_role,
      yearsOfExperience: postgresProfile.years_of_experience,
      areasOfInterest: postgresProfile.areas_of_interest,
    };
  } catch (error) {
    console.error("Error fetching postgres profile details:", error);
    window.alert("Unable to fetch Postgres profile info. Some features of the site may not work; try logging out and logging back in. If the issue persists, contact the admins.");
  }
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [tokenA, setTokenA] = useState<string | null>(localStorage.getItem("tokenA"));
  const [tokenB, setTokenB] = useState<string | null>(localStorage.getItem("tokenB"));
  const [tokenTimestamp, setLastUpdateTimestamp] = useState<number | null>(localStorage.getItem("tokenTimestamp") ? Number(localStorage.getItem("tokenTimestamp")) : null);

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

    } catch (error) {
      console.error("Error fetching profile details:", error);
      window.alert("Unable to fetch Lemmy profile info. Some features of the site may not work; try logging out and logging back in. If the issue persists, contact the admins.");
    }
  }

  function setLemmyContext() {
    getCommunityList().then((communityList) => {
      setLemmyInfo({ communities: communityList });
    })
      .catch((error) => {
        console.error("Error fetching community list:", error);
      });
  }

  useEffect(() => {
    if (!tokenA || !tokenB || !tokenTimestamp) {
      return;
    }

    const rotateActiveToken = () => {
      const now = Date.now();
      const tokenAge = now - tokenTimestamp;

      //Validate token to be rotated if tokenAge is greater than 15 minutes
      if (tokenAge > TOKEN_AGE_MS) {
        const newActiveToken = localStorage.getItem("activeToken") === tokenA ? tokenB : tokenA;
        if (newActiveToken) {
          setLastUpdateTimestamp(now);
          localStorage.setItem("activeToken", newActiveToken);
          localStorage.setItem("tokenTimestamp", now.toString());
          setClientToken(newActiveToken);

          localStorage.setItem("token", newActiveToken);
        } else {
          console.error("Token rotation failed: newActiveToken is null");
          window.alert("try logging out and logging back in. If the issue persists, contact the admins.");
        }
      }
    };

    rotateActiveToken();
    //Check token validity every 5 mins
    const interval = setInterval(rotateActiveToken, TOKEN_VALIDITY_MS);

    return () => clearInterval(interval);
  }, [tokenA, tokenB, tokenTimestamp]);

  // ensure unnecessary rerenders are not triggered
  const contextValue: contextValueType = useMemo(
    () => ({ tokenA, tokenB, setTokenA, setTokenB, setLastUpdateTimestamp, setProfileContext, setLemmyContext, }),
    [tokenA, tokenB, setTokenA, setTokenB, setLastUpdateTimestamp, setProfileContext, setLemmyContext]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}