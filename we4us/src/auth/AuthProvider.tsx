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
  const { setProfileInfo } = useProfileContext();
  const { setLemmyInfo } = useLemmyInfo();

  function setProfileContext(username: string) {
    fetchProfileByUsername(username).then((userDetails) => {
        if (!userDetails) {
          window.alert("Error getting user profile. Please logout and log back in");
          return;
        }

        setProfileInfo({
          lemmyId: userDetails.id, // Store profile ID
          displayName: userDetails.display_name,
          userName: userDetails.username,
          cohort: userDetails.cohort,
          companyOrUniversity: userDetails.company_or_university,
          currentRole: userDetails.current_role,
          yearsOfExperience: userDetails.years_of_experience,
          areasOfInterest: userDetails.areas_of_interest,
        });

        console.log("User details", userDetails);
      }
    )
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
      getCurrentUserDetails().then((userDetails) => {
        if (userDetails) {
          const username = userDetails.local_user_view.person.name; 
          setProfileContext(username); 
          setLemmyContext();
        }
      });
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