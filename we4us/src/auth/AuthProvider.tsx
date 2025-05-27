import { createContext, useState, useContext, useMemo, useEffect } from "react";
import { setClientToken, getCurrentUserDetails, getCommunityDetailsFromName } from "../library/LemmyApi";
import { fetchProfileByUsername } from "../library/PostgresAPI";
import { useProfileContext } from "../components/ProfileContext";
import { useLemmyInfo } from "../components/LemmyContextProvider";
import { MAX_WARNINGS, MILLISECONDS_IN_AN_HOUR, SESSION_DURATION, WARNING_INTERVAL, ANNOUNCEMENTS_COMMUNITY_NAME, JOB_BOARD_COMMUNITY_NAME, MEET_UP_COMMUNITY_NAME, PG_FINDER_COMMUNITY_NAME } from "../constants";
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
  logout: () => void;
  isLoggedIn: boolean;
}

// Note: AuthContext must only be used in components under AuthProvider
const AuthContext = createContext<contextValueType>({
  token: null,
  setToken: () => { },
  logout: () => { },
  isLoggedIn: false
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
  const { setLemmyInfo } = useLemmyInfo();
  const { setProfileInfo } = useProfileContext();
  const isLoggedIn = token !== null;

  async function setProfileContext() {
    try {
      const userDetails = await getCurrentUserDetails();
      if (!userDetails) {
        throw new Error("No User details found");
      }

      // Store Lemmy profile info separately
      const lemmyProfileInfo = {
        lemmyId: userDetails.local_user_view.person.id,
        display_name: userDetails.local_user_view.person.display_name || userDetails.local_user_view.person.name,
        username: userDetails.local_user_view.person.name,
        isAdmin: userDetails.local_user_view.local_user.admin
      };
      setProfileInfo(lemmyProfileInfo);

      // Fetch PostgreSQL details
      const postgresProfile = await getPostgresProfile(lemmyProfileInfo.username);
      if (!postgresProfile) return;

      setProfileInfo({ ...lemmyProfileInfo, ...postgresProfile });

    } catch (error) {
      console.error("Error fetching profile details:", error);
      window.alert("Unable to fetch Lemmy profile info. Some features of the site may not work; try logging out and logging back in. If the issue persists, contact the admins.");
    }
  }

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

  function logout() {
    setToken(null);
    localStorage.clear();
    console.log("User has been logged out.");
  }

  // Function to check if it's time to log out
  function checkTimeForLogout() {
    const lastLogin = localStorage.getItem("lastLogin");
    if (!lastLogin) {
      logout();
      return;
    }

    const lastLoginDate = new Date(lastLogin);
    const now = new Date();
    const timeDiff = now.getTime() - lastLoginDate.getTime();

    let warningCount = parseInt(localStorage.getItem("warningCount") || "0");

    if (timeDiff >= SESSION_DURATION + (MAX_WARNINGS * WARNING_INTERVAL)) {
      logout();
      window.alert("You have been logged out for security purposes. Kindly log in again");
    }
    if (timeDiff >= SESSION_DURATION) {
      //User is given 3 warnings to perform logout
      if (warningCount < MAX_WARNINGS) {
        warningCount += 1;
        localStorage.setItem("warningCount", warningCount.toString());
        window.alert("Kindly logout and re-login for your account security purposes. If not, force logout will be performed.");
      }
    }
  }

  // Periodically check logout time
  useEffect(() => {
    const intervalId = setInterval(checkTimeForLogout, MILLISECONDS_IN_AN_HOUR);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setClientToken(token);
    if (token) {
      const lastLogin = localStorage.getItem("lastLogin") || new Date().toISOString();
      localStorage.setItem("lastLogin", lastLogin);
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
    () => ({ token, setToken, logout, isLoggedIn }),
    [token]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

