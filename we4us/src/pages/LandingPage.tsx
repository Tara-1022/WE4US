import React from 'react';
import AnnouncementsPreview from '../components/Announcements/AnnouncementsPreview';
import "../components/Announcements/AnnouncementsPreview.css"
const LandingPage: React.FC = () => {
  return (
    <>
      <h1>Landing Page</h1>
      <AnnouncementsPreview />
    </>
  )
}

export default LandingPage;