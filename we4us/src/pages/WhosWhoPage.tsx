import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Profile {
  id: string;
  username: string;
  profileId: string;
  cohort?: string;
}

// Dummy data
const DUMMY_PROFILES: Profile[] = [
  {
    id: '1',
    username: 'techleader',
    profileId: 'Tara',
    cohort: 'Cohort 4'
  },
  {
    id: '2',
    username: 'designwizard',
    profileId: 'Saathwika',
    cohort: 'Cohort 5'
  },
  {
    id: '3',
    username: 'codemaster',
    profileId: 'Nishita',
    cohort: 'Cohort 6'
  },
  {
    id: '4',
    username: 'community_builder',
    profileId: 'Soumili',
    cohort: 'Cohort 5'
  }
];

interface WhosWhoPageProps {
  onProfileSelect?: (profileId: string) => void;
  baseProfileUrl?: string;
}

const WhosWhoPage = ({ 
  onProfileSelect, 
  baseProfileUrl = '/profile' 
}: WhosWhoPageProps) => {
  const [profiles, setProfiles] = React.useState<Profile[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setProfiles(DUMMY_PROFILES);
      } catch (error) {
        setError('Unable to load profiles. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleProfileClick = (profileId: string) => {
    if (onProfileSelect) {
      onProfileSelect(profileId);
    } else {
      navigate(`${baseProfileUrl}/${profileId}`);
    }
  };

  if (isLoading) {
    return (
      <div>
        <p>Loading profiles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Who's Who</h1>
      {profiles.length === 0 ? (
        <p>No profiles found.</p>
      ) : (
        <div>
          {profiles.map((profile) => (
            <div key={profile.id} onClick={() => handleProfileClick(profile.profileId)}>
              <div>
                <h2>{profile.profileId}</h2>
                <p>@{profile.username}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WhosWhoPage;
