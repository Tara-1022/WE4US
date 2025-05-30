import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import AnnouncementPage from './pages/AnnouncementPage';
import AnnouncementPostPage from './pages/AnnouncementPostPage';
import JobBoardPage from './pages/JobBoardPage';
import MeetUpPage from './pages/MeetUpPage';
import MeetUpPost from './pages/MeetUpPostPage';
import PgFinderPage from './pages/PgFinderPage';
import ProfilePage from './pages/ProfilePage';
import ReachingOutPage from './pages/ReachingOut';
import RedirectPage from './pages/RedirectPage';
import WhosWhoPage from './pages/WhosWhoPage';
import PostPage from './pages/PostPage';
import ProtectedRoute from './auth/ProtectedRoute';
import CommunityPage from './pages/CommunityPage';
import ReachingOutSearchPage from './pages/ReachingOutSearchPage';
import SpecialisedSearchPage from './pages/SpecialisedSearchPage';
import AppContextProvider from './AppContextProvider';
import Chat from './pages/Chat';

import Modal from "react-modal";
import PgPostPage from './pages/PgPostPage';
import JobPostPage from './pages/JobPostPage';

import { Menu } from 'lucide-react';
import { BackButton } from './components/NavButtons';
import { ANNOUNCEMENTS_COMMUNITY_NAME, JOB_BOARD_COMMUNITY_NAME, MEET_UP_COMMUNITY_NAME, PG_FINDER_COMMUNITY_NAME } from './constants';


Modal.setAppElement('#root');

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  return (
    <AppContextProvider>
      <Router>
        <BackButton />
        <div className="relative min-h-screen bg-[#1e1e1e]">
          <button
            onClick={toggleSidebar}
            className="sidebar-toggle"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Sidebar isOpen={isSidebarOpen} />

          <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <Routes>
              <Route path="/home" element={<LandingPage />} />
              <Route path="/" element={<Navigate to="/home" />} />

              <Route path="/" element={<ProtectedRoute />} >
                <Route path="/announcements" element={<AnnouncementPage />} />
                <Route path="/announcements/:announcementId" element={<AnnouncementPostPage />} />
                <Route path="/announcements/search" element={<SpecialisedSearchPage community={ANNOUNCEMENTS_COMMUNITY_NAME} />} />

                <Route path="/job-board" element={<JobBoardPage />} />   
                <Route path="/job-board/:jobId" element={<JobPostPage/>}/>   
                <Route path="/job-board/search" element={<SpecialisedSearchPage community={JOB_BOARD_COMMUNITY_NAME} />} />

                <Route path="/meetup/" element={<MeetUpPage />} />
                <Route path="/meetup/:meetUpId" element={<MeetUpPost />} />
                <Route path="/meetup/search" element={<SpecialisedSearchPage community={MEET_UP_COMMUNITY_NAME} />} />

                <Route path="/pg-finder" element={<PgFinderPage />} />
                <Route path="/pg-finder/:pgId" element={<PgPostPage />} />
                <Route path="/pg-finder/search" element={<SpecialisedSearchPage community={PG_FINDER_COMMUNITY_NAME} />} />
                
                <Route path="/reaching-out" element={<ReachingOutPage />} />
                <Route path="/chat/:to_user" element={<Chat/>}/>
                <Route path="/search" element={<ReachingOutSearchPage />} />
                <Route path="/post/:postId" element={<PostPage />} />
                <Route path="/community/:communityId" element={<CommunityPage />} />

                <Route path="/whos-who" element={<WhosWhoPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/:username" element={<ProfilePage />} />

              </Route>
              <Route path="/*" element={<RedirectPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppContextProvider>
  );
};
export default App;