import { createContext, useState, useContext, useMemo, useEffect } from "react";
import { setClientToken, getCurrentUserDetails, getCommunityDetailsFromName } from "../library/LemmyApi";
import { fetchProfileByUsername } from "../library/PostgresAPI";
import { useProfileContext } from "../components/ProfileContext";
import { useLemmyInfo } from "../components/LemmyContextProvider";
import { ANNOUNCEMENTS_COMMUNITY_NAME, JOB_BOARD_COMMUNITY_NAME, MEET_UP_COMMUNITY_NAME, PG_FINDER_COMMUNITY_NAME } from "../constants";
import { CommunityView } from "lemmy-js-client";

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

    } catch (error) {
      console.error("Error fetching profile details:", error);
      window.alert("Unable to fetch Lemmy profile info. Some features of the site may not work; try logging out and logging back in. If the issue persists, contact the admins.");
    }
  }

<<<<<<< HEAD
  function setLemmyContext() {
    getCommunityList()
      .then((communityList) => {
        console.log(communityList);
        setLemmyInfo({
          communities: communityList
        });
      })
      .catch((error) => {
        console.error("Error fetching community list:", error);
      });
}

=======
  async function setLemmyContext() {
    try {
      const job_board_details: CommunityView = await getCommunityDetailsFromName(JOB_BOARD_COMMUNITY_NAME);
      const meet_up_details: CommunityView = await getCommunityDetailsFromName(MEET_UP_COMMUNITY_NAME);
      const pg_finder_details: CommunityView = await getCommunityDetailsFromName(PG_FINDER_COMMUNITY_NAME);
      const announcements_details: CommunityView = await getCommunityDetailsFromName(ANNOUNCEMENTS_COMMUNITY_NAME);
      setLemmyInfo({
        job_board_details: job_board_details,
        meet_up_details: meet_up_details,
        pg_finder_details: pg_finder_details,
        announcements_details: announcements_details
      })
    }
    catch (error) {
      // TODO: More specific errors
      console.error("Error fetching details:", error);
    };
  }
>>>>>>> main

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
      setProfileInfo(undefined);
    }
  }, [token]);


  // ensure unnecessary rerenders are not triggered
  const contextValue: contextValueType = useMemo(
    () => ({ token, setToken }),
    [token]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}