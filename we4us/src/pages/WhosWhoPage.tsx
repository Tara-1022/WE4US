import React, { useEffect, useState } from 'react';
import { fetchProfiles } from "../library/PostgresAPI"; 
import { Loader } from 'lucide-react';
import ProfileSnippet from "../components/ProfileSnippet";
import "../styles/WhosWhoPage.css"

interface Profile {
  id: number;
  username: string;
  displayName: string;
  cohort?: string;
  companyOrUniversity?: string;
  currentRole?: string;
}

const WhosWhoPage: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProfiles = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const profilesData = await fetchProfiles();
        setProfiles(profilesData);

      } catch (error) {
        setError(error instanceof Error ? error.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    }; 

    getProfiles();
  }, []);

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  // Filter profiles based on search query
  const filteredProfiles = profiles.filter((profile) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      profile.displayName.toLowerCase().includes(query) ||
      profile.username.toLowerCase().includes(query) ||
      (profile.cohort?.toLowerCase().trim() ?? "").includes(query) ||
      (profile.companyOrUniversity?.toLowerCase().trim() ?? "").includes(query)
      // (profile.currentRole?.toLowerCase().trim() ?? "").includes(query)
    );
  }); 

  // Group profiles by cohort
  const groupedProfiles: { [key: string]: Profile[] } = {};
  filteredProfiles.forEach((profile) => {
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
      <div className='whoswho-container'>
        <h1>Who's Who</h1>
  
        {/* Search Box */}
        <input
          type="text"
          placeholder="Search by name, company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='search-input'
        />
  
        {/* Cohort-wise Profile Display */}
        {sortedCohorts.length > 0 ? (
          sortedCohorts.map((cohort) => (
            <div key={cohort} className='cohort-section'>
              <h2>Cohort {cohort}</h2>
              <div className='profile-list'>
                {groupedProfiles[cohort].map((profile) => (
                  <ProfileSnippet
                    key = {profile.username}
                    id = {profile.id}
                    username = {profile.username}
                    displayName = {profile.displayName}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No profiles found.</p>
        )}
      </div>
    );
  };  

  export default WhosWhoPage;
