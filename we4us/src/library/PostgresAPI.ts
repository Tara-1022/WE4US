import { API_BASE_URL, PROFILES_ENDPOINT } from "../constants";

export const fetchProfiles = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}${PROFILES_ENDPOINT}`);
    if (!response.ok) {
      throw new Error("Failed to fetch profiles");
    }
    const jsonData = await response.json();

    return jsonData.profiles.map((p: any) => ({
      id: p.id,
      username: p.username,
      displayName: p.display_name, 
      cohort: p.cohort,
      companyOrUniversity: p.company_or_university,
      currentRole: p.current_role,
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Unknown error occurred.");
    }
  }
};

export const fetchProfileById = async (id: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}${PROFILES_ENDPOINT}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Unknown error occurred.");
    }
  }
};

export const fetchProfileByUsername = async (username: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}${PROFILES_ENDPOINT}?username=${encodeURIComponent(username)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch profile for username: ${username}`);
    }

    const jsonData = await response.json();
    const profile = jsonData.profiles.find((p: any) => p.username === username);

    if (!profile) {
      throw new Error(`Profile not found for username: ${username}`);
    }

    return {
      id: profile.id,
      username: profile.username,
      displayName: profile.display_name,
      cohort: profile.cohort,
      companyOrUniversity: profile.company_or_university,
      currentRole: profile.current_role,
      yearsOfExperience: profile.years_of_experience,
      areasOfInterest: profile.areas_of_interest || [],
    };
  } catch (error) {
    console.error("Error fetching profile by username:", error);
    return null; // Return null if an error occurs
  }
};
