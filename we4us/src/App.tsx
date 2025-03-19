import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import AnnouncementPage from './pages/AnnouncementPage';
import AuthorisationPage from './pages/AuthorisationPage';
import MeetUpPage from './pages/MeetUpPage';
// import MeetUpPage from './pages/MeetUpPage';
import PgFinderPage from './pages/PgFinder';
import ProfilePage from './pages/ProfilePage';
import ReachingOutPage from './pages/ReachingOut';
import WhosWhoPage from './pages/WhosWhoPage';
import PostPage from './pages/PostPage';
import ProtectedRoute from './auth/ProtectedRoute';
import CommunityPage from './pages/CommunityPage';
import Modal from "react-modal";
import AppContextProvider from './AppContextProvider';
import SearchPage from './pages/SearchPage';
import { BackButton, HomeButton } from './components/NavButtons';
import MeetUpPost from './pages/MeetUpPostPage';
import JobBoard from './pages/JobBoard';



Modal.setAppElement('#root');

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <Router>
        <div className="relative min-h-screen">
          <Sidebar />
          <BackButton/>
          <HomeButton/>
          <main className="pt-10 px-4">
            <Routes>
              <Route path="/login" element={<AuthorisationPage />} />
              <Route path="/" element={<LandingPage />} />
              <Route path="/" element={<ProtectedRoute />} >
                <Route path="/announcements" element={<AnnouncementPage />} />
                <Route path="/job-board" element={<JobBoard />} />
                <Route path="/meet-up/:meetUpId" element={<MeetUpPost />} />
                <Route path="/meetup" element={<MeetUpPage />} />
                <Route path="/pg-finder" element={<PgFinderPage />} />
                <Route path="/reaching-out" element={<ReachingOutPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/post/:postId" element={<PostPage />} />
                <Route path="/community/:communityId" element={<CommunityPage />} />
              </Route>
              {/* TODO: Move these back into the protected route */}
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/whos-who" element={<WhosWhoPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppContextProvider>
  );
};


export default App;
