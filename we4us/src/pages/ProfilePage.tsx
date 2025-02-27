import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProfileById } from "../api"; 

interface Profile {
  id: string;
  username: string;
  display_name: string;
  cohort?: string;
  // joinDate: string;
  // posts: number;
  // comments: number;
  current_role?: string;
  company_or_university?: string;
  years_of_experience?: number;
  areas_of_interest?: string[];
}


const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const getProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetchProfileById(Number(id));

        if (response && response.profile) {
          setProfile({ ...response.profile});
        } else {
          setError("Profile not found.");
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    };    

    getProfile();
  }, [id]);
  

  if (isLoading) {
    return (
      <div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div>
        <p>{error || 'Profile not found'}</p>
        <button onClick={() => navigate(-1)}>Back to Who's Who</button>
      </div>
    );
  }

  return (
    <div>
      <h1>{profile.display_name || "No Display Name"}</h1>
      <p>@{profile.username || "No Username"}</p>

      {profile.cohort && <p>Cohort: {profile.cohort}</p>}
      {profile.current_role && <p>Current Role: {profile.current_role}</p>}
      {profile.company_or_university && <p>Company/University: {profile.company_or_university}</p>}
      {profile.years_of_experience !== undefined && profile.years_of_experience !== null && (
        <p>Years of Experience: {profile.years_of_experience}</p>
      )}
      {profile.areas_of_interest && profile.areas_of_interest.length > 0 && (
        <div>
          <h3>Areas of Interest</h3>
          <ul>
            {profile.areas_of_interest.map((area, index) => (
              <li key={index}>{area}</li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default ProfilePage;