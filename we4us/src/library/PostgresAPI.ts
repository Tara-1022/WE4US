import { POSTGRES_API_BASE_URL, POSTGRES_PROFILES_ENDPOINT } from "../constants";

export interface Profile {
  username: string;
  display_name: string;
  cohort?: string;
  current_role?: string;
  company_or_university?: string;
  years_of_experience?: number | null;
  areas_of_interest?: string[];
}

export const fetchProfiles = async () => {
  try {
    const response = await fetch(`${POSTGRES_API_BASE_URL}${POSTGRES_PROFILES_ENDPOINT}`);
    if (!response.ok) {
      throw new Error("Failed to fetch profiles");
    }
    const jsonData = await response.json();

    return jsonData.profiles.map((p: any) => (p as Profile));
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
    const response = await fetch(`${POSTGRES_API_BASE_URL}${POSTGRES_PROFILES_ENDPOINT}/${encodeURIComponent(username)}`
);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch profile for username: ${username}`);
    }

    const jsonData = await response.json();

    if (!jsonData.profile) {
      throw new Error(`Profile not found for username: ${username}`);
    }

    return jsonData.profile as Profile;
  } catch (error) {
    console.error("Error fetching profile by username:", error);
    return null; 
  }
};

export const updateProfile = async (username: string, profileData: Profile) => {
  try {
    const url = `${POSTGRES_API_BASE_URL}${POSTGRES_PROFILES_ENDPOINT}/${username}`;

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