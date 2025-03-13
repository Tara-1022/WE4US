import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {fetchProfileByUsername } from "../library/PostgresAPI"; 
import { useProfileContext } from '../components/ProfileContext';
import { Loader } from 'lucide-react';

interface Profile {
  id: string;
  username: string;
  display_name: string;
  cohort?: string;
  current_role?: string;
  company_or_university?: string;
  years_of_experience?: number;
  areas_of_interest?: string[];
}


const ProfilePage = () => {
  const { username: paramUsername } = useParams<{ username?: string }>();
  const navigate = useNavigate();
  const { profileInfo } = useProfileContext();

  const username = paramUsername || profileInfo?.userName; 
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!username) {
      navigate('/login');
      return;
    }

    const getProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetchProfileByUsername(username);

        if (!response) {
          setError("Profile not found.");
          return;
        }

        setProfile(response);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };    

    getProfile();
  }, [username, navigate]);
  

  if (isLoading) {
    return <Loader />;
  }

  if (error || !profile) {
    return (
      <div>
        <p>{error || 'Profile not found'}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>{profile.display_name}</h1>
      <p>@{profile.username}</p>

      {profile.cohort && <p>Cohort: {profile.cohort}</p>}
      {profile.current_role && <p>Current Role: {profile.current_role}</p>}
      {profile.company_or_university && <p>Company/University: {profile.company_or_university}</p>}
      {profile.years_of_experience !== undefined && profile.years_of_experience !== null && profile.years_of_experience !== 0 && (
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
    </div>
  );
};

export default ProfilePage;