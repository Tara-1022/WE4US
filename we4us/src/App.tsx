import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import AnnouncementPage from './pages/AnnouncementPage';
import AuthorisationPage from './pages/AuthorisationPage';
import JobBoardPage from './pages/JobBoard';
import MeetUpPage from './pages/MeetUpPage';
import MeetUpPost from './pages/MeetUpPostPage';
import PgFinderPage from './pages/PgFinder';
import ProfilePage from './pages/ProfilePage';
import ReachingOutPage from './pages/ReachingOut';
import RedirectPage from './pages/RedirectPage';
import WhosWhoPage from './pages/WhosWhoPage';
import PostPage from './pages/PostPage';
import ProtectedRoute from './auth/ProtectedRoute';
import CommunityPage from './pages/CommunityPage';
import Modal from "react-modal";
import AppContextProvider from './AppContextProvider';
import SearchPage from './pages/SearchPage';
import { Menu } from 'lucide-react';
import { BackButton } from './components/NavButtons';
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
              <Route path="/login" element={<AuthorisationPage />} />
              <Route path="/home" element={<LandingPage />} />
              <Route path="/" element={<ProtectedRoute />} >
                <Route path="/announcements" element={<AnnouncementPage />} />
                <Route path="/job-board" element={<JobBoardPage />} />               
                <Route path="/meetup/:meetUpId" element={<MeetUpPost />} />
                <Route path="/meetup" element={<MeetUpPage />} />
                <Route path="/pg-finder" element={<PgFinderPage />} />
                <Route path="/reaching-out" element={<ReachingOutPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/post/:postId" element={<PostPage />} />
                <Route path="/community/:communityId" element={<CommunityPage />} />
                <Route path="/profile/:username" element={<ProfilePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/whos-who" element={<WhosWhoPage />} />
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/*" element={<RedirectPage />} />
              </Route>
            </Routes>
          </main>
        </div>
      </Router>
    </AppContextProvider>
  );
};
export default App;