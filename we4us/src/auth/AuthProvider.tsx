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

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const { setProfileInfo, profileInfo } = useProfileContext();
  const { setLemmyInfo } = useLemmyInfo();

  function setProfileContext() {
    getCurrentUserDetails().then(async (userDetails) => {
      if (!userDetails) {
        window.alert("Error getting user profile. Please logout and log back in");
        return;
      }

      setProfileInfo({
        lemmyId: userDetails.local_user_view.person.id,
        displayName: userDetails.local_user_view.person.display_name || userDetails.local_user_view.person.name,
        userName: userDetails.local_user_view.person.name
      });

      console.log("User details", userDetails);

      // Fetch additional profile details from PostgreSQL
      try {
        const postgresProfile = await fetchProfileByUsername(userDetails.local_user_view.person.name);
        if (postgresProfile) {
          setProfileInfo({
            lemmyId: profileInfo?.lemmyId ?? userDetails.local_user_view.person.id, // Ensure lemmyId is always a number
            displayName: profileInfo?.displayName ?? (userDetails.local_user_view.person.display_name || userDetails.local_user_view.person.name),
            userName: profileInfo?.userName ?? userDetails.local_user_view.person.name,
            cohort: postgresProfile.cohort,
            companyOrUniversity: postgresProfile.company_or_university,
            currentRole: postgresProfile.current_role,
            yearsOfExperience: postgresProfile.years_of_experience,
            areasOfInterest: postgresProfile.areas_of_interest,
          });          
          
        }
      } catch (error) {
        console.error("Error fetching additional profile details:", error);
      }
    });
  }

  function setLemmyContext() {
    getCommunityList().then(
      (communityList) => {
        setLemmyInfo({
          communities: communityList
        })
      }
    )
  }

  useEffect(() => {
    setClientToken(token);
    if (token) {
      setProfileContext();
      setLemmyContext();
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);
  

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