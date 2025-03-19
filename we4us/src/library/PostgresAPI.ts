import { API_BASE_URL, PROFILES_ENDPOINT } from "../constants";

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  cohort?: string;
  current_role?: string;
  company_or_university?: string;
  years_of_experience?: number;
  areas_of_interest?: string[];
}

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
      display_name: profile.display_name, 
      cohort: profile.cohort,
      company_or_university: profile.company_or_university, 
      current_role: profile.current_role, 
      years_of_experience: profile.years_of_experience,
      areas_of_interest: profile.areas_of_interest || [],
    };
  } catch (error) {
    console.error("Error fetching profile by username:", error);
    return null; 
  }
};
export const updateProfile = async (username: string, profileData: Profile) => {
  try {
    const url = `${API_BASE_URL}${PROFILES_ENDPOINT}?username=${encodeURIComponent(username)}`;

    const response = await fetch(url, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Update failed. Status:", response.status, "Response:", errorData);
      throw new Error(
        errorData?.message || `Failed to update profile. Status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error(error instanceof Error ? error.message : "Unknown error occurred while updating profile.");
  }
};