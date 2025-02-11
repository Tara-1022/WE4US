import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import AnnouncementPage from './pages/AnnouncementPage';
import AuthorisationPage from './pages/AuthorisationPage';
import JobBoardPage from './pages/JobBoard';
import MeetUpPage from './pages/MeetUpPage';
import PgFinderPage from './pages/PgFinder';
import ProfilePage from './pages/ProfilePage';
import ReachingOutPage from './pages/ReachingOut';
import WhosWhoPage from './pages/WhosWhoPage';
import PostPage from './components/PostPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="relative min-h-screen">
        <Sidebar />
        <main className="pt-10 px-4">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/announcements" element={<AnnouncementPage />} />
            <Route path="/authorization" element={<AuthorisationPage />} />
            <Route path="/job-board" element={<JobBoardPage />} />
            <Route path="/meetup" element={<MeetUpPage />} />
            <Route path="/pg-finder" element={<PgFinderPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/reaching-out" element={<ReachingOutPage />} />
            <Route path="/whos-who" element={<WhosWhoPage />} />
            <Route path="/post/:postId" element={<PostPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};


export default App;