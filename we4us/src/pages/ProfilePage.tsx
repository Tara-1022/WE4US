import React from 'react';
import { useParams } from 'react-router-dom';

interface Profile {
  id: string;
  username: string;
  displayName: string;
  cohort?: string;
  joinDate: string;
  posts: number;
  comments: number;
}

// Dummy data for profiles
const DUMMY_PROFILES: Profile[] = [
  {
    id: '1',
    username: 'techleader',
    displayName: 'Tara',
    cohort: 'Cohort 4',
    joinDate: '15/06/24',
    posts: 142,
    comments: 358
  },
  {
    id: '2',
    username: 'designwizard',
    displayName: 'Saathwika',
    cohort: 'Cohort 5',
    joinDate: '22/08/24',
    posts: 87,
    comments: 245
  },
  {
    id: '3',
    username: 'codemaster',
    displayName: 'Nishita',
    cohort: 'Cohort 6',
    joinDate: '10/09/24',
    posts: 56,
    comments: 189
  },
  {
    id: '4',
    username: 'community_builder',
    displayName: 'Soumili',
    cohort: 'Cohort 5',
    joinDate: '05/07/24',
    posts: 198,
    comments: 567
  }
];

const ProfilePage = () => {
  const { displayName } = useParams<{ displayName: string }>();
  
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const profileData = DUMMY_PROFILES.find(profile => profile.displayName === displayName);
        if (!profileData) {
          throw new Error('Profile not found');
        }

        setProfile(profileData);
      } catch (error) {
        setError('Profile not found or error loading profile.');
      } finally {
        setIsLoading(false);
      }
    };

    if (displayName) {
      fetchProfile();
    }
  }, [displayName]);

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
        <button onClick={() => window.history.back()}>Back to Who's Who</button>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1>{profile.displayName}</h1>
        <p>@{profile.username}</p>
        {profile.cohort && (
          <span>{profile.cohort}</span>
        )}
      </div>

      <div>
        <div>
          <h3>Joined</h3>
          <p>{profile.joinDate}</p>
        </div>
        <div>
          <h3>Posts</h3>
          <p>{profile.posts}</p>
        </div>
        <div>
          <h3>Comments</h3>
          <p>{profile.comments}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
