import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Profile {
  id: string;
  username: string;
  displayName: string;
  cohort?: string;
  joinDate: string;
  posts: number;
  comments: number;
}


const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
    
        const response = await fetch(`http://localhost:4000/api/profiles/${id}`); //API URL
        if (!response.ok) {
          throw new Error('Profile not found');
        }
    
        const profileData: Profile = await response.json();
        setProfile(profileData);
      } catch (error) {
        setError('Profile not found or error loading profile.');
      } finally {
        setIsLoading(false);
      }
    };    

    if (id) {
      fetchProfile();
    }
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
      <h1>{profile.displayName}</h1>
      <p>@{profile.username}</p>
      {profile.cohort && <p>Cohort: {profile.cohort}</p>}

      <div>
        <h3>Joined</h3>
        <p>{new Date(profile.joinDate).toDateString()}</p>
        <h3>Posts</h3>
        <p>{profile.posts}</p>
        <h3>Comments</h3>
        <p>{profile.comments}</p>
      </div>

      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default ProfilePage;