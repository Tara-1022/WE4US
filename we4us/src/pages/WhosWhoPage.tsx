import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProfiles } from "../api"; 

interface Profile {
  id: number;
  username: string;
  displayName: string;
  cohort?: string;
}

const WhosWhoPage: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getProfiles = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const profilesData = await fetchProfiles();
        setProfiles(profilesData);

      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }; 

    getProfiles();
  }, []);

  const handleProfileClick = (id: number) => {
    navigate(`/profile/${id}`);
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
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  const groupedProfiles: { [key: string]: Profile[] } = {};
  profiles.forEach((profile) => {
    const cohortKey = profile.cohort || "Unassigned";
    if (!groupedProfiles[cohortKey]) {
      groupedProfiles[cohortKey] = [];
    }
    groupedProfiles[cohortKey].push(profile);
  });

  const sortedCohorts = Object.keys(groupedProfiles)
    .map((cohort) => (cohort === "Unassigned" ? Infinity : Number(cohort)))
    .sort((a, b) => a - b)
    .map((cohort) => (cohort === Infinity ? "Unassigned" : String(cohort)));

  return (
    <div>
      <h1>Who's Who</h1>
      {sortedCohorts.map((cohort) => (
        <div key={cohort}>
          <h2>Cohort {cohort}</h2>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {groupedProfiles[cohort].map((profile) => (
              <div
                key={profile.id}
                onClick={() => handleProfileClick(profile.id)}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  borderRadius: "8px",
                  textAlign: "center",
                  minWidth: "150px",
                  cursor: "pointer",
                }}
              >
                <h3>{profile.displayName}</h3>
                <p>@{profile.username}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WhosWhoPage;

