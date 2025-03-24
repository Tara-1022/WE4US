import { API_BASE_URL, PROFILES_ENDPOINT } from "../constants";

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
    const response = await fetch(`${API_BASE_URL}${PROFILES_ENDPOINT}`);

    if (!response.ok) {
      return { success: false, error: "Failed to fetch profiles" };
    }
    
    const jsonData = await response.json();
    return { success: true, data: jsonData.profiles.map((p: any) => (p as Profile)) };
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return { success: false, error: "Unexpected error while fetching profiles." };
  }
};

export const fetchProfileByUsername = async (username: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}${PROFILES_ENDPOINT}/${encodeURIComponent(username)}`
);
    
    if (!response.ok) {
      return { success: false, error: `Profile not found for username: ${username}` };
    }

    const jsonData = await response.json();

    if (!jsonData.profile) {
      return { success: false, error: `Profile not found for username: ${username}` };
    }

    return { success: true, data: jsonData.profile as Profile };
  } catch (error) {
    console.error("Error fetching profile by username:", error);
    return { success: false, error: "Unexpected error while fetching profile." };
  }
};

export const updateProfile = async (username: string, profileData: Profile) => {
  try {
    const url = `${API_BASE_URL}${PROFILES_ENDPOINT}/${username}`;

    const response = await fetch(url, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    const errorData = await response.json().catch(() => null);

    if (!response.ok) {
      return { success: false, error: errorData?.message || `Failed to update profile. Status: ${response.status}` };
    }

    return { success: true, data: await response.json() };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Unexpected error while updating profile." };
  }
};