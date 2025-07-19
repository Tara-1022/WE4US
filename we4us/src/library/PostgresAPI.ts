import { POSTGRES_API_BASE_URL, POSTGRES_PROFILES_ENDPOINT, POSTGRES_MESSAGES_ENDPOINT } from "../constants";
import { getLemmyToken } from "./LemmyApi"

export interface Profile {
  username: string;
  display_name: string;
  cohort?: string;
  current_role?: string;
  company_or_university?: string;
  working_since?: string;
  areas_of_interest?: string[];
  image_filename?: string | null;
  image_delete_token?: string | null;
  description?: string;
}

export interface Message {
  id: string;
  from_user: string;
  to_user: string;
  body: string;
  inserted_at: string;
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

/**
 * Fetches a profile by username.
 * @param username - The username of the profile to fetch.
 * @returns {Profile | null} - Returns the profile object if found, otherwise null.
 */
export const fetchProfileByUsername = async (username: string) => {
  try {
    const response = await fetch(`${POSTGRES_API_BASE_URL}${POSTGRES_PROFILES_ENDPOINT}/${encodeURIComponent(username)}`
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch profile for username: ${username}. Status: ${response.status}`);
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

    const jwt = getLemmyToken();
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(jwt && { Authorization: `Bearer ${jwt}` })
      },
      body: JSON.stringify({ profile: profileData }),
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

// Messages

export const fetchLastMessages = async (username: string) => {
  try {

    const jwt = getLemmyToken();
    const response = await fetch(
      `${POSTGRES_API_BASE_URL}${POSTGRES_MESSAGES_ENDPOINT}/last/${username}`,
      {
        headers: {
          ...(jwt && { Authorization: `Bearer ${jwt}` })
        }
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }
    const jsonData = await response.json();

    return jsonData.messages.map((m: any) => (m as Message));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Unknown error occurred.");
    }
  }
};