import React, { useEffect, useState } from 'react';
import { fetchProfiles, Profile } from "../library/PostgresAPI";
import { Loader, Search } from 'lucide-react';
import ProfileSnippet from "../components/ProfileSnippet";
import Carousel from '../components/Carousel';
import "../styles/WhosWhoPage.css"

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
      profile.display_name.toLowerCase().includes(query) ||
      profile.username.toLowerCase().includes(query) ||
      (profile.cohort?.toLowerCase().trim() ?? "").includes(query) ||
      (profile.company_or_university?.toLowerCase().trim() ?? "").includes(query)
      // (profile.current_role?.toLowerCase().trim() ?? "").includes(query)
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
      <h1>Who's Who?</h1>

      {/* Search Box */}
      <Search className='search-icon'/>
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
              <Carousel
                items={groupedProfiles[cohort].map((profile) => (
                  <ProfileSnippet
                    key={profile.username}
                    profile={profile}
                  />
                ))}
                scrollBy={300}
                classPrefix={"C" + cohort}
              />
          </div>
        ))
      ) : (
        <p>No profiles found.</p>
      )}
    </div>
  );
};

export default WhosWhoPage;
