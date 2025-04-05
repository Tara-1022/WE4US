import React from 'react';
import AnnouncementsPreview from '../announcements/AnnouncementsPreview';
import "../announcements/AnnouncementsPreview.css"
const LandingPage: React.FC = () => {
  return (
    <>
      <h1>Landing Page</h1>
      <AnnouncementsPreview />
    </>
  )
}

export default LandingPage;